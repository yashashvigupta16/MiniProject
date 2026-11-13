
from ml_engine.pdf_parser import extract_text_from_pdf
from ml_engine.role_ranker import rank_roles

# Read resume
resume = extract_text_from_pdf("sample-resume-information-technology.pdf")

# Get ranked job roles with skill gaps and RAG knowledge
results = rank_roles(resume)

print("\n===== RESUME ROLE MATCHING REPORT =====")

for i, role in enumerate(results):

    print(f"\nRank: {i + 1}")
    print("Job Role:", role["role_name"])
    print("Similarity Score:", role["similarity_score"], "%")
    print("Overall Match Score:", role["overall_match_score"], "%")
    print("Matched Skills:", role["matched_skills"])
    print("Missing Skills:", role["missing_skills"])
    print("Skill Match Percentage:", role["skill_match_percentage"], "%")

    print("\n--- RAG Retrieved Knowledge ---")

    for item in role["retrieved_knowledge"]:
        print("Skill:", item["skill"])
        print("Information:", item["content"])
        print("Learning Recommendation:", item["recommendation"])

print("\n===== REPORT COMPLETED =====")
