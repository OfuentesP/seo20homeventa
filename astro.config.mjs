import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://seo20.dev',
  output: 'server',
  trailingSlash: 'always',
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
  },
  adapter: node({
    mode: 'standalone'
  })
});