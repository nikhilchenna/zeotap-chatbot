import json
from search import find_best_match

def chatbot():
    print("Chatbot is ready! Type 'exit' to stop.")
    
    while True:
        user_query = input("You: ")
        if user_query.lower() == "exit":
            print("Chatbot: Goodbye!")
            break
        
        best_match = find_best_match(user_query)
        print(f"Chatbot: {best_match}")

if __name__ == "__main__":
    chatbot()
