import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React en chunk séparé
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          // Supabase inline dans le bundle principal (évite le chunk vide)
          if (id.includes('@supabase')) {
            return 'supabase'
          }
          // Lucide icons
          if (id.includes('lucide-react')) {
            return 'icons'
          }
          // Zustand
          if (id.includes('zustand')) {
            return 'zustand'
          }
          // xlsx séparé (gros)
          if (id.includes('xlsx')) {
            return 'xlsx'
          }
        }
      }
    }
  }
})
