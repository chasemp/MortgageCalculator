# PWA Lessons Learned

This document captures key learnings and procedures for PWA development, particularly around icon generation and asset management.

## Icon & Favicon Generation

### Overview
PWA icons need to be provided in multiple sizes for different platforms and contexts. This guide shows how to generate all required icons from a single source logo.

### Source Assets
- **Location**: `public/assets/`
- **Files**:
  - `morty_white_bg.png` (1024×1024) - Primary logo with white background
  - `morty_transparent_bg.png` (1024×1024) - Logo with transparent background

### Required Icon Sizes

| Platform | Size | Filename | Purpose |
|----------|------|----------|---------|
| Android | 192×192 | `icon-192.png` | Home screen icon |
| Android/PWA | 512×512 | `icon-512.png` | Splash screen, app icon |
| iOS | 180×180 | `apple-touch-icon.png` | Home screen icon |
| Browser | 32×32 | `favicon.ico` | Browser tab icon |

### Icon Generation Methods

#### Method 1: macOS `sips` (Built-in)

macOS includes `sips` (Scriptable Image Processing System) for image manipulation:

```bash
# Create icons directory
mkdir -p public/icons

# Generate Android icons
sips -z 192 192 public/assets/morty_white_bg.png --out public/icons/icon-192.png
sips -z 512 512 public/assets/morty_white_bg.png --out public/icons/icon-512.png

# Generate iOS icon
sips -z 180 180 public/assets/morty_white_bg.png --out public/icons/apple-touch-icon.png

# Generate favicon (note: sips outputs PNG, rename later if needed)
sips -z 32 32 public/assets/morty_white_bg.png --out public/favicon.ico
```

**Pros**: 
- Built into macOS, no installation needed
- Fast and reliable
- Command-line scriptable

**Cons**: 
- macOS only
- `.ico` files are actually PNGs (browsers handle this fine)

#### Method 2: ImageMagick (Cross-platform)

If you have ImageMagick installed:

```bash
# Install ImageMagick (if needed)
brew install imagemagick

# Generate icons
convert public/assets/morty_white_bg.png -resize 192x192 public/icons/icon-192.png
convert public/assets/morty_white_bg.png -resize 512x512 public/icons/icon-512.png
convert public/assets/morty_white_bg.png -resize 180x180 public/icons/apple-touch-icon.png

# Generate proper ICO with multiple sizes
convert public/assets/morty_white_bg.png -define icon:auto-resize=32,16 public/favicon.ico
```

#### Method 3: Online Tools

**Recommended**: [RealFaviconGenerator](https://realfavicongenerator.net/)

1. Upload source logo (1024×1024 recommended)
2. Configure settings for each platform
3. Download generated icon pack
4. Copy files to `public/icons/`

**Pros**:
- Comprehensive - generates all formats
- Platform-specific optimizations
- Generates manifest snippets

**Cons**:
- Requires internet connection
- Manual download/copy process

#### Method 4: Sharp (Node.js)

For automated builds, use the Sharp library:

```bash
npm install --save-dev sharp
```

Create `scripts/generate-icons.js`:

```javascript
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';

const SOURCE = 'public/assets/morty_white_bg.png';
const OUTPUT_DIR = 'public/icons';

// Ensure output directory exists
mkdirSync(OUTPUT_DIR, { recursive: true });

const sizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: '../favicon.ico' }
];

async function generateIcons() {
  for (const { size, name } of sizes) {
    await sharp(SOURCE)
      .resize(size, size)
      .toFile(`${OUTPUT_DIR}/${name}`);
    console.log(`✓ Generated ${name} (${size}×${size})`);
  }
}

generateIcons().catch(console.error);
```

Run with: `node scripts/generate-icons.js`

### Updating Manifest & HTML

#### 1. Update `public/manifest.json`

```json
{
  "name": "Mortgage Calculator PWA",
  "short_name": "MortgageCalc",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ]
}
```

**Key Points**:
- Use `"purpose": "any"` for regular icons
- Use `"purpose": "maskable"` for Android adaptive icons (512×512)
- Include both purposes for the 512×512 icon

#### 2. Update `index.html`

Add favicon and Apple touch icon links in `<head>`:

```html
<head>
  <meta charset="UTF-8" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.ico" />
  
  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
  
  <!-- Theme color for mobile browsers -->
  <meta name="theme-color" content="#3B82F6" />
  
  <!-- Other meta tags... -->
</head>
```

### Build Process Integration

With Vite, the `public/` directory is automatically copied to the build output:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    outDir: 'docs'
  },
  publicDir: 'public'
})
```

When you run `npm run build`:
1. Vite copies all `public/` contents to `docs/`
2. Icons are available at `/icons/icon-192.png`, etc.
3. Favicon is available at `/favicon.ico`
4. Assets are available at `/assets/morty_white_bg.png`, etc.

### Verification Checklist

After generating icons:

- [ ] All icon files exist in `public/icons/`
- [ ] Favicon exists at `public/favicon.ico`
- [ ] `manifest.json` references correct icon paths
- [ ] `index.html` has favicon and apple-touch-icon links
- [ ] Run `npm run build` to copy to `docs/`
- [ ] Check `docs/icons/` contains all icons
- [ ] Check `docs/favicon.ico` exists
- [ ] Test in browser (check browser tab for favicon)
- [ ] Test on mobile (add to home screen)
- [ ] Validate manifest with Lighthouse or PWA tools

### Common Issues & Solutions

#### Issue: Icons not showing after build
**Solution**: Clear browser cache and service worker:
```javascript
// In browser console
navigator.serviceWorker.getRegistrations()
  .then(registrations => registrations.forEach(r => r.unregister()));
