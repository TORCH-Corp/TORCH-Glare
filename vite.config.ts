import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import copy from "rollup-plugin-copy";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ["src/lib"] }),
    libInjectCss(),
    tsconfigPaths(), // Add this plugin to handle TypeScript paths
    copy({
      targets: [
        { src: "src/lib/styles/mediaQuery", dest: "dist/responsive" },
        { src: "src/lib/styles/colors", dest: "dist/" },
      ],
      hook: "writeBundle", // Ensure the plugin runs at the right time
    }),
  ],
  css: {
    modules: {
      scopeBehaviour: "local",
    },
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/typography/index";
          @import "@/styles/mediaQuery/queries";
        `,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src/lib"),
    },
  },
  build: {
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      input: Object.fromEntries(
        glob
          .sync("src/lib/**/*.{ts,tsx}", {
            ignore: ["src/lib/**/*.d.ts"],
          })
          .map((file) => [
            relative(
              "src/lib",
              file.slice(0, file.length - extname(file).length)
            ),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        dir: "dist",
        format: "es",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"), // Adjust this path if needed
      formats: ["es"],
    },
  },
});
