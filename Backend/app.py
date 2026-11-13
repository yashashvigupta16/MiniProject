import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import PyPDF2
from db import resumes_col, analyses_col
from gemini_helper import parse_resume_with_gemini, analyze_roles_with_gemini

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "Backend is running!"})

@app.route("/api/upload", methods=["POST"])
def upload_resume():
    try:
        if "resume" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["resume"]
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        resume_text = ""
        if filename.lower().endswith(".pdf"):
            with open(filepath, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    resume_text += page.extract_text() or ""
        else:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                resume_text = f.read()

        if not resume_text.strip():
            return jsonify({"error": "Could not extract text from this PDF (it may be a scanned image)."}), 400

        extracted_profile = parse_resume_with_gemini(resume_text)
        resumes_col.insert_one({"filename": filename, "profile": extracted_profile})
        return jsonify(extracted_profile)
    except Exception as e:
        print("UPLOAD ERROR:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        profile = data.get("profile", {})
        roles = data.get("roles", [])

        results = analyze_roles_with_gemini(profile, roles)
        analyses_col.insert_one({
            "candidate": profile.get("name"),
            "top_role": results[0]["title"] if results else "None",
            "results": results
        })
        return jsonify({"results": results})
    except Exception as e:
        print("ANALYZE ERROR:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)