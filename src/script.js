function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div><b>You:</b> ${userInput}</div>`;

    fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
    })
        .then(response => response.json())
        .then(data => {
            chatBox.innerHTML += `<div><b>Bot:</b> ${data.response}</div>`;
        })
        .catch(error => console.error("Error:", error));
}
