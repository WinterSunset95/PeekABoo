/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  root: './dist',
  test: {
    globals: true,
    environment: 'ts',
    setupFiles: './src/setupTests.ts',
  }
})
