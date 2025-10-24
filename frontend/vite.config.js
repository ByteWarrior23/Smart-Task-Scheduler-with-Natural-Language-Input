import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // Align with backend PORT expected by user (.env example shows 3001)
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  build: { sourcemap: true }
});
