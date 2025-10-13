# PWA Quick Reference

## Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Check code quality
npm run test            # Run tests

# Deployment
git push origin main    # Auto-deploy via GitHub Actions
```

## File Organization

```
✏️  EDIT THESE:
  /src/               - Source code
  /public/            - Static assets
  vite.config.ts      - Build configuration
  package.json        - Dependencies

🚫 NEVER EDIT:
  /docs/              - Auto-generated build output
```

## Common Patterns

### State Management
```typescript
// Custom hook pattern
export function useMortgageCalculator() {
  const [inputs, setInputs] = useState<MortgageInputs>(defaults);
  const [results, setResults] = useState<MortgageResults | null>(null);
  
  // Debounced calculation
  useEffect(() => {
    const timer = setTimeout(() => calculate(), 300);
    return () => clearTimeout(timer);
  }, [inputs]);
  
  return { inputs, results, updateInputs };
}
```

### URL State Persistence
```typescript
// Encode state in URL
const shareUrl = () => {
  const params = new URLSearchParams();
  Object.entries(inputs).forEach(([key, val]) => {
    params.append(key, String(val));
  });
  return `${window.location.origin}?${params}`;
};

// Load from URL on mount
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const urlInputs = Object.fromEntries(params);
  setInputs(prev => ({ ...prev, ...urlInputs }));
}, []);
```

### Theme Management
```typescript
// System preference detection
const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

useEffect(() => {
  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDark);
  } else {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}, [theme]);
```

### Service Worker Updates
```typescript
// Notify user of updates
window.addEventListener('message', (event) => {
  if (event.data === 'sw-update-available') {
    showToast('Update available. Refresh to update.', 'info');
  }
});
```

## Component Patterns

### Input Component
```typescript
interface InputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export const NumberInput: FC<InputProps> = ({ value, onChange, label }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <input
      type="number"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-3 py-2 border rounded-md"
    />
  </div>
);
```

### Results Display
```typescript
export const ResultsCard: FC<{ title: string; value: number }> = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
    <h3 className="text-sm text-gray-600 dark:text-gray-400">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">
      {formatCurrency(value)}
    </p>
  </div>
);
```

## Styling Patterns

### Responsive Grid
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <InputSection />
  <ResultsSection />
</div>
```

### Dark Mode
```tsx
<div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Content */}
</div>
```

### Mobile-First
```tsx
<button className="px-4 py-2 text-sm md:text-base lg:px-6 lg:py-3">
  Click Me
</button>
```

## PWA Configuration

### Manifest (public/manifest.json)
```json
{
  "name": "Mortgage Calculator PWA",
  "short_name": "MortgageCalc",
  "description": "Calculate mortgage payments",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1e40af",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "icons/icon-192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    }
  ]
}
```

### Service Worker (vite.config.ts)
```typescript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\./,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: { maxEntries: 50, maxAgeSeconds: 300 }
        }
      }
    ]
  }
})
```

## Testing Patterns

### Unit Tests
```typescript
describe('calculateMonthlyPayment', () => {
  it('calculates correctly', () => {
    const payment = calculateMonthlyPayment(400000, 0.005, 360);
    expect(payment).toBeCloseTo(2398.20, 2);
  });
  
  it('handles zero interest', () => {
    const payment = calculateMonthlyPayment(400000, 0, 360);
    expect(payment).toBeCloseTo(1111.11, 2);
  });
});
```

### Component Tests
```typescript
describe('ResultsSection', () => {
  it('displays monthly payment', () => {
    render(<ResultsSection results={mockResults} />);
    expect(screen.getByText(/\$2,398/)).toBeInTheDocument();
  });
});
```

## Debugging

### Check Service Worker
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Active SWs:', registrations.length);
});
```

### Check Cache
```javascript
caches.keys().then(names => console.log('Caches:', names));
```

### Clear Everything
```javascript
// In DevTools Console
caches.keys().then(names => 
  Promise.all(names.map(name => caches.delete(name)))
);
navigator.serviceWorker.getRegistrations().then(registrations =>
  Promise.all(registrations.map(r => r.unregister()))
);
```

## Deployment Checklist

- [ ] Run `npm run lint` (no errors)
- [ ] Run `npm run test` (all passing)
- [ ] Run `npm run build` (successful)
- [ ] Run `npm run preview` (test locally)
- [ ] Test offline mode
- [ ] Test install prompt
- [ ] Commit `/docs` folder
- [ ] Push to main branch
- [ ] Verify deployment at morty.523.life

## Performance Tips

1. **Lazy Load Charts**: `const Charts = lazy(() => import('./Charts'))`
2. **Memoize Expensive Components**: `export default memo(Component)`
3. **Debounce User Input**: 300ms delay on calculations
4. **Virtual Scrolling**: For large amortization schedules
5. **Code Split**: Keep initial bundle under 200KB

## Security Checklist

- [ ] No API keys in code
- [ ] HTTPS only (enforced by GitHub Pages)
- [ ] No eval() or dangerous HTML
- [ ] Sanitize user input
- [ ] CSP headers configured
- [ ] Regular dependency updates

## Resources

- [peadoubleueh PWA Template](https://github.com/chasemp/peadoubleueh)
- [Vite Documentation](https://vitejs.dev/)
- [PWA Guidelines](https://web.dev/progressive-web-apps/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

