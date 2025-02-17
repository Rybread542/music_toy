import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

    // uncomment following for test build on local server
  server: {
    // Tweak this to match your Express port, e.g., 5000 or 8080
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      },
    }

}})
