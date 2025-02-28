from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# Load pre-trained Sentence Transformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Sample chatbot data (Replace with your own data)
documents = [
    "What are your working hours?",
    "How do I reset my password?",
    "Where is your office located?"
]

# Convert documents into embeddings
embeddings = model.encode(documents)

# Store embeddings in FAISS
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)  # L2 distance index
index.add(np.array(embeddings))

print("Embeddings stored successfully!")
