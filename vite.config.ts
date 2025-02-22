import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginString from "vite-plugin-string";
import plainText from "vite-plugin-plain-text";

export default defineConfig({
  build: {
    outDir: "build",
  },
  plugins: [
    react(),
    plainText(["**/*.obj"], { namedExport: false }),
    vitePluginString({
      include: ["**/*.glsl"], // Include .glsl files
    }),
  ],
});
