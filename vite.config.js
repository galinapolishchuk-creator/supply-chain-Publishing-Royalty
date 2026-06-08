import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: '/' for local dev, Vercel, Netlify; on GitHub Pages the Actions
// workflow sets VITE_BASE to '/<repo-name>/' so asset paths resolve.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
  server: { port: 5173, open: true },
})
