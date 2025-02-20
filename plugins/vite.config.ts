import { defineConfig } from "vite";
import path from "path";
import glob from "fast-glob";

const inputFiles = glob.sync("pluginsFile/**/index.js");

// Debugging: Log found files
if (inputFiles.length === 0) {
  console.error("⚠️ No plugins entry files found! Check your paths.");
  process.exit(1); // Stop build if no files are found
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        inputFiles.map((file) => [
          path.relative("pluginsFile", file).replace(/\/index\.js$/, ""), // Use folder name as key
          path.resolve(file), // Absolute path to the file
        ])
      ),
      output: {
        format: "es", // ESM output
        dir: "dist", // Keep build files in plugin/
        entryFileNames: "[name].cjs", // Use folder name as output file
        preserveModules: true, // Keep module structure
      },
    },
    lib: {
      entry: inputFiles,
      formats: ["es", "cjs"], // Generate both ESM & CJS
    },
    emptyOutDir: false, // Don't delete plugin folder
  },
});

