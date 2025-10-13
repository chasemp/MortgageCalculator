# PWA Splash Screen Configuration

This document explains how splash screens are configured for the Mortgage Calculator PWA.

## Overview

Splash screens provide a branded loading experience when users launch the PWA, especially on iOS devices. While Android typically generates splash screens automatically from the icon and background color, iOS requires explicit splash screen images for different device sizes.

## Source Image

**Location**: `public/assets/morty_splash.png`  
**Original Size**: 1024×1536 (portrait orientation)  
**Format**: PNG with RGB color

## Generated Splash Screens

Splash screens are generated for various iOS device sizes using macOS `sips`:

| Device | Size (width×height) | Filename | Device Examples |
|--------|---------------------|----------|-----------------|
| iPad Pro 12.9" | 2048×2732 | `apple-splash-2048-2732.png` | iPad Pro 12.9" (3rd gen+) |
| iPad Pro 11" | 1668×2388 | `apple-splash-1668-2388.png` | iPad Pro 11", iPad Air 10.9" |
| iPad Pro 10.5" | 1536×2048 | `apple-splash-1536-2048.png` | iPad Pro 10.5", iPad Air 9.7" |
| iPhone 14 Pro Max | 1242×2688 | `apple-splash-1242-2688.png` | iPhone 14 Pro Max, 13 Pro Max, 12 Pro Max, 11 Pro Max, XS Max |
| iPhone 14 Pro | 1125×2436 | `apple-splash-1125-2436.png` | iPhone 14 Pro, 14, 13, 13 Pro, 12, 12 Pro, 11 Pro, X, XS |
| iPhone 14 Plus | 828×1792 | `apple-splash-828-1792.png` | iPhone 14 Plus, 13, 12, 11, XR |
| iPhone 8 Plus | 750×1334 | `apple-splash-750-1334.png` | iPhone 8, 7, 6s, 6 (Plus models) |
| iPhone SE | 640×1136 | `apple-splash-640-1136.png` | iPhone SE (1st gen), 5s |

## Generation Commands

To regenerate splash screens from the source image:

```bash
cd /Users/cpettet/git/chasemp/MortgageCalculator

# Create splash directory
mkdir -p public/splash

# Generate all sizes using sips (macOS)
sips -z 2048 2732 public/assets/morty_splash.png --out public/splash/apple-splash-2048-2732.png
sips -z 1668 2388 public/assets/morty_splash.png --out public/splash/apple-splash-1668-2388.png
sips -z 1536 2048 public/assets/morty_splash.png --out public/splash/apple-splash-1536-2048.png
sips -z 1242 2688 public/assets/morty_splash.png --out public/splash/apple-splash-1242-2688.png
sips -z 1125 2436 public/assets/morty_splash.png --out public/splash/apple-splash-1125-2436.png
sips -z 828 1792 public/assets/morty_splash.png --out public/splash/apple-splash-828-1792.png
sips -z 750 1334 public/assets/morty_splash.png --out public/splash/apple-splash-750-1334.png
sips -z 640 1136 public/assets/morty_splash.png --out public/splash/apple-splash-640-1136.png
```

## HTML Configuration

Splash screens are linked in `index.html` using `<link rel="apple-touch-startup-image">` tags with media queries to match specific device dimensions:

```html
<!-- iOS Splash Screens -->
<link rel="apple-touch-startup-image" 
      href="/splash/apple-splash-2048-2732.png" 
      media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
<!-- ... additional splash screens for other devices ... -->
```

### Media Query Explanation

- **device-width/height**: Physical device dimensions in CSS pixels
- **-webkit-device-pixel-ratio**: Pixel density (1 = standard, 2 = Retina, 3 = Super Retina)
- **orientation**: `portrait` or `landscape`

iOS uses these media queries to select the appropriate splash screen for the current device.

## Vite Configuration

The `vite.config.ts` includes splash screens in the build:

```typescript
VitePWA({
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'splash/*.png'],
  manifest: {
    theme_color: '#3B82F6',
    background_color: '#ffffff',
    // ...
  }
})
```

### Important Notes

1. **File Size Warnings**: Splash screen images are large (2-5 MB) and won't be precached by the service worker. This is **expected and fine** - splash screens load on initial launch before the service worker is active.

