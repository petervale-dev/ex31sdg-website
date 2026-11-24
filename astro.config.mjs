import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://petervale-dev.github.io',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});
