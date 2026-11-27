import os
import sys
import zipfile
from xml.etree import ElementTree
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import PyPDF2

# ── path setup ────────────────────────────────────────────────────────────────
# Make sure both the project root (for ml_engine + data/) and Backend/ (for
# db.py / gemini_helper.py) are on sys.path regardless of CWD.
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
for p in (BACKEND_DIR, PROJECT_ROOT):
    if p not in sys.path:
        sys.path.insert(0, p)

from db import resumes_col, analyses_col
from gemini_helper import parse_resume_with_gemini, analyze_roles_with_gemini

# ml_engine lives in the project root
from ml_engine.pdf_parser import extract_text_from_pdf
from ml_engine.role_ranker import rank_roles

# ── app setup ─────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)
app.config["MAX_CONTENT_LENGTH"] = 11 * 1024 * 1024  # 10 MB file + form overhead

FRONTEND_DIR = os.path.join(PROJECT_ROOT, "Frontend")

UPLOAD_FOLDER = os.path.join(BACKEND_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# job_roles.json and skill_knowledge.json live at PROJECT_ROOT/data/
DATA_DIR = os.path.join(PROJECT_ROOT, "data")


# ── helpers ───────────────────────────────────────────────────────────────────
def _extract_text(filepath: str, filename: str) -> str:
    """Extract plain text from a PDF, DOCX or text file.

    Tries pymupdf (ml_engine.pdf_parser) first for PDFs; falls back to
    PyPDF2 so the route still works even if pymupdf is not installed.
    """
    if filename.lower().endswith(".docx"):
        return _extract_docx(filepath)
    if filename.lower().endswith(".pdf"):
        try:
            text = extract_text_from_pdf(filepath)
            if text.strip():
                return text
        except Exception:
            pass
        # PyPDF2 fallback
        with open(filepath, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            return "".join(page.extract_text() or "" for page in reader.pages)
    else:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()


def _extract_docx(filepath: str) -> str:
    """A DOCX is a zip of XML; read the paragraphs from the main document."""
    ns = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    with zipfile.ZipFile(filepath) as z:
        root = ElementTree.fromstring(z.read("word/document.xml"))
    return "\n".join(
        "".join(t.text or "" for t in p.iter(ns + "t"))
        for p in root.iter(ns + "p")
    )


def _save(collection, document: dict) -> None:
    """Persist to MongoDB; a database outage must not break the dashboard."""
    try:
        collection.insert_one(document)
    except Exception as db_err:
        print("DB WARNING:", db_err)


def _ml_rank(resume_text: str) -> list:
    """Run the SBERT + FAISS ML ranking engine.

    Changes CWD briefly so that rank_roles() can find data/ via its
    relative paths, then restores CWD.
    """
    original_cwd = os.getcwd()
    try:
        os.chdir(PROJECT_ROOT)
        return rank_roles(resume_text)
    finally:
        os.chdir(original_cwd)


# ── routes ────────────────────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/<path:asset>", methods=["GET"])
def frontend_asset(asset):
    return send_from_directory(FRONTEND_DIR, asset)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "Backend is running!"})


@app.route("/api/upload", methods=["POST"])
def upload_resume():
    """
    Upload a resume PDF/DOCX.

    Returns Gemini-parsed profile enriched with ML ranking scores:
    {
      name, summary, skills, education, projects, certifications,
      experience, internships, achievements, rawText,
      ml_ranking: [ { role_name, overall_match_score, similarity_score,
                      matched_skills, missing_skills,
                      skill_match_percentage, retrieved_knowledge }, ... ]
    }
    """
    try:
        if "resume" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["resume"]
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        resume_text = _extract_text(filepath, filename)

        if not resume_text.strip():
            return jsonify({
                "error": "Could not extract text from this PDF "
                         "(it may be a scanned image)."
            }), 400

        # 1. Gemini: structured profile extraction
        extracted_profile = parse_resume_with_gemini(resume_text)

        # 2. ML engine: semantic role ranking (non-fatal – degrade gracefully)
        ml_ranking = []
        ml_error = None
        try:
            ml_ranking = _ml_rank(resume_text)
        except Exception as ml_err:
            ml_error = str(ml_err)
            print("ML RANKING WARNING:", ml_err)

        extracted_profile["ml_ranking"] = ml_ranking
        if ml_error:
            extracted_profile["ml_ranking_error"] = ml_error

        # 3. Persist to MongoDB
        _save(resumes_col, {
            "filename": filename,
            "profile": extracted_profile,
            "ml_ranking": ml_ranking,
        })

        return jsonify(extracted_profile)

    except Exception as e:
        print("UPLOAD ERROR:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/analyze", methods=["POST"])
def analyze():
    """
    Gemini-powered deep role analysis.

    Expects: { profile: {...}, roles: [...] }
    Returns: { results: [ { id, title, score, b, why, matched, missing,
                             proj, weak, recs, gaps, road }, ... ] }
    """
    try:
        data = request.json or {}
        profile = data.get("profile", {})
        roles = data.get("roles", [])

        if not profile or not roles:
            return jsonify({"error": "A profile and at least one role are required."}), 400

        results = analyze_roles_with_gemini(profile, roles)

        _save(analyses_col, {
            "candidate": profile.get("name"),
            "top_role": results[0]["title"] if results else "None",
            "results": results,
        })

        return jsonify({"results": results})

    except Exception as e:
        print("ANALYZE ERROR:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/ml-rank", methods=["POST"])
def ml_rank():
    """
    Pure ML ranking endpoint (SBERT + FAISS, no Gemini call).

    Expects: { resume_text: "..." }
    Returns: { ml_ranking: [ { role_name, overall_match_score,
                                similarity_score, matched_skills,
                                missing_skills, skill_match_percentage,
                                retrieved_knowledge }, ... ] }
    """
    try:
        data = request.json or {}
        resume_text = data.get("resume_text", "").strip()

        if not resume_text:
            return jsonify({"error": "resume_text is required"}), 400

        ranking = _ml_rank(resume_text)
        return jsonify({"ml_ranking": ranking})

    except Exception as e:
        print("ML RANK ERROR:", e)
        return jsonify({"error": str(e)}), 500


# ── entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)
