
import faiss
import numpy as np
import json

from ml_engine.similarity import generate_embedding


# Load skill knowledge from JSON file
def load_knowledge_base(file_path="data/skill_knowledge.json"):

    with open(file_path, "r") as file:
        data = json.load(file)

    return data["knowledge"]


# Generate embeddings for knowledge entries
def create_knowledge_embeddings(knowledge):

    embeddings = []

    for item in knowledge:

        text = item["content"]

        embedding = generate_embedding(text)

        embeddings.append(embedding)

    return np.array(embeddings).astype("float32")


# Create FAISS index
def create_faiss_index(embeddings):

    dimension = embeddings.shape[1]

    # Normalize vectors for cosine similarity
    faiss.normalize_L2(embeddings)

    index = faiss.IndexFlatIP(dimension)

    index.add(embeddings)

    return index


# Retrieve relevant knowledge using FAISS
def retrieve_relevant_knowledge(
    query, index, knowledge, top_k=1, threshold=0.30
):

    query_embedding = generate_embedding(query)

    query_embedding = np.array(
        [query_embedding]
    ).astype("float32")

    # Normalize query vector
    faiss.normalize_L2(query_embedding)

    # Search knowledge base
    scores, indices = index.search(query_embedding, top_k)

    results = []

    for score, i in zip(scores[0], indices[0]):

        if i != -1 and score >= threshold:
            results.append(knowledge[i])

    return results


# Retrieve knowledge for all missing skills
def retrieve_for_missing_skills(
    missing_skills, index, knowledge
):

    retrieved_knowledge = []

    seen_skills = set()

    for skill in missing_skills:

        results = retrieve_relevant_knowledge(
            skill,
            index,
            knowledge,
            top_k=1,
            threshold=0.30
        )

        for item in results:

            if item["skill"] not in seen_skills:

                retrieved_knowledge.append(item)

                seen_skills.add(item["skill"])

    return retrieved_knowledge
