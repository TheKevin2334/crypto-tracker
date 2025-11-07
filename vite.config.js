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
  preview: {
    port: 4173,
    allowedHosts: [
      "crypto-tracker-h3h5.onrender.com", // ✅ your Render domain
      "localhost",
    ],
  },
  server: {
    port: 5173,
    allowedHosts: ["localhost"],
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/api-evm": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/api-ai": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/api-usdt": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
