// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url' // 'node:url' recommandé

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://192.168.1.35:8080',
        changeOrigin: true,
        secure: false,
        // rewrite: path => path.replace(/^\/api/, '') // si besoin
      },
    },
  },
})
