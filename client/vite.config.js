import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["nonprohibitory-katheryn-unbewitched.ngrok-free.dev"],
    fs: {
      strict: false,
    }
  },
});
// timestamp: 1737105658
