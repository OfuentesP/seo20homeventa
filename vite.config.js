import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { createHtmlPlugin } from 'vite-plugin-html'
// import critical from 'rollup-plugin-critical'

export default defineConfig({
  base: '/', // Asegura rutas absolutas para producción
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
      minify: true
      // 👇 Eliminamos la inyección manual de /src/main.js para dejar que Vite maneje los scripts optimizados
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
      // Puedes volver a activar el plugin de critical CSS más adelante si lo necesitas
    },
  },
  server: {
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
})