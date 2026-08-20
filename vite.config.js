import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative assets work on both a custom domain and GitHub project pages.
  base: './',
  plugins: [react()],
});
