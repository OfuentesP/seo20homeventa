import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';

export default defineConfig({
  site: 'https://seo20.dev',
  trailingSlash: 'always',
  output: 'static', // 👈 modo estático real
  build: {
    format: 'directory'
  },
  integrations: [
    tailwind(),
    vue()
  ],
  vite: {
    optimizeDeps: {
      exclude: ['@astrojs/tailwind']
    },
    css: {
      devSourcemap: true
    }
  }
});