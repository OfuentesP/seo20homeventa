import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://seo20.dev',
  trailingSlash: 'always',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    tailwind(),
    vue()
  ],
  build: {
    format: 'directory'
  },
  vite: {
    optimizeDeps: {
      exclude: ['@astrojs/tailwind']
    },
    css: {
      devSourcemap: true
    }
  }
});