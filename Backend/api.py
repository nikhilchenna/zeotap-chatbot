from fastapi import FastAPI
import json

app = FastAPI()

# Load embeddings
with open("embeddings.json", "r") as f:
    embeddings = json.load(f)

@app.get("/")
def home():
    return {"message": "Chatbot API is running!"}

@app.get("/chatbot/")
def chatbot(query: str):
    return {"response": "This will be replaced with actual chatbot logic"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
