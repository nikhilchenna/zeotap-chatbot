from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from flask_cors import CORS
import logging
import os
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
CORS(app)

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Caching setup
cache = Cache(app, config={'CACHE_TYPE': 'SimpleCache'})

# Rate limiting setup
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Load Sentence Transformer model
model_name = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")
model = SentenceTransformer(model_name)

# Documents and FAISS index
documents = [
    "Segment allows companies to collect, clean, and control customer data.",
    "mParticle is a data pipeline that allows businesses to unify customer data.",
    "Lytics provides a customer data platform with identity resolution capabilities.",
    "Zeotap is a customer intelligence platform that provides actionable insights."
]

index = faiss.IndexFlatL2(384)  # Assuming 384-dim embeddings
doc_embeddings = model.encode(documents)
index.add(np.array(doc_embeddings))

# Define greetings
greetings = {"hi", "hello", "hey", "good morning", "good evening", "good afternoon"}

def search(query, k=3, threshold=1.0):
    """Finds relevant documents based on query"""
    try:
        query_embedding = model.encode([query])
        distances, index_results = index.search(np.array(query_embedding), k=k)

        results = []
        for i, distance in zip(index_results[0], distances[0]):
            if distance < threshold:  # Only add relevant results
                results.append(documents[i])

        if not results:
            return ["Sorry, I couldn't understand your query. Please ask about Segment, mParticle, Lytics, or Zeotap."]
        
        return results
    except Exception as e:
        logger.error(f"Search error: {e}")
        return ["Sorry, an error occurred. Please try again."]

@app.route('/')
def home():
    return "Flask is running!"

@app.route('/health')
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/chat', methods=['POST'])
@limiter.limit("10 per minute")
def chat():
    try:
        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({"error": "Invalid request. 'message' field is required."}), 400

        user_message = data["message"].strip().lower()
        
        # Check for greetings
        if user_message in greetings:
            return jsonify({"response": "Hello! How can I assist you with Segment, mParticle, Lytics, or Zeotap?"})

        # Validate input
        if not user_message or len(user_message) > 500:
            return jsonify({"error": "Message must be non-empty and less than 500 characters."}), 400

        # Retrieve the best match
        bot_response = "\n".join(search(user_message, k=3))

        return jsonify({"response": bot_response})
    except Exception as e:
        logger.error(f"Error in /chat: {e}")
        return jsonify({"error": "Internal server error."}), 500

if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)
