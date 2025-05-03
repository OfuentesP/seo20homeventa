import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/', // ⚠️ Esto asegura que las rutas JS/CSS sean absolutas y no se rompan
  plugins: [vue()]
})