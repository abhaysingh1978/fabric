import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const alias = {
  '@components': resolve(__dirname, 'src/components'),
  '@data': resolve(__dirname, 'src/data'),
  '@lib': resolve(__dirname, 'src/lib'),
  '@hooks': resolve(__dirname, 'src/hooks'),
  '@types': resolve(__dirname, 'src/types'),
  '@panels': resolve(__dirname, 'src/panels'),
}

export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  envPrefix: 'VITE_',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    alias,
  },
})
