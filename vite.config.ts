import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served at the domain root under the custom domain (amtmaputo.co.mz).
  base: '/',
  plugins: [react()],
})
