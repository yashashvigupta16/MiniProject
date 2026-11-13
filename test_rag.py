
from ml_engine.rag_retriever import (
    load_knowledge_base,
    create_knowledge_embeddings,
    create_faiss_index,
    retrieve_relevant_knowledge
)

knowledge = load_knowledge_base()

embeddings = create_knowledge_embeddings(knowledge)

index = create_faiss_index(embeddings)

# Different queries for testing
test_queries = [
    "Python programming",
    "SQL database queries",
    "favorite pizza recipe",
    "weather forecast today"
]

print("\n===== RAG RETRIEVAL TEST =====")

for query in test_queries:

    print("\nQuery:", query)

    results = retrieve_relevant_knowledge(
        query,
        index,
        knowledge,
        top_k=1,
        threshold=0.30
    )

    if results:
        print("Retrieved Skill:", results[0]["skill"])
    else:
        print("No relevant knowledge found")

print("\n===== TEST COMPLETED =====")
