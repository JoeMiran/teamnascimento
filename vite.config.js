// Em: vite.config.js

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Team Nascimento BJJ',
        short_name: 'Nascimento BJJ',
        description: 'Plataforma de gerenciamento de alunos, pagamentos e biblioteca de técnicas de BJJ',
        theme_color: '#1a1a1a',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: 'screenshot1.png',
            sizes: '540x720',
            form_factor: 'narrow',
            type: 'image/png'
          },
          {
            src: 'screenshot2.png',
            sizes: '1280x720',
            form_factor: 'wide',
            type: 'image/png'
          }
        ],
        categories: ['education', 'lifestyle'],
        shortcuts: [
          {
            name: 'Alunos',
            short_name: 'Alunos',
            description: 'Gerenciar alunos',
            url: '/alunos',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }]
          },
          {
            name: 'Biblioteca',
            short_name: 'Biblioteca',
            description: 'Acessar biblioteca de técnicas',
            url: '/biblioteca',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }]
          },
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'Ver dashboard financeiro',
            url: '/dashboard',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2,ttf,eot}'],
        // Cache para assets estáticos por longo tempo
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 dias
              }
            }
          },
          // Cache para requisições à API com estratégia NetworkFirst
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutos
              }
            }
          },
          // Cache para vídeos da biblioteca (offline)
          {
            urlPattern: /^https?:\/\/.*\.(mp4|webm|ogg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'videos-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              }
            }
          }
        ]
      }
    })
  ],
  // ESTE BLOCO É A SOLUÇÃO:
  resolve: {
    alias: {
      // Diz ao Vite que '@' é um atalho para a pasta './src'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})