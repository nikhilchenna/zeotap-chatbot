from sentence_transformers import SentenceTransformer
import json

model = SentenceTransformer("all-MiniLM-L6-v2")

def get_embedding(text):
    return model.encode(text).tolist()

def create_embeddings():
    with open("data.json", "r") as f:
        data = json.load(f)

    embeddings = {key: get_embedding(value) for key, value in data.items()}

    with open("embeddings.json", "w") as f:
        json.dump(embeddings, f)

create_embeddings()
