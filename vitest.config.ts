import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    env: {
      VITE_API_URL: "http://localhost:3000",
      VITE_THIS_URL: "http://localhost:5173",
      VITE_LANGUAGE: "es",
      VITE_BASIC_KEY: "test-key",
      VITE_ACCEPT_COOKIE: "accept-cookie",
      VITE_DECLINE_COOKIE: "decline-cookie",
      VITE_REMEMBER: "remember",
      VITE_USER: "user",
      VITE_VALIDATION_COOKIE: "validation",
      VITE_RECOVERING_COOKIE: "recovering",
      VITE_CRYPTO: "crypto-key",
      VITE_SUPABASE_CO: "https://test.supabase.co",
      VITE_SUPABASE_ANON: "test-anon-key",
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**"],
    server: {
      deps: {
        inline: [/@sito\/dashboard-app/, /@sito\/dashboard/],
      },
    },
  },
  resolve: {
    alias: [
      { find: "api", replacement: path.resolve(__dirname, "./src/api") },
      { find: "assets", replacement: path.resolve(__dirname, "./src/assets") },
      {
        find: "components",
        replacement: path.resolve(__dirname, "./src/components"),
      },
      {
        find: "partials",
        replacement: path.resolve(__dirname, "./src/partials"),
      },
      { find: "lib", replacement: path.resolve(__dirname, "./src/lib") },
      { find: "hooks", replacement: path.resolve(__dirname, "./src/hooks") },
      { find: "utils", replacement: path.resolve(__dirname, "./src/utils") },
      {
        find: "layouts",
        replacement: path.resolve(__dirname, "./src/layouts"),
      },
      { find: "pages", replacement: path.resolve(__dirname, "./src/pages") },
      {
        find: "providers",
        replacement: path.resolve(__dirname, "./src/providers"),
      },
      { find: "db", replacement: path.resolve(__dirname, "./src/db") },
      { find: "lang", replacement: path.resolve(__dirname, "./src/lang") },
    ],
  },
});
