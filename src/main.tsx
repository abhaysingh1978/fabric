import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

window.onerror = (message, source, lineno, colno, error) => {
  console.error('[Aethon]', { app: 'aethon', version: import.meta.env.VITE_APP_VERSION ?? '0.1.0', message, source, lineno, colno, error })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
