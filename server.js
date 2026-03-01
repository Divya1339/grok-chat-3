const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// If you want to open UI at http://localhost:3000,
// serve your frontend files from this same server:
app.use(express.static(path.join(__dirname))); // assumes index.html is in same folder

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Node 18+ has fetch. For Node < 18 use node-fetch.
async function getFetch() {
  if (global.fetch) return global.fetch;
  const mod = await import("node-fetch"); // node-fetch v3 requires dynamic import
  return mod.default;
}

// Quick health check
app.get("/health", (req, res) => res.send("OK"));

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      reply: "Server error: GROQ_API_KEY missing in .env",
    });
  }

  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Bad request: message is required." });
  }

  try {
    const fetch = await getFetch();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: message }],
        temperature: 0.7
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq error status:", response.status);
      console.error("Groq error payload:", data);
      return res.status(response.status).json({
        reply: `Groq error (${response.status}): ${data?.error?.message || "Unknown error"}`,
      });
    }

    const reply = data?.choices?.[0]?.message?.content ?? "No reply returned.";
    return res.json({ reply });
  } catch (err) {
    console.error("Server crash error:", err);
    return res.status(500).json({
      reply: "Server error: request failed. Check terminal logs.",
      error: String(err),
    });
  }
});

app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`)
);