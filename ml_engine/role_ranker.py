
import json
import os

from ml_engine.similarity import generate_embedding, calculate_similarity
from ml_engine.skill_extractor import extract_skills
from ml_engine.skill_gap import analyze_skill_gap

from ml_engine.rag_retriever import (
    load_knowledge_base,
    create_knowledge_embeddings,
    create_faiss_index,
    retrieve_for_missing_skills
)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

# Weight of semantic similarity vs. skill match in the overall score
SEMANTIC_WEIGHT = 0.6
SKILL_WEIGHT = 0.4

# The knowledge base and its FAISS index never change while the server runs,
# so they are built once on first use instead of on every request.
_knowledge_cache = {}


def load_job_roles(file_path=os.path.join(DATA_DIR, "job_roles.json")):
    with open(file_path, "r") as file:
        data = json.load(file)

    return data["roles"]


def _knowledge_index():
    if not _knowledge_cache:
        knowledge = load_knowledge_base(os.path.join(DATA_DIR, "skill_knowledge.json"))
        index = create_faiss_index(create_knowledge_embeddings(knowledge))
        _knowledge_cache.update(knowledge=knowledge, index=index)
    return _knowledge_cache["knowledge"], _knowledge_cache["index"]


def align_roles(resume_text, roles):
    """Score a resume against any roles.

    Each role is {"role_name", "description", "required_skills", "id"?}.
    A pasted job description can be passed as the description; when it has
    no required_skills, they are detected from its text.
    """
    knowledge, index = _knowledge_index()

    resume_skills = extract_skills(resume_text)
    resume_embedding = generate_embedding(resume_text)

    role_scores = []

    for role in roles:
        description = role.get("description") or role["role_name"]
        required = role.get("required_skills") or extract_skills(description)

        # Semantic similarity between the resume and the role text
        score = calculate_similarity(
            resume_embedding,
            generate_embedding(description)
        )

        # Analyze skill gap
        skill_gap = analyze_skill_gap(resume_skills, required)

        # Retrieve knowledge for missing skills using RAG
        retrieved_knowledge = retrieve_for_missing_skills(
            skill_gap["missing_skills"],
            index,
            knowledge
        )

        overall_score = (
            SEMANTIC_WEIGHT * score +
            SKILL_WEIGHT * skill_gap["skill_match_percentage"]
        )

        role_scores.append({
            "id": role.get("id"),
            "role_name": role["role_name"],
            "similarity_score": score,
            "matched_skills": skill_gap["matched_skills"],
            "missing_skills": skill_gap["missing_skills"],
            "skill_match_percentage": skill_gap["skill_match_percentage"],
            "overall_match_score": round(overall_score, 2),
            "retrieved_knowledge": retrieved_knowledge
        })

    return role_scores


def rank_roles(resume_text):
    """Rank the resume against every role in data/job_roles.json."""
    role_scores = align_roles(resume_text, load_job_roles())

    # Sort roles by overall match score
    role_scores.sort(
        key=lambda x: x["overall_match_score"],
        reverse=True
    )

    return role_scores
