const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(text, who) {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addTyping() {
  const div = document.createElement("div");
  div.className = "msg bot typing";
  div.id = "typing-indicator";
  div.innerHTML = `<span></span><span></span><span></span>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "me");
  userInput.value = "";
  addTyping();

  try {
    // IMPORTANT:
    // If you open the page from http://localhost:3000 (served by Express),
    // you can use "/chat".
    // If you open from Live Server (5500), use "http://localhost:3000/chat".
    const CHAT_URL = "/chat";

    const res = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    removeTyping();

    if (!res.ok) {
      addMessage(`❌ ${data?.reply || "Error talking to server"}`, "bot");
      return;
    }

    addMessage(data.reply || "No reply returned.", "bot");
  } catch (err) {
    removeTyping();
    addMessage(`❌ Network error: ${String(err)}`, "bot");
  }
}

// Button click
sendBtn.addEventListener("click", sendMessage);

// Enter key send
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});