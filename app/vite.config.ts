import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  build: {
    rolldownOptions: {
      output: {
        // Charting is by far the heaviest dependency; keeping it in its own chunk
        // lets it be cached independently of application code.
        advancedChunks: {
          groups: [
            { name: 'charts', test: /node_modules\/(recharts|d3-|victory|internmate)/ },
            { name: 'react', test: /node_modules\/(react|react-dom|scheduler)\// },
          ],
        },
      },
    },
  },
})
