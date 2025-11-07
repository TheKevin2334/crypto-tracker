import express from "express";
import path from "path";
import { spawn } from "child_process";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());

// Ports
const tronPort = process.env.PORT_TRON || 10000;
const evmPort = process.env.PORT_EVM || 10001;
const mainPort = process.env.PORT || 4173;

// --- Serve frontend ---
const frontendPath = path.join(process.cwd(), "dist");
app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// --- AI Routes ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

async function generateWithGemini(model, prompt) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const { data } = await axios.post(
    endpoint,
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    },
    { params: { key: GEMINI_API_KEY } }
  );
  return data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
}

// Health check
app.get("/api-ai/health", (req, res) => {
  if (!GEMINI_API_KEY) return res.status(500).json({ ok: false, reason: "GEMINI_API_KEY not configured" });
  res.json({ ok: true, model: GEMINI_MODEL });
});

// Summary
app.post("/api-ai/summary", async (req, res) => {
  if (!GEMINI_API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  const { chain, address, balance, transactions } = req.body || {};
  const prompt = `Summarize wallet:
Chain: ${chain}
Address: ${address}
Balance: ${balance}
Transactions: ${JSON.stringify(transactions || []).slice(0, 6000)}`;
  try {
    const text = await generateWithGemini(GEMINI_MODEL, prompt);
    res.json({ summary: text });
  } catch (e) {
    res.status(500).json({ error: e.message || "AI summary failed" });
  }
});

// Chat
app.post("/api-ai/chat", async (req, res) => {
  if (!GEMINI_API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  const { chain, address, balance, transactions, question } = req.body || {};
  if (!question) return res.status(400).json({ error: "question is required" });

  const prompt = `Wallet Context:
Chain: ${chain}
Address: ${address}
Balance: ${balance}
Transactions: ${JSON.stringify(transactions || []).slice(0, 6000)}

Question: ${question}
Answer based only on the provided data.`;

  try {
    const text = await generateWithGemini(GEMINI_MODEL, prompt);
    res.json({ answer: text });
  } catch (e) {
    res.status(500).json({ error: e.message || "AI chat failed" });
  }
});

// --- Start TRON API ---
const tronAPI = spawn("node", ["./api2/api.js"], {
  env: { ...process.env, PORT: tronPort },
  stdio: "inherit",
});
tronAPI.on("exit", (code) => console.log(`TRON API exited with code ${code}`));

// --- Start EVM API ---
const evmAPI = spawn("node", ["./api2/apii.js"], {
  env: { ...process.env, PORT: evmPort },
  stdio: "inherit",
});
evmAPI.on("exit", (code) => console.log(`EVM API exited with code ${code}`));

// --- Start main server ---
app.listen(mainPort, () => {
  console.log(`✅ Frontend + APIs + AI running on port ${mainPort}`);
});
