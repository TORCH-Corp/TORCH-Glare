import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import react from "@vitejs/plugin-react";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/lib", // Simple alias for the "src" directory
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
});

