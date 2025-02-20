import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/lib", // Simple alias for the "src" directory
    },
  },
});

