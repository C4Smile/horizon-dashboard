import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";
import postcss from "./postcss.config.cjs";

export default defineConfig({
  define: {
    "process.env": process.env,
  },
  css: {
    postcss,
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: [
      {
        find: /^~.+/,
        replacement: (val) => {
          return val.replace(/^~/, "");
        },
      },
    ],
  },
  plugins: [
    react(),
    eslintPlugin({
      cache: false,
      include: ["./src/**/*.js", "./src/**/*.jsx"],
      exclude: [],
    }),
  ],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
