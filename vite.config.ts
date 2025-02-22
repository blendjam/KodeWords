import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/KodeWords/",
  build: {
    outDir: "build",
  },
  plugins: [react()],
});
