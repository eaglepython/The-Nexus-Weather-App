import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configure base for GitHub Pages deployment
export default defineConfig({
  base: '/The-Nexus-Weather-App/',
  plugins: [react()],
})
