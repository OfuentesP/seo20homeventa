import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://seo20.dev',
  trailingSlash: 'always',
  output: 'server',
  build: {
    format: 'directory'
  },
  integrations: [
    tailwind(),
    vue()
  ],
  adapter: node({ mode: 'standalone' }),
  vite: {
    optimizeDeps: {
      exclude: ['@astrojs/tailwind']
    },
    css: {
      devSourcemap: true
    }
  }
}); 