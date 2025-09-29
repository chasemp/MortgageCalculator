# Mortgage Calculator PWA

A comprehensive, mobile-first Progressive Web App for calculating mortgage payments with full amortization, extra payments, and advanced features.

## Features

- **Complete Mortgage Calculations**: Principal, interest, taxes, insurance, PMI, and HOA
- **Extra Payments**: Monthly, annual, and one-time extra payments
- **Amortization Schedule**: Full monthly breakdown with PMI timeline
- **PWA Features**: Offline support, installable, works on all devices
- **URL Sharing**: Shareable links that encode all inputs
- **Responsive Design**: Mobile-first with dark/light theme support
- **Accessibility**: WCAG compliant with keyboard navigation

## Tech Stack

- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Chart.js for visualizations
- PWA with Workbox for offline support

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

## Deployment

The app is configured for deployment to GitHub Pages with the base path `/MortgageCalculator/`.

## Project Status

- ✅ M1: Foundations - Project setup, basic UI, state management, PWA
- 🔄 M2: Core Calculations - Payment formulas, amortization engine
- ⏳ M3: Extras & Effects - Extra payments, totals, payoff acceleration
- ⏳ M4: Visualization & Export - Charts, schedule table, CSV export
- ⏳ M5: Share & PWA Polish - Share URL, offline tweaks, icons
- ⏳ M6: QA & Release - Tests, accessibility, deployment

## License

MIT License - see LICENSE file for details.