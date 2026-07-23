import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

const gasBuild = process.env.GAS_BUILD === '1';

export default defineConfig({
  plugins: [react(), ...(gasBuild ? [viteSingleFile()] : [])],
  base: process.env.ADMIN_BASE || '/admin/',
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
      '/assets': 'http://localhost:3000'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
