// script.js

// Get DOM elements
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Function to append messages
function appendMessage(message, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg", sender);
  msgDiv.textContent = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to send user message and get bot reply
async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Display user message
  appendMessage(userMessage, "user");
  input.value = "";

  try {
    // Call serverless function
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    const botReply = data.reply || "Sorry, no reply received.";

    // Display bot reply
    appendMessage(botReply, "bot");

  } catch (err) {
    appendMessage(`Error: ${err.message}`, "bot");
    console.error("Chat error:", err);
  }
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});