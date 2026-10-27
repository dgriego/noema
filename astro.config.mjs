// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Original Noema brand fonts (latin subset), self-hosted from the installed Fontsource packages.
// Astro's Fonts API preloads them and generates size-matched fallbacks so text doesn't shift.
const local = fontProviders.local();
/** @param {string} pkg @param {string} name @returns {string} */
const file = (pkg, name) => `./node_modules/${pkg}/files/${name}`;

export default defineConfig({
  site: 'https://noemainteriordesign.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
    // Page CSS is tiny; inlining it removes render-blocking requests.
    inlineStylesheets: 'always',
  },
  integrations: [sitemap({ filter: (page) => !page.includes('/thanks') })],
  fonts: [
    {
      provider: local,
      name: 'Archivo',
      cssVariable: '--font-archivo',
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
      options: {
        variants: [
          { src: [file('@fontsource-variable/archivo', 'archivo-latin-wght-normal.woff2')], weight: '100 900', style: 'normal' },
          { src: [file('@fontsource-variable/archivo', 'archivo-latin-wght-italic.woff2')], weight: '100 900', style: 'italic' },
        ],
      },
    },
    {
      provider: local,
      name: 'Archivo Black',
      cssVariable: '--font-archivo-black',
      fallbacks: ['Arial Black', 'sans-serif'],
      options: {
        variants: [{ src: [file('@fontsource/archivo-black', 'archivo-black-latin-400-normal.woff2')], weight: 400, style: 'normal' }],
      },
    },
    {
      provider: local,
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
      options: {
        variants: [{ src: [file('@fontsource-variable/space-grotesk', 'space-grotesk-latin-wght-normal.woff2')], weight: '300 700', style: 'normal' }],
      },
    },
  ],
});
