// vite.config.js (موجود لكن يحتاج محتوى)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // أو 3001 للـ admin
    strictPort: true
  }
})