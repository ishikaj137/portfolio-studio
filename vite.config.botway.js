import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://ibrwfdoilpdrqzogxdqc.supabase.co'
  const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicndmZG9pbHBkcnF6b2d4ZHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NzU3NjQsImV4cCI6MjEwMzE1MTc2NH0.nfUcBAcUAVKZRPAs1xYsyujWcbryQnBUTW8ZJFENi5s'
  const apiBase = env.VITE_API_BASE_URL || process.env.VITE_API_BASE_URL || 'https://botway-2.onrender.com'

  return {
    root: 'src1',
    envDir: __dirname,
    base: '/botway/',
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(supabaseKey),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBase),
    },
    build: {
      outDir: path.resolve(__dirname, 'dist/botway'),
      emptyOutDir: false,
    },
    server: {
      port: 5174,
    },
  }
})
