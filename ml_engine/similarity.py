
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load the pretrained SBERT model
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text):
    # Convert text into a 384-dimensional vector
    embedding = model.encode(text)
    return embedding


def calculate_similarity(embedding1, embedding2):
    # Calculate similarity between two embeddings
    score = cosine_similarity(
        [embedding1],
        [embedding2]
    )[0][0]

    return round(float(score) * 100, 2)
