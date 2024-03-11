import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// <reference types="vite/client" />

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false, //temporary
      },
    },
  },
  plugins: [react()],
});
