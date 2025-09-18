import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        'content-script': resolve(__dirname, 'public/content-script.js'),
        'gmail-content': resolve(__dirname, 'public/gmail-content.js'),
        'background': resolve(__dirname, 'public/background.js'),
        'popup': resolve(__dirname, 'public/popup.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: false, // We'll copy files manually
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
