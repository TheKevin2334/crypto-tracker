import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
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
        ".onrender.com",
      ],
      proxy: {
        "/api": {
          target: isDev
            ? "http://localhost:3000"
            : "https://crypto-tracker-h3h5.onrender.com",
          changeOrigin: true,
        },
        "/api-usdt": {
          target: isDev
            ? "http://localhost:3000"
            : "https://crypto-tracker-h3h5.onrender.com",
          changeOrigin: true,
        },
        "/api-evm": {
          target: isDev
            ? "http://localhost:3000"
            : "https://crypto-tracker-h3h5.onrender.com",
          changeOrigin: true,
        },
        "/api-ai": {
          target: isDev
            ? "http://localhost:3000"
            : "https://crypto-tracker-h3h5.onrender.com",
          changeOrigin: true,
        },
      },
    },
    preview: {
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        ".onrender.com",
      ],
    },
  };
});
