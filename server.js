// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Import your existing API routers
import tronApi from "./api2/api.js";
import evmApi from "./api2/apii.js";
import aiApi from "./api2/api-ai.js"; // make sure your AI routes are exported as a router

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());

// Mount your APIs
app.use("/api-tron", tronApi);
app.use("/api-evm", evmApi);
app.use("/api-ai", aiApi);

// Serve frontend
const frontendPath = path.join(__dirname, "dist"); // Vite build output
app.use(express.static(frontendPath));

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 4173;
app.listen(PORT, () => {
  console.log(`✅ Frontend + APIs running on port ${PORT}`);
});
