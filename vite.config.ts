import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { extname, relative, resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src/lib'] }),
    libInjectCss(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // Additional SCSS options if needed
      },
    },
  },
  build: {
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      input: Object.fromEntries(
        glob.sync('src/lib/**/*.{ts,tsx}', {
          ignore: ["src/lib/**/*.d.ts"],
        }).map(file => [
          // The name of the entry point
          relative(
            'src/lib',
            file.slice(0, file.length - extname(file).length)
          ),
          // The absolute path to the entry file
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      output: {
        dir: 'dist',
        format: 'es',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      }
    },
    lib: {
      entry: resolve(__dirname, 'src/lib/main.ts'),
      formats: ['es']
    },
  },
});
