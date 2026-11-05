import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * base — reason:
 *   GitHub Pages serves this repo under /react-template/, not at the domain root.
 *   The Pages workflow builds with BASE_PATH=/react-template/; local dev and preview
 *   leave it unset and stay at `/`. Code that builds URLs reads import.meta.env.BASE_URL
 *   (BrowserRouter basename, the KTX2 transcoder path, the Ex5 sleeve files).
 */
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
});
