import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // TEMPORARY: reverted to the GitHub Pages project-page path while DNS for
  // the custom domain (amtmaputo.co.mz) is not yet propagated. Switch back
  // to base: '/' + restore public/CNAME once the domain resolves.
  base: '/amt-portal-transportes/',
  plugins: [react()],
})
