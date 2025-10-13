# PWA Development Workflow

## Daily Development

### 1. Start Development Server
```bash
npm run dev
```
- Opens at `http://localhost:5173`
- Hot reload enabled
- Edit files in `/src` and `/public`

### 2. Make Changes
- **Components**: `/src/components/`
- **Hooks**: `/src/hooks/`
- **Utils**: `/src/utils/`
- **Styles**: `/src/index.css`
- **Types**: `/src/types/`

### 3. Test Locally
```bash
npm run build
npm run preview
```
- Builds production version to `/docs`
- Serves at `http://localhost:4173`
- Test PWA features (offline, install)

## Testing PWA Features

### Service Worker
1. Open DevTools → Application → Service Workers
2. Check "Update on reload"
3. Verify registration status
4. Test offline mode (Network → Offline)

### Manifest
1. DevTools → Application → Manifest
2. Verify name, icons, theme color
3. Test "Install" prompt

### Offline Functionality
1. Build and preview production version
2. Load the app
3. DevTools → Network → Offline
4. Reload page - should work offline
5. Check cached resources in Application → Cache Storage

## Build Process

### Development Build
```bash
npm run dev
```
- Fast refresh
- Source maps
- No optimization

### Production Build
```bash
npm run build
```
- Minification
- Tree shaking
- Code splitting
- Service worker generation
- Outputs to `/docs`

### Build Verification
```bash
npm run preview
```
- Serves production build locally
- Test before deploying

## Deployment

### Automatic (Recommended)
```bash
git add .
git commit -m "feat: Add new feature"
git push origin main
```
- GitHub Actions runs automatically
- Builds and deploys to morty.523.life
- Takes 1-2 minutes

### Manual Build
```bash
npm run build
git add docs/
git commit -m "build: Update production build"
git push origin main
```

## Code Quality

### Linting
```bash
npm run lint
```
- TypeScript strict mode enabled
- ESLint with React + TypeScript rules
- No unused variables/parameters

### Testing
```bash
npm run test
```
- Unit tests with Vitest
- Component tests with Testing Library
- Coverage reporting

### Type Checking
```bash
npm run build
```
- TypeScript compilation
- Catches type errors before deploy

## Common Tasks

### Adding a New Component
```typescript
// src/components/MyComponent.tsx
import { FC } from 'react';

interface MyComponentProps {
  title: string;
}

export const MyComponent: FC<MyComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};
```

### Adding a New Hook
```typescript
// src/hooks/useMyHook.ts
import { useState, useCallback } from 'react';

export function useMyHook() {
  const [state, setState] = useState(0);
  
  const increment = useCallback(() => {
    setState(prev => prev + 1);
  }, []);
  
  return { state, increment };
}
```

### Adding Utility Functions
```typescript
// src/utils/myUtils.ts
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
```

### Updating PWA Manifest
Edit `public/manifest.json`:
```json
{
  "name": "Mortgage Calculator PWA",
  "short_name": "MortgageCalc",
  "theme_color": "#1e40af",
  "background_color": "#ffffff"
}
```

Then rebuild:
```bash
npm run build
```

## Debugging

### Service Worker Issues
1. Unregister old service worker
2. Clear cache: DevTools → Application → Clear storage
3. Hard reload: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
4. Rebuild with `npm run build`

### Build Issues
```bash
# Clean build
rm -rf docs/ node_modules/
npm install
npm run build
```

### TypeScript Errors
```bash
# Check types
npx tsc --noEmit
```

## Best Practices

### DO ✅
- Edit files in `/src` and `/public`
- Commit `/docs` folder to git
- Test production build locally before deploying
- Use semantic commit messages
- Run linter before committing

### DON'T ❌
- Never edit files in `/docs` directly
- Don't commit `node_modules/`
- Don't skip testing PWA features locally
- Don't push without building

## Version Control

### Commit Message Format
```
feat: Add new calculation feature
fix: Correct amortization formula
docs: Update README
style: Format code
refactor: Simplify component structure
test: Add unit tests
build: Update build configuration
```

### Branches
- `main` - Production code, deploys automatically
- `develop` - Development branch (optional)
- `feature/*` - Feature branches

## Performance Monitoring

### Build Size
```bash
npm run build
du -sh docs/
```
- Keep under 2MB for fast loading
- Use code splitting for large dependencies

### Lighthouse
1. Open DevTools → Lighthouse
2. Run audit
3. Target scores: 90+ on all metrics

## Related Documentation

- [Deployment Architecture](./DEPLOYMENT_ARCHITECTURE.md)
- [PWA Quick Reference](./PWA_QUICK_REFERENCE.md)

