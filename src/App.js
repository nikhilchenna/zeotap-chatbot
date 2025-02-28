import { useState } from "react";
import { Card, CardContent, TextField, Button, Typography, CircularProgress } from "@mui/material";
import "./App.css"; // Ensure this is linked

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "User", text: input };
    setMessages([...messages, userMessage]); // Add user message to chat
    setInput(""); // Clear input field
    setLoading(true);

    try {
      const res = await fetch("https://your-backend-api.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await res.json();

      const botMessage = { sender: "Bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]); // Add bot message to chat
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { sender: "Bot", text: "Sorry, I couldn't fetch a response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f3f4f6" }}>
      <Card sx={{ width: "500px", height: "600px", padding: "20px", boxShadow: 3 }}>
        <CardContent sx={{ height: "450px", overflowY: "auto", backgroundColor: "#fff", padding: "12px", borderRadius: "8px" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Chatbot
          </Typography>
          {messages.map((msg, index) => (
            <Typography
              key={index}
              sx={{
                backgroundColor: msg.sender === "User" ? "#cfe8fc" : "#e0e0e0",
                padding: "8px",
                borderRadius: "6px",
                textAlign: msg.sender === "User" ? "right" : "left",
                marginBottom: "8px"
              }}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </Typography>
          ))}
        </CardContent>

        <div style={{ display: "flex", marginTop: "16px", gap: "8px" }}>
          <TextField
            variant="outlined"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button variant="contained" color="primary" onClick={sendMessage} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Send"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default App;
