import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["ml5", "p5"],
  },
  server: {
    port: 3000,
  },
  base: "https://github.com/Pierre-Jean-Sappey-Marinier/baby_cry_analyser",
});
