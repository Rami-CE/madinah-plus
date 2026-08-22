import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const behindTunnel = env.VITE_TUNNEL === '1'

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      allowedHosts: true,
      hmr: behindTunnel
        ? { clientPort: 443, protocol: 'wss' }
        : undefined,
      proxy: {
        '/api': 'http://localhost:5088',
        '/health': 'http://localhost:5088',
        '/swagger': 'http://localhost:5088',
      },
    },
  }
})
