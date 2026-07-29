import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    // @ts-ignore - 'drop' is a valid esbuild option but might not be in the local Vite TS types
    drop: ['console', 'debugger'],
  },
})
