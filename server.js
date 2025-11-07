import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// --- Serve frontend ---
const frontendPath = path.join(process.cwd(), "dist"); // your Vite build folder
app.use(express.static(frontendPath));

// --- Import backend APIs as modules ---
import tronApi from "./api2/api.js";  // Make sure api.js exports a router
import evmApi from "./api2/apii.js";  // Same for apii.js

app.use("/api-tron", tronApi);
app.use("/api-evm", evmApi);

// --- AI Routes ---
import axios from "axios";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

async function generateWithGemini(model, prompt) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const { data } = await axios.post(
    endpoint,
    { contents: [{ role: "user", parts: [{ text: prompt }] }] },
    { params: { key: GEMINI_API_KEY } }
  );
  return data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
}

app.get("/api-ai/health", (req, res) => {
  if (!GEMINI_API_KEY) return res.status(500).json({ ok: false, reason: "GEMINI_API_KEY not configured" });
  res.json({ ok: true, model: GEMINI_MODEL });
});

app.post("/api-ai/summary", async (req, res) => {
  try {
    const { chain, address, balance, transactions } = req.body || {};
    const prompt = `Summarize wallet:\nChain: ${chain}\nAddress: ${address}\nBalance: ${balance}\nTransactions: ${JSON.stringify(transactions || []).slice(0, 6000)}`;
    const summary = await generateWithGemini(GEMINI_MODEL, prompt);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api-ai/chat", async (req, res) => {
  try {
    const { chain, address, balance, transactions, question } = req.body || {};
    if (!question) return res.status(400).json({ error: "question is required" });
    const prompt = `Wallet Context:\nChain: ${chain}\nAddress: ${address}\nBalance: ${balance}\nTransactions: ${JSON.stringify(transactions || []).slice(0, 6000)}\nQuestion: ${question}\nAnswer only based on this data.`;
    const answer = await generateWithGemini(GEMINI_MODEL, prompt);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Catch-all to serve index.html ---
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// --- Start main server ---
const PORT = process.env.PORT || 4173;
app.listen(PORT, () => {
  console.log(`✅ Frontend + APIs + AI running on port ${PORT}`);
});
