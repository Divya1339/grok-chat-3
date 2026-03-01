// script.js

// DOM Elements
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Append message to chat
function appendMessage(message, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg", sender);
  msgDiv.textContent = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message to serverless API
async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, "user"); // Show user message
  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    const botReply = data.reply || "No response from server.";
    appendMessage(botReply, "bot");

  } catch (err) {
    appendMessage(`Error: ${err.message}`, "bot");
    console.error("Chat error:", err);
  }
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});