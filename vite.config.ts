import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";

const projectRoot = path.resolve(__dirname);
const appReactRoot = path.resolve(projectRoot, "node_modules/react");
const appReactDomRoot = path.resolve(projectRoot, "node_modules/react-dom");

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    mkcert(),
    VitePWA({
      // el wallet usa "prompt" porque tiene UI de actualizacion;
      // aqui no la hay, asi que el service worker se refresca solo.
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Horizon Dashboard",
        short_name: "Horizon",
        description: "Panel de administracion del juego Horizon.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#f1f5f9",
        theme_color: "#041e42",
        lang: "es",
        icons: [
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
      },
      workbox: {
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  server: {
    port: 5173,
    https: {},
    fs: {
      strict: true,
      allow: [projectRoot],
      deny: [".env", ".env.*", "*.pem", "*.crt", "*.key", ".git/**"],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (!id.includes("node_modules")) return;
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router-dom/")
          ) {
            return "vendor-react";
          }
          if (
            id.includes("/i18next/") ||
            id.includes("/react-i18next/") ||
            id.includes("/i18next-browser-languagedetector/")
          ) {
            return "vendor-i18n";
          }
          if (id.includes("/@tanstack/react-query/")) return "vendor-query";
          if (
            id.includes("/@sito/dashboard-app/") ||
            id.includes("/@sito/dashboard/")
          ) {
            return "vendor-sito";
          }
          if (id.includes("/@fortawesome/")) return "vendor-icons";
          if (id.includes("/react-tooltip/")) return "vendor-tooltip";
          return;
        },
      },
    },
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: [
      { find: /^react$/, replacement: appReactRoot },
      { find: /^react\/(.*)$/, replacement: `${appReactRoot}/$1` },
      { find: /^react-dom$/, replacement: appReactDomRoot },
      { find: /^react-dom\/(.*)$/, replacement: `${appReactDomRoot}/$1` },
      { find: "api", replacement: path.resolve(__dirname, "./src/shared/api") },
      {
        find: "assets",
        replacement: path.resolve(__dirname, "./src/shared/assets"),
      },
      {
        find: "components",
        replacement: path.resolve(__dirname, "./src/shared/components"),
      },
      {
        find: "partials",
        replacement: path.resolve(__dirname, "./src/shared/partials"),
      },
      { find: "lib", replacement: path.resolve(__dirname, "./src/shared/lib") },
      {
        find: "hooks",
        replacement: path.resolve(__dirname, "./src/shared/hooks"),
      },
      {
        find: "utils",
        replacement: path.resolve(__dirname, "./src/shared/utils"),
      },
      {
        find: "lang",
        replacement: path.resolve(__dirname, "./src/shared/lang"),
      },
      {
        find: "layouts",
        replacement: path.resolve(__dirname, "./src/app/layouts"),
      },
      { find: "pages", replacement: path.resolve(__dirname, "./src/app") },
      {
        find: "providers",
        replacement: path.resolve(__dirname, "./src/app/providers"),
      },
      { find: "app", replacement: path.resolve(__dirname, "./src/app") },
      { find: "shared", replacement: path.resolve(__dirname, "./src/shared") },
      {
        find: "features",
        replacement: path.resolve(__dirname, "./src/features"),
      },
    ],
  },
});
