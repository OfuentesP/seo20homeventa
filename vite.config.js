import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { createHtmlPlugin } from 'vite-plugin-html'
// import critical from 'rollup-plugin-critical'

export default defineConfig({
  base: '/', // ⚠️ Esto asegura que las rutas JS/CSS sean absolutas y no se rompan
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot}']
      },
      manifest: {
        name: 'SEO20.dev',
        short_name: 'SEO20',
        description: 'Informe SEO Técnico de tu Home por $10 USD',
        theme_color: '#10b981',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        tags: [
          {
            injectTo: 'head',
            tag: 'script',
            attrs: {
              type: 'module',
              src: '/src/main.js'
            }
          }
        ]
      },
      // Automatiza el truco media="print" para el CSS generado por Vite
      entry: '/src/main.js',
      // Puedes agregar más opciones si lo necesitas
    })
  ],
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          'vue-use': ['@vueuse/core', '@vueuse/head']
        },
      },
      // plugins: [
      //   critical({
      //     criticalUrl: 'http://localhost:4173/',
      //     criticalBase: './dist/criticalcss/',
      //     criticalPages: [
      //       { uri: '', template: 'index' }
      //     ],
      //     criticalConfig: {
      //       penthouse: {
      //         timeout: 120000,
      //         renderWaitTime: 1500,
      //         // chromePath: '/Applications/Chromium.app/Contents/MacOS/Chromium'
      //       }
      //     }
      //   })
      // ]
    },
  },
  server: {
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
})