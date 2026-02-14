import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true,
    port: 8080,
  },
  preview: {
    host: true, // Needed for Cloud Run
    port: 8080, // Enforce port 8080
    allowedHosts: true, // Allow all hosts
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Clean dist folder before build
    sourcemap: false,
  },
  define: {
    // Polyfill process.env for the client-side code
    'process.env': process.env
  }
});