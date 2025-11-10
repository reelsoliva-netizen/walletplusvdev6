// Usage: npm run generate:store
// Requires: npm i --save-dev sharp
// Generates Play Store-ready assets from root store_icon.png

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const sourceIcon = path.join(root, 'store_icon.png');
const outDir = path.join(root, 'store_assets');
const playDir = path.join(outDir, 'play_store');
const iconsDir = path.join(playDir, 'icons');
const graphicsDir = path.join(playDir, 'graphics');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

async function main() {
  if (!fs.existsSync(sourceIcon)) {
    console.error(`Missing source icon at ${sourceIcon}. Place a high-res PNG here.`);
    process.exit(1);
  }

  ensureDir(iconsDir);
  ensureDir(graphicsDir);

  // Primary Play Store icon (512x512)
  await sharp(sourceIcon).resize(512, 512).png({ quality: 92 }).toFile(path.join(iconsDir, 'playstore-icon-512.png'));

  // Adaptive icon layers (foreground + background)
  await sharp(sourceIcon).resize(432, 432).png({ quality: 92 }).toFile(path.join(iconsDir, 'adaptive-foreground-432.png'));
  // Solid background (maskable)
  const bg = Buffer.from(
    '<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0F0F0F"/></svg>'
  );
  await sharp(bg).png().toFile(path.join(iconsDir, 'adaptive-background-1080.png'));

  // Feature graphic 1024 x 500 - center resized icon (max 420x420)
  const resizedIcon = await sharp(sourceIcon).resize(420, 420, { fit: 'inside' }).png().toBuffer();
  await sharp({ create: { width: 1024, height: 500, channels: 4, background: '#0F0F0F' } })
    .composite([{ input: resizedIcon, gravity: 'center' }])
    .png({ quality: 92 })
    .toFile(path.join(graphicsDir, 'feature-graphic-1024x500.png'));

  console.log('Store assets generated under store_assets/play_store');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
