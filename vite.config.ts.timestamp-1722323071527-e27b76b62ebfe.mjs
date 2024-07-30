// vite.config.ts
import { defineConfig } from "file:///home/sajjad/Desktop/apps/TORCH-Glare/node_modules/vite/dist/node/index.js";
import react from "file:///home/sajjad/Desktop/apps/TORCH-Glare/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///home/sajjad/Desktop/apps/TORCH-Glare/node_modules/vite-plugin-dts/dist/index.mjs";
import { libInjectCss } from "file:///home/sajjad/Desktop/apps/TORCH-Glare/node_modules/vite-plugin-lib-inject-css/dist/index.js";
import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import { glob } from "file:///home/sajjad/Desktop/apps/TORCH-Glare/node_modules/glob/dist/esm/index.js";
import copy from "file:///home/sajjad/Desktop/apps/TORCH-Glare/node_modules/rollup-plugin-copy/dist/index.commonjs.js";
var __vite_injected_original_dirname = "/home/sajjad/Desktop/apps/TORCH-Glare";
var __vite_injected_original_import_meta_url = "file:///home/sajjad/Desktop/apps/TORCH-Glare/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({ include: ["src/lib"] }),
    libInjectCss(),
    copy({
      targets: [
        { src: "src/lib/styles/mediaQuery", dest: "dist/responsive" },
        { src: "src/lib/styles/colors", dest: "dist/" }
      ],
      hook: "writeBundle"
      // Ensure the plugin runs at the right time
    })
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.ts"
  },
  css: {
    modules: {
      scopeBehaviour: "local"
    },
    preprocessorOptions: {
      scss: {}
    }
  },
  build: {
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      input: Object.fromEntries(
        glob.sync("src/lib/**/*.{ts,tsx}", {
          ignore: ["src/lib/**/*.d.ts"]
        }).map((file) => [
          relative(
            "src/lib",
            file.slice(0, file.length - extname(file).length)
          ),
          fileURLToPath(new URL(file, __vite_injected_original_import_meta_url))
        ])
      ),
      output: {
        dir: "dist",
        format: "es",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js"
      },
      plugins: []
    },
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/lib/index.ts"),
      // Adjust this path if needed
      formats: ["es"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9zYWpqYWQvRGVza3RvcC9hcHBzL1RPUkNILUdsYXJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9zYWpqYWQvRGVza3RvcC9hcHBzL1RPUkNILUdsYXJlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3NhamphZC9EZXNrdG9wL2FwcHMvVE9SQ0gtR2xhcmUvdml0ZS5jb25maWcudHNcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcbmltcG9ydCB7IGxpYkluamVjdENzcyB9IGZyb20gJ3ZpdGUtcGx1Z2luLWxpYi1pbmplY3QtY3NzJztcbmltcG9ydCB7IGV4dG5hbWUsIHJlbGF0aXZlLCByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IHsgZ2xvYiB9IGZyb20gJ2dsb2InO1xuaW1wb3J0IGNvcHkgZnJvbSAncm9sbHVwLXBsdWdpbi1jb3B5JztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyBhcyBkZWZpbmVWaXRlc3RDb25maWcgfSBmcm9tICd2aXRlc3QvY29uZmlnJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgZHRzKHsgaW5jbHVkZTogWydzcmMvbGliJ10gfSksXG4gICAgbGliSW5qZWN0Q3NzKCksXG4gICAgY29weSh7XG4gICAgICB0YXJnZXRzOiBbXG4gICAgICAgIHsgc3JjOiAnc3JjL2xpYi9zdHlsZXMvbWVkaWFRdWVyeScsIGRlc3Q6ICdkaXN0L3Jlc3BvbnNpdmUnIH0sXG4gICAgICAgIHsgc3JjOiAnc3JjL2xpYi9zdHlsZXMvY29sb3JzJywgZGVzdDogJ2Rpc3QvJyB9LFxuICAgICAgXSxcbiAgICAgIGhvb2s6ICd3cml0ZUJ1bmRsZScgLy8gRW5zdXJlIHRoZSBwbHVnaW4gcnVucyBhdCB0aGUgcmlnaHQgdGltZVxuICAgIH0pLFxuXG4gIF0sXG4gIHRlc3Q6IHtcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIHNldHVwRmlsZXM6ICcuL3Rlc3Qvc2V0dXAudHMnLFxuICB9LFxuICBjc3M6IHtcbiAgICBtb2R1bGVzOiB7XG4gICAgICBzY29wZUJlaGF2aW91cjogJ2xvY2FsJyxcbiAgICB9LFxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIHNjc3M6IHtcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWydyZWFjdCcsICdyZWFjdC9qc3gtcnVudGltZSddLFxuICAgICAgaW5wdXQ6IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgZ2xvYi5zeW5jKCdzcmMvbGliLyoqLyoue3RzLHRzeH0nLCB7XG4gICAgICAgICAgaWdub3JlOiBbXCJzcmMvbGliLyoqLyouZC50c1wiXSxcbiAgICAgICAgfSkubWFwKGZpbGUgPT4gW1xuICAgICAgICAgIHJlbGF0aXZlKFxuICAgICAgICAgICAgJ3NyYy9saWInLFxuICAgICAgICAgICAgZmlsZS5zbGljZSgwLCBmaWxlLmxlbmd0aCAtIGV4dG5hbWUoZmlsZSkubGVuZ3RoKVxuICAgICAgICAgICksXG4gICAgICAgICAgZmlsZVVSTFRvUGF0aChuZXcgVVJMKGZpbGUsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgICAgIF0pXG4gICAgICApLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGRpcjogJ2Rpc3QnLFxuICAgICAgICBmb3JtYXQ6ICdlcycsXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXVtleHRuYW1lXScsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnW25hbWVdLmpzJyxcbiAgICAgIH0sXG4gICAgICBwbHVnaW5zOiBbXG4gICAgICBdLFxuICAgIH0sXG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvbGliL2luZGV4LnRzJyksIC8vIEFkanVzdCB0aGlzIHBhdGggaWYgbmVlZGVkXG4gICAgICBmb3JtYXRzOiBbJ2VzJ10sXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5cblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLFNBQVM7QUFDaEIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxTQUFTLFVBQVUsZUFBZTtBQUMzQyxTQUFTLHFCQUFxQjtBQUM5QixTQUFTLFlBQVk7QUFDckIsT0FBTyxVQUFVO0FBUmpCLElBQU0sbUNBQW1DO0FBQXlJLElBQU0sMkNBQTJDO0FBV25PLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7QUFBQSxJQUM1QixhQUFhO0FBQUEsSUFDYixLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsUUFDUCxFQUFFLEtBQUssNkJBQTZCLE1BQU0sa0JBQWtCO0FBQUEsUUFDNUQsRUFBRSxLQUFLLHlCQUF5QixNQUFNLFFBQVE7QUFBQSxNQUNoRDtBQUFBLE1BQ0EsTUFBTTtBQUFBO0FBQUEsSUFDUixDQUFDO0FBQUEsRUFFSDtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osYUFBYTtBQUFBLElBQ2IsU0FBUztBQUFBLElBQ1QsWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLGdCQUFnQjtBQUFBLElBQ2xCO0FBQUEsSUFDQSxxQkFBcUI7QUFBQSxNQUNuQixNQUFNLENBQ047QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLFNBQVMsbUJBQW1CO0FBQUEsTUFDdkMsT0FBTyxPQUFPO0FBQUEsUUFDWixLQUFLLEtBQUsseUJBQXlCO0FBQUEsVUFDakMsUUFBUSxDQUFDLG1CQUFtQjtBQUFBLFFBQzlCLENBQUMsRUFBRSxJQUFJLFVBQVE7QUFBQSxVQUNiO0FBQUEsWUFDRTtBQUFBLFlBQ0EsS0FBSyxNQUFNLEdBQUcsS0FBSyxTQUFTLFFBQVEsSUFBSSxFQUFFLE1BQU07QUFBQSxVQUNsRDtBQUFBLFVBQ0EsY0FBYyxJQUFJLElBQUksTUFBTSx3Q0FBZSxDQUFDO0FBQUEsUUFDOUMsQ0FBQztBQUFBLE1BQ0g7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLEtBQUs7QUFBQSxRQUNMLFFBQVE7QUFBQSxRQUNSLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsTUFDQSxTQUFTLENBQ1Q7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsa0JBQWtCO0FBQUE7QUFBQSxNQUM1QyxTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2hCO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
