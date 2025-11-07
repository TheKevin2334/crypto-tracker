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
      // Allow any Render subdomain automatically
      ".onrender.com",
      "crypto-tracker-h3h5.onrender.com", // ✅ your Render domain explicitly
    ],
    proxy: {
      // Proxy all API requests starting with /api to btcindia
      "/api": {
        target: "https://btcindia.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      // Proxy all API requests starting with /api-usdt to usdtttindia
      "/api-usdt": {
        target: "https://usdtttindia.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api-usdt/, "/api"),
      },
      "/api-evm": {
        target: "https://btcindia.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api-evm/, "/api"),
      },
    },
  },
  preview: {
    port: 8080,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".onrender.com", // wildcard for all Render deployments
      "crypto-tracker-h3h5.onrender.com", // ✅ allow your Render app in preview mode
    ],
  },
}));