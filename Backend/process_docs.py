import json

def load_documentation(file_path="documentation.json"):
    with open(file_path, "r", encoding="utf-8") as file:
        docs = json.load(file)
    return docs

if __name__ == "__main__":
    documentation = load_documentation()
    for platform, content in documentation.items():
        print(f"📌 {platform.upper()} Documentation Preview:\n{content[:500]}...\n")
