# Mortgage Calculator PWA

A comprehensive, mobile-first Progressive Web App for calculating mortgage payments with full amortization, extra payments, and advanced features.

🌐 **Live Demo:** https://morty.523.life/

---

## ✨ Features

### Core Calculations
- **Complete Mortgage Calculations**: Principal, interest, taxes, insurance, PMI, and HOA
- **Extra Payments**: Monthly, annual, and one-time extra payments
- **Interest Savings**: Automatic calculation of savings from extra payments
- **Amortization Schedule**: Full monthly breakdown with PMI timeline
- **CSV Export**: Download complete amortization schedule

### PWA Features
- **Offline Support**: Works without internet connection
- **Installable**: Add to home screen on mobile/desktop
- **URL Sharing**: Shareable links that encode all calculation inputs
- **Fast Loading**: Optimized caching and performance

### User Experience
- **Responsive Design**: Mobile-first with touch-friendly controls
- **Theme Support**: Light/dark/system theme modes
- **Interactive Charts**: Balance over time and principal vs interest visualizations
- **Accessibility**: WCAG compliant with keyboard navigation

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Opens at http://localhost:5173

# Build for production
npm run build
# → Outputs to /docs for GitHub Pages

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

---

## 📁 Project Structure

```
MortgageCalculator/
├── src/              # Source code (edit these!)
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions & calculations
│   └── types/        # TypeScript type definitions
│
├── public/           # Static assets
│   ├── CNAME         # Custom domain (morty.523.life)
│   ├── manifest.json # PWA manifest
│   └── icons/        # App icons
│
├── docs/             # Build output (auto-generated - never edit!)
├── project-docs/     # Project documentation
└── vite.config.ts    # Build configuration
```

**Important:** Always edit files in `/src` and `/public`. The `/docs` folder is auto-generated during build.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with dark mode
- **Charts**: Chart.js with react-chartjs-2
- **PWA**: Vite PWA plugin with Workbox
- **Testing**: Vitest + React Testing Library
- **Deployment**: GitHub Pages (automated via GitHub Actions)

---

## 📦 Deployment

### Automatic Deployment (Recommended)

1. Make changes and commit:
   ```bash
   git add .
   git commit -m "feat: Add new feature"
   git push origin main
   ```

2. GitHub Actions automatically:
   - Builds the app (`npm run build`)
   - Deploys to GitHub Pages
   - Live at https://morty.523.life/ (1-2 minutes)

### Manual Deployment

```bash
# Build production version
npm run build

# Commit build output
git add docs/
git commit -m "build: Update production build"
git push origin main
```

### Custom Domain Setup

The project is configured for `morty.523.life`:
- `public/CNAME` contains the domain
- DNS points to GitHub Pages
- HTTPS automatically enabled

---

## 📚 Documentation

Comprehensive guides in `project-docs/`:

- **[Deployment Architecture](project-docs/DEPLOYMENT_ARCHITECTURE.md)** - Build system and deployment flow
- **[Development Workflow](project-docs/PWA_DEVELOPMENT_WORKFLOW.md)** - Best practices and daily workflow
- **[Quick Reference](project-docs/PWA_QUICK_REFERENCE.md)** - Code patterns and commands

---

## 🧪 Testing

### Run Tests
```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

### Test PWA Features Locally
1. Build production version: `npm run build`
2. Preview: `npm run preview`
3. Test offline: DevTools → Network → Offline
4. Test install: Look for install prompt in browser

---

## 🎯 Project Status

- ✅ **M1**: Foundations - Project setup, UI, state management, PWA
- ✅ **M2**: Core Calculations - Payment formulas, amortization engine
- ✅ **M3**: Extras & Effects - Extra payments, interest savings
- ✅ **M4**: Visualization & Export - Charts, schedule table, CSV export
- ✅ **M5**: Share & PWA Polish - URL sharing, offline support, icons
- 🔄 **M6**: QA & Release - Tests, accessibility improvements, documentation

---

## 🤝 Contributing

This project follows the [peadoubleueh PWA template](https://github.com/chasemp/peadoubleueh) best practices.

### Development Guidelines

1. **Edit source files** in `/src` and `/public` only
2. **Never edit** `/docs` manually (auto-generated)
3. **Test locally** before pushing (`npm run build && npm run preview`)
4. **Run linter** before committing (`npm run lint`)
5. **Write tests** for new features
6. **Use semantic commits**: `feat:`, `fix:`, `docs:`, etc.

---

## 📄 License

AGPLv3 License - See [LICENSE](LICENSE) file for details.

This ensures that any modifications to this software, especially when used as a network service, remain open source.

---

## 🙏 Acknowledgments

- PWA patterns from [peadoubleueh template](https://github.com/chasemp/peadoubleueh)
- Built following modern React and TypeScript best practices
- Inspired by real-world mortgage calculator needs

---

**Built with ❤️ for transparent, accessible financial tools**