import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const codespaceName = process.env.CODESPACE_NAME
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl),
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
})
