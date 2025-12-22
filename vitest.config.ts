import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/testing/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'playwright.config.ts',
        'api/**',
        'e2e/**',
        'dist/**',
        'eslint.config.js',
        '**/vite.config.*',
        '**/vitest.config.*',
        '**/jest.config.*',
        '**/test-results/**',
        '**/coverage/**',
        '**/node_modules/**',
      ],
    },
    typecheck: {
      enabled: false,
    },
    maxConcurrency: 4,
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});