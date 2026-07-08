# Prashant Shah Portfolio

Single-page Astro site for prashantshah.com.

## Commands

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Structure

- `src/pages/index.astro` contains the shipped page.
- `public/` contains static assets served from the site root.
- `public/photo-*` image variants are generated from `public/photo.jpg` at dev/build startup (see `astro.config.mjs`) and stay untracked.
