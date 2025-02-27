import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Sorry, I couldn't fetch a response.");
    } finally {
      setLoading(false);
      setInput(""); // Clear input field
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Chatbot</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
        style={{ padding: "8px", width: "250px" }}
      />
      <button onClick={sendMessage} disabled={loading} style={{ marginLeft: "10px" }}>
        {loading ? "Sending..." : "Send"}
      </button>
      <p><strong>Bot:</strong> {response}</p>
    </div>
  );
}

export default App;
