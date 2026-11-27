import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Automatically picks the first working Gemini model
MODELS = ["gemini-3.8-flash", "gemini-3.5-flash"]
  
def _generate_json(prompt):
    last_err = None
    # Two passes: "high demand" (503) errors are usually temporary
    for model_name in MODELS * 2:
        try:
            res = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            return json.loads(res.text)
        except Exception as e:
            last_err = e
            continue
    raise last_err

PROFILE_LISTS = ["skills", "education", "projects", "certifications",
                 "experience", "internships", "achievements"]
SCORE_KEYS = ["Skills match", "Project relevance", "Education fit", "Experience depth"]


# The dashboard renders these shapes directly, so coerce whatever the model returns.
def _list(v):
    return v if isinstance(v, list) else ([] if v in (None, "") else [v])


def _text(v):
    if isinstance(v, dict):
        return ", ".join(str(x) for x in v.values() if x)
    return "" if v is None else str(v)


def _strings(v):
    return list(dict.fromkeys(t for t in (_text(x) for x in _list(v)) if t))


def _pct(v):
    try:
        return max(0, min(100, round(float(v))))
    except (TypeError, ValueError, OverflowError):
        return 0


def _pairs(v):
    return [[_text(x[0]), _text(x[1])] for x in _list(v)
            if isinstance(x, list) and len(x) >= 2]


def _normalize_result(item, role):
    b = item.get("b") if isinstance(item.get("b"), dict) else {}
    gaps = []
    for g in _list(item.get("gaps")):
        if isinstance(g, list) and len(g) >= 3:
            current = _pct(g[1])
            gaps.append([_text(g[0]), current, max(current, _pct(g[2]))])
    road = [[_text(p[0]), _text(p[1]), _strings(p[2])]
            for p in _list(item.get("road"))
            if isinstance(p, list) and len(p) >= 3 and _strings(p[2])]
    return {
        "id": role["id"],
        "title": role["title"],
        "score": _pct(item.get("score")),
        "b": {k: _pct(b.get(k)) for k in SCORE_KEYS},
        "why": _text(item.get("why")),
        "matched": _strings(item.get("matched")),
        "missing": _strings(item.get("missing")),
        "proj": _pairs(item.get("proj")),
        "weak": _pairs(item.get("weak")),
        "recs": _strings(item.get("recs")),
        "gaps": gaps,
        "road": road,
    }


def parse_resume_with_gemini(resume_text):
    prompt = f"""
    Extract structured details from this resume text and return ONLY valid JSON in English with these exact keys:
    {{
      "name": "Candidate Full Name",
      "summary": "2-line professional summary",
      "skills": ["skill1", "skill2"],
      "education": ["Degree, College, Year"],
      "projects": ["Project Title - short description"],
      "certifications": ["Cert 1"],
      "experience": ["Role at Company"],
      "internships": ["Intern Role"],
      "achievements": ["Achievement 1"]
    }}
    Resume Text:
    {resume_text[:12000]}
    """
    raw = _generate_json(prompt)
    data = {k: _strings(raw.get(k)) for k in PROFILE_LISTS}
    data["name"] = _text(raw.get("name")) or "Candidate"
    data["summary"] = _text(raw.get("summary"))
    data["rawText"] = resume_text
    return data

def analyze_roles_with_gemini(profile, roles):
    prompt = f"""
    Compare this candidate profile against each target role and return ONLY a valid JSON array in English.
    Each item in the array must strictly match this schema:
    {{
      "id": "role id",
      "title": "role title",
      "score": 82,
      "b": {{"Skills match": 85, "Project relevance": 80, "Education fit": 88, "Experience depth": 75}},
      "why": "2-sentence explanation of fit",
      "matched": ["matched skill 1", "matched skill 2"],
      "missing": ["missing skill 1", "missing skill 2"],
      "proj": [["Project Name", "How it relates to this role"]],
      "weak": [["Skill", "Why it is weak"]],
      "recs": ["Actionable recommendation 1", "Actionable recommendation 2"],
      "gaps": [["Missing Skill", 30, 80]],
      "road": [["Weeks 1-2", "Phase Title", ["Task 1", "Task 2"]], ["Weeks 3-4", "Phase 2", ["Task 1", "Task 2"]]]
    }}

    Candidate Profile: {json.dumps(profile)}
    Target Roles: {json.dumps(roles)}
    """
    raw = _list(_generate_json(prompt))
    by_id = {str(x.get("id")): x for x in raw if isinstance(x, dict)}
    results = [_normalize_result(by_id[str(r["id"])], r)
               for r in roles if str(r["id"]) in by_id]
    if not results:
        raise ValueError("The AI response did not match the selected roles. Please run it again.")
    results.sort(key=lambda x: x["score"], reverse=True)
    return results