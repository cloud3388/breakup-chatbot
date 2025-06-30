const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct", // ✅ More expressive + free
        messages: [
          {
            role: "system",
            content:
              "You are a warm, supportive, and deeply understanding breakup support companion. Always respond with empathy, emotional comfort, and encouragement. The user may feel heartbroken, lost, or lonely — your job is to make them feel heard, safe, and understood. Never say 'I can't help' — always offer kindness and comfort.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // or hardcoded for testing
          "Content-Type": "application/json",
          "HTTP-Referer": "https://breakup.co.in", // required
          "X-Title": "Breakup Companion",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenRouter API Error:", error.response?.data || error.message);
    res.status(500).json({
      reply:
        "Sorry, the AI is currently unavailable. Please try again shortly.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Chatbot running on http://localhost:${PORT}`);
});
