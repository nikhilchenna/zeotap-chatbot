import json
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load the precomputed embeddings
with open("embeddings.json", "r") as f:
    data = json.load(f)

# Convert the stored embeddings into a NumPy array
keys = list(data.keys())
embeddings = np.array([data[key] for key in keys])

# Load the sentence transformer model (same as used for embedding generation)
model = SentenceTransformer("all-MiniLM-L6-v2")

def get_embedding(text):
    """Generate an embedding for the input text using the same model."""
    return model.encode([text])[0]

def find_best_match(query):
    """Find the most relevant response based on cosine similarity."""
    query_embedding = get_embedding(query)  # Convert user query to embedding
    query_embedding = np.array(query_embedding).reshape(1, -1)

    # Compute cosine similarity
    similarities = cosine_similarity(query_embedding, embeddings)[0]
    
    # Find the best match
    best_match_idx = np.argmax(similarities)
    best_match_key = keys[best_match_idx]

    return best_match_key  # Return the most relevant response

# Example usage
if __name__ == "__main__":
    user_query = input("Enter your query: ")
    best_response = find_best_match(user_query)
    print("Best response:", best_response)
