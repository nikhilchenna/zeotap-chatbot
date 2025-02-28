import requests
from bs4 import BeautifulSoup
import json

# URLs of the documentation pages
urls = {
    "segment": "https://segment.com/docs/",
    "mparticle": "https://docs.mparticle.com/",
    "lytics": "https://docs.lytics.com/",
    "zeotap": "https://docs.zeotap.com/home/en-us/"
}

documentation = {}

# Fake a browser request using headers
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
}

# Function to scrape documentation text
def scrape_docs(url):
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise error for failed requests

        soup = BeautifulSoup(response.text, "html.parser")

        # Extract meaningful text from paragraphs
        paragraphs = soup.find_all(["p", "li"])
        text_content = "\n".join([p.get_text(strip=True) for p in paragraphs])

        return text_content if text_content else "No useful content found."
    except requests.RequestException as e:
        return f"Error fetching data: {str(e)}"

# Scrape each documentation site
for platform, url in urls.items():
    documentation[platform] = scrape_docs(url)

# Save the extracted data as JSON
with open("documentation.json", "w", encoding="utf-8") as f:
    json.dump(documentation, f, indent=4)

print("✅ Documentation successfully saved to documentation.json!")
