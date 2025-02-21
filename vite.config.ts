import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    outDir: "docs", // Remplacez 'dist' par 'docs'
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["ml5", "p5"],
  },
  server: {
    port: 3000,
  },
});