```

#### Issue: iOS icon not displaying
**Solution**: Ensure apple-touch-icon is exactly 180×180 and linked in HTML

#### Issue: Android adaptive icon has white background
**Solution**: Use transparent PNG as source for maskable icon, or create separate maskable version

#### Issue: Favicon blurry
**Solution**: Design favicon specifically for 32×32 or 16×16, don't just scale down large logo

### Best Practices

1. **Source Image**: Start with 1024×1024 PNG for best quality scaling
2. **Transparency**: Use transparent background for maskable icons
3. **Simplicity**: Favicons should be simple - complex designs don't scale well
4. **Testing**: Test on actual devices, not just browser dev tools
5. **Caching**: Update icon filenames or use cache busting after changes
6. **Documentation**: Keep this file updated with your specific workflow

### Using the Logo in Components

To display the logo in your React app:

```tsx
// src/components/Header.tsx
<img 
  src="/assets/morty_white_bg.png" 
  alt="Morty Logo" 
  className="h-10 w-10 rounded-md shadow-sm"
/>
```

**Notes**:
- Use absolute path starting with `/`
- Vite resolves this from `public/` directory
- No import needed for public assets
- Available at same path in production build

### File Structure

```
project/
├── public/                    # Source assets (committed to git)
│   ├── assets/
│   │   ├── morty_white_bg.png (1024×1024 source)
│   │   └── morty_transparent_bg.png
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── apple-touch-icon.png
│   ├── favicon.ico
│   ├── manifest.json
│   └── CNAME
├── docs/                      # Build output (committed for GitHub Pages)
│   ├── assets/               # App logos (copied from public/assets)
│   │   ├── morty_white_bg.png
│   │   └── morty_transparent_bg.png
│   ├── icons/                # PWA icons (copied from public/icons)
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── apple-touch-icon.png
│   ├── favicon.ico
│   ├── manifest.json
│   └── index.html
└── scripts/
    └── generate-icons-from-logo.js
```

### Quick Reference Commands

```bash
# Regenerate all icons from source
cd /path/to/project

# macOS (using sips)
sips -z 192 192 public/assets/morty_white_bg.png --out public/icons/icon-192.png
sips -z 512 512 public/assets/morty_white_bg.png --out public/icons/icon-512.png
sips -z 180 180 public/assets/morty_white_bg.png --out public/icons/apple-touch-icon.png
sips -z 32 32 public/assets/morty_white_bg.png --out public/favicon.ico

# Rebuild and commit
npm run build
git add public/icons docs/
git commit -m "chore: Regenerate PWA icons"
```

### Resources

- [Web.dev PWA Icons Guide](https://web.dev/add-manifest/#icons)
- [Apple Touch Icon Documentation](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [MDN: Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Builder](https://www.pwabuilder.com/)

---

**Last Updated**: October 13, 2025  
**Project**: Mortgage Calculator PWA  
**Domain**: morty.523.life

