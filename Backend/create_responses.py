import numpy as np

# Create a list of example responses (replace with actual responses)
responses = [
    "Hello! How can I help you?",
    "Sure, I can provide more information.",
    "I'm sorry, but I don't understand that request.",
    "Here is what I found for you...",
    "Let me assist you with that!"
]

# Convert list to NumPy array
responses_array = np.array(responses, dtype=object)

# Save the responses to a file
np.save("responses.npy", responses_array)

print("responses.npy saved successfully!")
