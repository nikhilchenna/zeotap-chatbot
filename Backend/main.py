from fastapi import FastAPI
import json
import numpy as np
from sentence_transformers import SentenceTransformer

app = FastAPI()

# Load precomputed embeddings and responses
with open("embeddings.json", "r") as f:
    data = json.load(f)

stored_embeddings = np.array(data["embeddings"])  # Convert list to numpy array
stored_responses = data["responses"]  # List of actual chatbot responses

# Load the SentenceTransformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

def get_best_response(user_query):
    """Finds the best response based on semantic similarity."""
    input_embedding = model.encode(user_query)

    # Compute similarity with stored embeddings
    similarities = np.dot(stored_embeddings, input_embedding)  # Cosine similarity
    best_match_idx = np.argmax(similarities)

    return stored_responses[best_match_idx]  # Return actual text response

@app.get("/")
def home():
    return {"message": "Chatbot API is running!"}

@app.get("/chatbot/")
def chatbot(query: str):
    response = get_best_response(query)
    return {"response": response}  # Return meaningful response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
