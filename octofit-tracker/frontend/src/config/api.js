const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8000'
