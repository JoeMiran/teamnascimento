// Em: vite.config.js

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  // ESTE BLOCO É A SOLUÇÃO:
  resolve: {
    alias: {
      // Diz ao Vite que '@' é um atalho para a pasta './src'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})