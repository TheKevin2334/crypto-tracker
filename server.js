import { spawn } from "child_process";
import dotenv from "dotenv";
dotenv.config();

const tronPort = process.env.PORT_TRON || 10000;
const evmPort = process.env.PORT_EVM || 10001;

// Start TRON API
const tronAPI = spawn("node", ["./api2/api.js"], {
  env: { ...process.env, PORT: tronPort },
  stdio: "inherit",
});
tronAPI.on("exit", (code) => console.log(`TRON API exited with code ${code}`));

// Start EVM API
const evmAPI = spawn("node", ["./api2/apii.js"], {
  env: { ...process.env, PORT: evmPort },
  stdio: "inherit",
});
evmAPI.on("exit", (code) => console.log(`EVM API exited with code ${code}`));
