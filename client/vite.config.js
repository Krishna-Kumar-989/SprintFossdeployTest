import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BACKEND_URL = 'http://localhost:3000'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/login': BACKEND_URL,
      '/signup': BACKEND_URL,
      '/logout': BACKEND_URL,
      '/check': BACKEND_URL,
      '/items': BACKEND_URL,
      '/details': BACKEND_URL,
      '/registration': BACKEND_URL,
      '/markasresolved': BACKEND_URL,
      '/claim': BACKEND_URL,
      '/claims': BACKEND_URL,
      '/account_item_list': BACKEND_URL,
      '/profile': BACKEND_URL,
      '/users': BACKEND_URL,
      '/api': BACKEND_URL,
      '/admin': BACKEND_URL,
      '/uploads': BACKEND_URL,
    }
  }
})
