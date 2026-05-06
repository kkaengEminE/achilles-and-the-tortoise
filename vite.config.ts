/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const REPO_NAME = 'achilles-and-the-tortoise';

// Use the repo subpath only when building for production (GitHub Pages serves
// the site at /<repo>/). The dev server stays at / for clean local URLs.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? `/${REPO_NAME}/` : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
}));
