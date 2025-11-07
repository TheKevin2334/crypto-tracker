import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(() => ({
  plugins: [react(), componentTagger()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "crypto-tracker-h3h5.onrender.com", // your Render app host
    ],
    proxy: {
      // 🔗 Wallet + USDT + EVM APIs
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/api-usdt": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/api-evm": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },

      // 🔗 NEW: Gemini AI routes
      "/api-ai": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "crypto-tracker-h3h5.onrender.com",
    ],
  },
}));
