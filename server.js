// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve built frontend
app.use(express.static(path.join(__dirname, "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Launch backend APIs
function runAPI(name, file) {
  console.log(`🚀 Starting ${name} (${file})...`);
  const proc = spawn("node", [file], { stdio: "inherit" });
  proc.on("close", (code) => console.log(`❌ ${name} exited (${code})`));
}

runAPI("TRON API", "./api2/api.js");
runAPI("EVM API", "./api2/apii.js");

// Catch-all route (React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Main server running on port ${PORT}`);
});
