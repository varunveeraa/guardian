import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration for building the React website (for Netlify deployment)
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
