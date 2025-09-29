const fs = require('fs');
const path = require('path');

// Simple SVG icon generator for PWA
function generateIcon(size, filename) {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">$</text>
</svg>`;

  const publicDir = path.join(__dirname, '..', 'public');
  const iconPath = path.join(publicDir, filename);
  
  fs.writeFileSync(iconPath, svg);
  console.log(`Generated ${filename} (${size}x${size})`);
}

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons
generateIcon(192, 'icon-192.png');
generateIcon(512, 'icon-512.png');
generateIcon(180, 'apple-touch-icon.png');

console.log('Icons generated successfully!');