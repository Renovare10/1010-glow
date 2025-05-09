// vite.config.ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  base: '/1010-glow', // Add this to align with svelte.config.js
});