import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src/lib", // Simple alias for the "src" directory
    },
  },
  css: {
    modules: {
      scopeBehaviour: "local", // Enables CSS modules with local scope
    },
  }
});
