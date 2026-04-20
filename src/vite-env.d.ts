/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANTHROPIC_API_KEY: string
  readonly VITE_GOOGLE_API_KEY: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_OLLAMA_BASE_URL: string
  readonly VITE_ALPHA_VANTAGE_API_KEY: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
