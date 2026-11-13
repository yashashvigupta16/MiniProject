import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Automatically picks the first working Gemini model
MODELS = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-2.5-flash"]
  
def _generate_json(prompt):
    last_err = None
    for model_name in MODELS:
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
    data = _generate_json(prompt)
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
    results = _generate_json(prompt)
    results.sort(key=lambda x: x.get("score", 0), reverse=True)
    return results