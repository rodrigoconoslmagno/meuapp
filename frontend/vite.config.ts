import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist', // saída do build
    assetsDir: 'assets',
    emptyOutDir: true, // limpa a pasta dist antes de buildar
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',     // 🔹 sem hash
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  base: './', // caminho relativo (Tomcat serve a partir da raiz)
  server: {
    port: 5173, // apenas para dev
    proxy: {
      // Redireciona chamadas à API no dev para o Spring Boot
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
