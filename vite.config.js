import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig({
  plugins: [react(), componentTagger()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 4173,
    proxy: {
      "/api": {
        target: "http://localhost:10000", // TRON API
        changeOrigin: true,
      },
      "/api-evm": {
        target: "http://localhost:10001", // EVM API
        changeOrigin: true,
      },
      "/api-usdt": {
        target: "http://localhost:10000", // USDT (TRON port)
        changeOrigin: true,
      },
      "/api-ai": {
        target: "http://localhost:10000", // AI routes on TRON port
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: ["localhost", ".onrender.com"],
  },
});
