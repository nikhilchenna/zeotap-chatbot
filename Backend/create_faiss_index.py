import faiss
import numpy as np

# Define the embedding size (must match your stored embeddings)
d = 128  # Adjust this based on your embeddings' dimension

# Create a FAISS index
index = faiss.IndexFlatL2(d)  # L2 distance index

# Generate random embeddings (Replace this with your actual embeddings)
num_vectors = 1000  # Adjust based on your dataset
embeddings = np.random.rand(num_vectors, d).astype('float32')

# Add embeddings to the FAISS index
index.add(embeddings)

# Save the FAISS index
faiss.write_index(index, "faiss_index.bin")

print("FAISS index saved successfully!")
