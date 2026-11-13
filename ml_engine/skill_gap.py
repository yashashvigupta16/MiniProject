
def analyze_skill_gap(resume_skills, required_skills):

    # Convert skills to lowercase for comparison
    resume_skills = [skill.lower() for skill in resume_skills]

    matched_skills = []
    missing_skills = []

    for skill in required_skills:

        if skill.lower() in resume_skills:
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    # Calculate skill match percentage
    if len(required_skills) > 0:
        match_percentage = (
            len(matched_skills) / len(required_skills)
        ) * 100
    else:
        match_percentage = 0

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "skill_match_percentage": round(match_percentage, 2)
    }
