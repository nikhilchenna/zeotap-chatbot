import { useState, useEffect, useRef } from "react";
import { Card, CardContent, TextField, Button, Typography, Box } from "@mui/material";

export default function ChatbotUI() {
    const [messages, setMessages] = useState([
        { sender: "Bot", text: "Hello! How can I assist you with Segment, mParticle, Lytics, or Zeotap?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "User", text: input };
        setMessages([...messages, userMessage]);
        setInput("");
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });
            if (!response.ok) throw new Error("Failed to fetch response");
            const data = await response.json();
            const botMessage = { sender: "Bot", text: data.response };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setError("Failed to send message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#f3f4f6",
                padding: "20px",
            }}
        >
            <Card sx={{ width: "500px", height: "600px", padding: "20px", boxShadow: 3, borderRadius: "12px" }}>
                <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", marginBottom: "12px" }}>
                    Chatbot
                </Typography>
                <CardContent sx={{ height: "450px", overflowY: "auto", backgroundColor: "#fff", padding: "12px", borderRadius: "8px" }}>
                    {messages.map((msg, index) => (
                        <Box
                            key={index}
                            sx={{
                                marginBottom: "8px",
                                padding: "10px",
                                borderRadius: "6px",
                                backgroundColor: msg.sender === "User" ? "#007bff" : "#e0e0e0",
                                color: msg.sender === "User" ? "white" : "black",
                                textAlign: msg.sender === "User" ? "right" : "left",
                                width: "fit-content",
                                maxWidth: "80%",
                                marginLeft: msg.sender === "User" ? "auto" : "0",
                            }}
                        >
                            <Typography variant="body1">
                                <strong>{msg.sender}: </strong>{msg.text}
                            </Typography>
                        </Box>
                    ))}
                    <div ref={messagesEndRef} />
                </CardContent>
                <Box sx={{ display: "flex", marginTop: "16px" }}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        sx={{ flex: 1 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={sendMessage}
                        sx={{ marginLeft: "8px", minWidth: "80px" }}
                        disabled={isLoading}
                    >
                        {isLoading ? "..." : "Send"}
                    </Button>
                </Box>
                {error && (
                    <Typography variant="body2" sx={{ color: "red", textAlign: "center", marginTop: "8px" }}>
                        {error}
                    </Typography>
                )}
            </Card>
        </Box>
    );
}
