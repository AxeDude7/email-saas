import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load env
dotenv.config();

// Debug: check API key
console.log("API KEY:", process.env.OPENROUTER_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// OpenRouter config
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Email SaaS",
  },
});

// Route
app.post("/rewrite", async (req, res) => {
  try {
    console.log("API HIT");

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "user",
          content: `Rewrite this email professionally:\n${text}`,
        },
      ],
    });

    console.log("FULL RESPONSE:", response);

    const output =
      response?.choices?.[0]?.message?.content || "No response";

    res.json({ output });

  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});