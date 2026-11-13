
import json

from ml_engine.similarity import generate_embedding, calculate_similarity
from ml_engine.skill_extractor import extract_skills
from ml_engine.skill_gap import analyze_skill_gap

from ml_engine.rag_retriever import (
    load_knowledge_base,
    create_knowledge_embeddings,
    create_faiss_index,
    retrieve_for_missing_skills
)


def load_job_roles(file_path="data/job_roles.json"):
    with open(file_path, "r") as file:
        data = json.load(file)

    return data["roles"]


def rank_roles(resume_text):

    # Load job roles
    roles = load_job_roles()

    # Load knowledge base
    knowledge = load_knowledge_base()

    # Generate knowledge embeddings
    embeddings = create_knowledge_embeddings(knowledge)

    # Create FAISS index
    index = create_faiss_index(embeddings)

    # Extract skills from resume
    resume_skills = extract_skills(resume_text)

    # Generate resume embedding
    resume_embedding = generate_embedding(resume_text)

    role_scores = []

    for role in roles:

        # Generate job description embedding
        role_embedding = generate_embedding(role["description"])

        # Calculate semantic similarity
        score = calculate_similarity(
            resume_embedding,
            role_embedding
        )

        # Analyze skill gap
        skill_gap = analyze_skill_gap(
            resume_skills,
            role["required_skills"]
        )

        # Retrieve knowledge for missing skills using RAG
        retrieved_knowledge = retrieve_for_missing_skills(
            skill_gap["missing_skills"],
            index,
            knowledge
        )

        # Calculate overall match score
        overall_score = (
            0.6 * score +
            0.4 * skill_gap["skill_match_percentage"]
        )

        role_scores.append({
            "role_name": role["role_name"],
            "similarity_score": score,
            "matched_skills": skill_gap["matched_skills"],
            "missing_skills": skill_gap["missing_skills"],
            "skill_match_percentage": skill_gap["skill_match_percentage"],
            "overall_match_score": round(overall_score, 2),
            "retrieved_knowledge": retrieved_knowledge
        })

    # Sort roles by overall match score
    role_scores.sort(
        key=lambda x: x["overall_match_score"],
        reverse=True
    )

    return role_scores
