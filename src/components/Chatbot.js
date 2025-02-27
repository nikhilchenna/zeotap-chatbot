import { useState, useEffect, useRef } from "react";
import { Card, CardContent, TextField, Button, Typography } from "@mui/material";
import "./styles.css";

export default function ChatbotUI() {
    const [messages, setMessages] = useState([]);
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
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });

            if (!response.ok) throw new Error("Failed to fetch response");

            const data = await response.json();
            setMessages((prev) => [...prev, { sender: "Bot", text: data.response }]);
        } catch (error) {
            console.error("Error:", error);
            setError("Failed to send message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "20px" }}>
            <Card style={{ width: "100%", maxWidth: "500px", padding: "16px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <CardContent style={{ height: "400px", overflowY: "auto", backgroundColor: "#fff", padding: "12px", borderRadius: "8px" }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{
                            marginBottom: "8px",
                            padding: "8px",
                            borderRadius: "6px",
                            backgroundColor: msg.sender === "User" ? "#cfe8fc" : "#e0e0e0",
                            textAlign: msg.sender === "User" ? "right" : "left"
                        }}>
                            <Typography variant="body1">
                                <strong>{msg.sender}: </strong>{msg.text}
                            </Typography>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </CardContent>
                <div style={{ display: "flex", marginTop: "16px" }}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={sendMessage}
                        style={{ marginLeft: "8px" }}
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send"}
                    </Button>
                </div>
                {error && (
                    <Typography variant="body2" style={{ color: "red", textAlign: "center", marginTop: "8px" }}>
                        {error}
                    </Typography>
                )}
            </Card>
        </div>
    );
}
