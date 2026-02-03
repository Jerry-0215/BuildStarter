import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// For GitHub Pages: site is at https://<user>.github.io/<repo-name>/ so set base to your repo name.
// Local dev and preview use base '/' when BASE_URL is not set.
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_URL || '/',
})
