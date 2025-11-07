import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
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
      "crypto-tracker-h3h5.onrender.com",
    ],
    proxy: {
      "/api": {
        target: "http://localhost:3000", // backend
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
      "/api-ai": {
        target: "http://localhost:3000", // 👈 fix: add AI proxy
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 8080,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "crypto-tracker-h3h5.onrender.com",
    ],
  },
}));
