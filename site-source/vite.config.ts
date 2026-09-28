import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {'import.meta.env.VITE_BUILD_SHA':JSON.stringify(process.env.VITE_BUILD_SHA || process.env.GITHUB_SHA || 'development')},
  server: {
    host: '0.0.0.0',
    allowedHosts: ['localhost', '127.0.0.1', '.cursorvm.com'],
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['localhost', '127.0.0.1', '.cursorvm.com'],
  },
})