2. **Build Output**: Splash screens are copied from `public/splash/` to `docs/splash/` during build.

3. **Caching**: Splash screens don't need to be in the service worker cache because they're only used during the initial app load from the web.

## Android Splash Screens

Android automatically generates splash screens from:
- **Icon**: Uses the app icon (192×192 or 512×512)
- **Background Color**: Uses `background_color` from manifest (`#ffffff`)
- **Theme Color**: Uses `theme_color` from manifest (`#3B82F6`)

No additional configuration needed for Android!

## Testing Splash Screens

### iOS Testing
1. Open Safari on an iOS device
2. Navigate to `https://morty.523.life`
3. Tap the Share button → "Add to Home Screen"
4. Tap the installed app icon
5. You should see the Morty splash screen while the app loads

### iOS Simulator Testing
```bash
# Open in iOS Simulator
open -a Simulator
# Navigate to morty.523.life in Safari
# Add to Home Screen and launch
```

### Desktop PWA Testing
Desktop browsers (Chrome, Edge) show a simple splash with the icon and colors from the manifest, not the custom iOS splash screens.

## File Structure

```
project/
├── public/
│   ├── assets/
│   │   └── morty_splash.png       # Source (1024×1536)
│   └── splash/                     # Generated iOS splash screens
│       ├── apple-splash-2048-2732.png
│       ├── apple-splash-1668-2388.png
│       ├── apple-splash-1536-2048.png
│       ├── apple-splash-1242-2688.png
│       ├── apple-splash-1125-2436.png
│       ├── apple-splash-828-1792.png
│       ├── apple-splash-750-1334.png
│       └── apple-splash-640-1136.png
├── docs/                           # Build output
│   └── splash/                     # Copied from public/splash
│       └── (same files)
└── index.html                      # Contains splash screen links
```

## Troubleshooting

### Splash Screen Not Showing on iOS

1. **Clear Home Screen**: Delete the app from home screen and re-add
2. **Clear Cache**: Settings → Safari → Clear History and Website Data
3. **Check Media Query**: Ensure the media query matches your device
4. **Verify File Path**: Check that splash screens exist in `docs/splash/`

### Wrong Splash Screen Displayed

- iOS selects based on exact device dimensions
- If multiple media queries match, the **last one** in HTML wins
- Order splash screens from largest to smallest in HTML

### Splash Screen Looks Distorted

- Check aspect ratio of source image (should be portrait ~2:3)
- Regenerate with correct dimensions
- Consider designing separate splash screens for landscape if needed

## Best Practices

1. **Design Considerations**
   - Keep branding centered
   - Avoid text near edges (safe area insets)
   - Use simple, recognizable imagery
   - Match app's theme colors

2. **File Size**
   - Optimize PNG files (use tools like ImageOptim, TinyPNG)
   - Balance quality vs. file size
   - Splash screens load before caching, so smaller is better

3. **Maintenance**
   - Update splash screens when branding changes
   - Test on actual devices when possible
   - Keep source file (morty_splash.png) in version control

4. **Future Devices**
   - New iOS devices may need new splash screen sizes
   - Monitor Apple's device releases
   - Generate new sizes as needed

## Resources

- [Apple: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [iOS Device Sizes Reference](https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions)
- [PWA Splash Screen Generator](https://progressier.com/pwa-splash-screen-generator)
- [MDN: Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## Quick Reference: Common iOS Device Sizes

| Device | Logical Size | Pixel Ratio | Physical Size |
|--------|--------------|-------------|---------------|
| iPhone 14 Pro Max | 430×932 | 3x | 1290×2796 |
| iPhone 14 Pro | 393×852 | 3x | 1179×2556 |
| iPhone 14/13/12 Pro | 390×844 | 3x | 1170×2532 |
| iPhone SE (3rd) | 375×667 | 2x | 750×1334 |
| iPad Pro 12.9" | 1024×1366 | 2x | 2048×2732 |
| iPad Pro 11" | 834×1194 | 2x | 1668×2388 |

---

**Last Updated**: October 13, 2025  
**Project**: Mortgage Calculator PWA  
**Domain**: morty.523.life

