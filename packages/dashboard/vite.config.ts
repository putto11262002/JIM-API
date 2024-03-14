import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assetss": path.resolve(__dirname, "./src/assets"),
      ".prisma/client/index-browser": "../../node_modules/.prisma/client/index-browser.js"
    
    }
  },
})
