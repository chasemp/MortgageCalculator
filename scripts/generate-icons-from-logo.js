#!/usr/bin/env node

/**
 * Generate PWA icons and favicons from the Morty logo
 * Uses sharp for image processing
 * 
 * Run: node scripts/generate-icons-from-logo.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📦 Installing sharp if needed...');
console.log('Run: npm install --save-dev sharp');
console.log('Then run this script again.');

// This script needs sharp to be installed
// For now, we'll provide instructions for manual icon generation

console.log(`
🎨 Icon Generation Instructions

Source Logo: public/assets/morty_white_bg.png (1024x1024)

Option 1: Use Online Tools
--------------------------
1. Visit: https://realfavicongenerator.net/
2. Upload: public/assets/morty_white_bg.png
3. Configure settings:
   - iOS: Use white background logo
   - Android: Use white background logo
   - Windows: Use white background logo
   - macOS Safari: Use white background logo
4. Download generated icon pack
5. Copy files to public/icons/

Option 2: Use ImageMagick (if installed)
-----------------------------------------
For favicon.ico:
  convert public/assets/morty_white_bg.png -resize 32x32 public/favicon.ico

For various sizes:
  convert public/assets/morty_white_bg.png -resize 192x192 public/icons/icon-192.png
  convert public/assets/morty_white_bg.png -resize 512x512 public/icons/icon-512.png
  convert public/assets/morty_white_bg.png -resize 180x180 public/icons/apple-touch-icon.png

Option 3: Manual with Preview/GIMP
----------------------------------
Open public/assets/morty_white_bg.png
Export at these sizes:
  - 16x16   → public/favicon-16x16.png
  - 32x32   → public/favicon-32x32.png  
  - 192x192 → public/icons/icon-192.png
  - 512x512 → public/icons/icon-512.png
  - 180x180 → public/icons/apple-touch-icon.png

Required icon sizes:
- favicon.ico (16x16, 32x32)
- icon-192.png (192x192) - Android
- icon-512.png (512x512) - Android
- apple-touch-icon.png (180x180) - iOS

After generating icons, update:
- public/manifest.json with new icon paths
- index.html with favicon links
`);

process.exit(0);


