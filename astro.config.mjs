// @ts-check
import { defineConfig } from 'astro/config';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const photoSource = fileURLToPath(new URL('./public/photo.jpg', import.meta.url));
const photoVariants = [
  { name: 'photo-430.avif', width: 430, format: 'avif', options: { quality: 55 } },
  { name: 'photo-860.avif', width: 860, format: 'avif', options: { quality: 55 } },
  { name: 'photo-430.webp', width: 430, format: 'webp', options: { quality: 82 } },
  { name: 'photo-860.webp', width: 860, format: 'webp', options: { quality: 80 } },
  { name: 'photo-860.jpg', width: 860, format: 'jpeg', options: { quality: 80, progressive: true } },
];

async function generatePhotoVariants() {
  for (const variant of photoVariants) {
    const target = fileURLToPath(new URL(`./public/${variant.name}`, import.meta.url));
    if (existsSync(target)) continue;
    await sharp(photoSource)
      .resize({ width: variant.width, height: Math.round((variant.width * 5) / 4), fit: 'cover' })
      .toFormat(variant.format, variant.options)
      .toFile(target);
  }
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    {
      name: 'photo-variants',
      hooks: {
        'astro:config:setup': generatePhotoVariants,
      },
    },
  ],
});
