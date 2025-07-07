import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  define: {
    "process.env": process.env,
  },
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      api: path.resolve(__dirname, "./src/api"),
      assets: path.resolve(__dirname, "./src/assets"),
      components: path.resolve(__dirname, "./src/components"),
      partials: path.resolve(__dirname, "./src/partials"),
      lib: path.resolve(__dirname, "./src/lib"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      utils: path.resolve(__dirname, "./src/utils"),
      layouts: path.resolve(__dirname, "./src/layouts"),
      pages: path.resolve(__dirname, "./src/pages"),
      providers: path.resolve(__dirname, "./src/providers"),
      db: path.resolve(__dirname, "./src/db"),
      lang: path.resolve(__dirname, "./src/lang"),
    },
  },
  plugins: [react(), tailwindcss()],
});
