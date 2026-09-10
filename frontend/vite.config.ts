import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/KodeWords/",
  build: {
    outDir: "build",
  },
  resolve: {
    alias: {
      "@kodewords/shared": fileURLToPath(new URL("../shared", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: false,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,ttf,woff,woff2}"],
      },
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png", "assets/**/*.*"],
      manifest: {
        name: "KodeWords",
        short_name: "KodeWords",
        description: "A fun word game.",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        scope: "/KodeWords/",
        start_url: "/KodeWords/",
        icons: [
          {
            src: "logo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "logo512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
