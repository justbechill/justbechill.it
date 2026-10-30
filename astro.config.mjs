import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://justbechill.it',
  output: 'static',
  publicDir: './site',
  outDir: './dist',
  build: { format: 'directory' },
});
