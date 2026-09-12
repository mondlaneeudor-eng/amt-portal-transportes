import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served at the domain root on Vercel (required to host the Sala de
  // Controlo's /api serverless functions — GitHub Pages is static-only and
  // cannot run them).
  base: '/',
  plugins: [react()],
})
