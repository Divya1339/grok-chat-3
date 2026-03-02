// api/chat.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { message } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ reply: "Server error: GROQ_API_KEY missing." });
  }

  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Bad request: message is required." });
  }

  try {
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
    const reply = data?.choices?.[0]?.message?.content ?? "No reply returned.";
    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error.", error: String(err) });
  }
}