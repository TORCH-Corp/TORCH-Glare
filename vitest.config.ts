import { defineConfig as defineVitestConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineVitestConfig({
    plugins: [
        react(),
    ],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './test/setup.ts',
    }
}
);