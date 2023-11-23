import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.VITE_PORT ?? 3000

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ]
  },
  server: {
    port: +PORT
  }
})
