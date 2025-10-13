# Deployment Configuration - Aligned with PWA Template

## Summary of Changes

This project has been aligned with the best practices from [peadoubleueh PWA template](https://github.com/chasemp/peadoubleueh).

### Key Changes Made

#### 1. ✅ Build Output Directory
- **Changed from**: `dist/`
- **Changed to**: `docs/`
- **Reason**: GitHub Pages can serve directly from `/docs` folder on main branch
- **Files updated**: `vite.config.ts`

#### 2. ✅ Custom Domain Configuration
- **Domain**: `morty.523.life`
- **CNAME file**: Created in `public/CNAME`
- **Auto-copy**: Vite copies CNAME to `docs/` during build
- **Verification**: ✓ Confirmed CNAME present in `docs/CNAME`

#### 3. ✅ Base Path Configuration
- **Changed from**: `/MortgageCalculator/`
- **Changed to**: `/`
- **Reason**: Custom domain serves from root path, not subdirectory

#### 4. ✅ GitHub Actions Workflow
- **Updated**: `.github/workflows/deploy.yml`
- **Changes**: 
  - Upload path changed from `./dist` to `./docs`
  - Added comment: "auto-generated build output"

#### 5. ✅ .gitignore Configuration
- **Created**: New `.gitignore` file
- **Purpose**: Mark `docs/` as auto-generated (with warning comment)
- **Pattern**: Following PWA template convention

#### 6. ✅ Project Documentation
- **Added**: `project-docs/` directory with 3 comprehensive guides:
  - `DEPLOYMENT_ARCHITECTURE.md` - Build system deep dive
  - `PWA_DEVELOPMENT_WORKFLOW.md` - Development best practices
  - `PWA_QUICK_REFERENCE.md` - Quick tips and code patterns

#### 7. ✅ README Enhancement
- **Updated**: Complete rewrite following PWA template style
- **Added**:
  - Live demo link (morty.523.life)
  - Clear file structure explanation
  - Deployment instructions
  - Documentation links
  - Contributing guidelines
  - License clarification

#### 8. ✅ License Clarification
- **Resolved**: README now correctly states AGPLv3 (matching LICENSE file)
- **Added explanation**: Why AGPL is used (network service copyleft)

---

## File Structure (After Changes)

```
MortgageCalculator/
├── .github/
│   └── workflows/
│       └── deploy.yml          # ✏️ Updated to use docs/
│
├── public/
│   ├── CNAME                   # ✨ NEW - morty.523.life
│   ├── manifest.json
│   └── icons/
│
├── src/                        # Source code (no changes)
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
│
├── docs/                       # ✨ NEW - Build output
│   ├── CNAME                   # Auto-copied from public/
│   ├── index.html
│   ├── assets/
│   └── [other build files]
│
├── project-docs/               # ✨ NEW - Documentation
│   ├── DEPLOYMENT_ARCHITECTURE.md
│   ├── PWA_DEVELOPMENT_WORKFLOW.md
│   └── PWA_QUICK_REFERENCE.md
│
├── .gitignore                  # ✨ NEW - Marks docs/ as auto-generated
├── vite.config.ts              # ✏️ Updated: base + outDir
├── README.md                   # ✏️ Enhanced with deployment info
└── DEPLOYMENT_NOTES.md         # ✨ This file
```

---

## Next Steps for Deployment

### 1. Verify GitHub Pages Settings
Go to Repository Settings → Pages:
- **Source**: Deploy from a branch
- **Branch**: `main`
- **Folder**: `/docs` ← **Important!**

### 2. Configure DNS
Point your domain to GitHub Pages:

**Option A: A Records** (Recommended)
```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

**Option B: CNAME Record**
```
CNAME    @    chasemp.github.io
```

### 3. Test Build Locally
```bash
npm run build
npm run preview
# Visit http://localhost:4173
# Test offline mode, install prompt, etc.
```

### 4. Deploy
```bash
git add .
git commit -m "build: Align with PWA template best practices

- Change build output to docs/
- Add CNAME for morty.523.life
- Update deployment workflow
- Add comprehensive documentation"
git push origin main
```

### 5. Verify Deployment
- Wait 1-2 minutes for GitHub Actions
- Visit https://morty.523.life/
- Test PWA features:
  - [ ] Offline mode works
  - [ ] Install prompt appears
  - [ ] Theme switching works
  - [ ] All calculations work
  - [ ] Charts render correctly
  - [ ] CSV export works

---

## Testing Checklist

Before pushing to production:

- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run build` (includes type check)
- [ ] Linter passes: `npm run lint`
- [ ] Tests pass: `npm run test`
- [ ] Preview works: `npm run preview`
- [ ] CNAME file present in `docs/CNAME`
- [ ] All assets load correctly in preview
- [ ] PWA features work (offline, install)
- [ ] Mobile responsive design tested
- [ ] Dark/light theme works

---

## Differences from Original Setup

### Before (Traditional GitHub Pages)
```typescript
// vite.config.ts
base: '/MortgageCalculator/',
build: {
  outDir: 'dist'
}
```
- Required subdirectory path
- Separate upload step in GitHub Actions
- dist/ folder not used directly

### After (PWA Template Pattern)
```typescript
// vite.config.ts
base: '/',
build: {
  outDir: 'docs'
}
```
- Custom domain with root path
- GitHub Pages serves docs/ directly
- CNAME auto-included in build

---

## Benefits of New Setup

1. **Cleaner URLs**: `morty.523.life` vs `github.io/MortgageCalculator`
2. **Simpler Deployment**: GitHub Pages reads `/docs` directly
3. **Professional Domain**: Custom domain for branding
4. **Better Documentation**: Comprehensive guides in `project-docs/`
5. **Clear Separation**: Source (`/src`) vs Build (`/docs`)
6. **PWA Best Practices**: Following proven template pattern
7. **Version Control**: Build output tracked (useful for rollbacks)

---

## Troubleshooting

### CNAME not appearing in docs/?
```bash
# Check public/CNAME exists
cat public/CNAME

# Rebuild
npm run build

# Verify copy
cat docs/CNAME
```

### Assets not loading?
- Verify `base: '/'` in vite.config.ts
- Check browser console for 404s
- Ensure GitHub Pages is serving from `/docs`

### Custom domain not working?
1. Check CNAME in docs/ is committed
2. Verify DNS settings (use `dig morty.523.life`)
3. Wait up to 24 hours for DNS propagation
4. Check GitHub Pages settings in repo

### Build failing?
```bash
# Clean reinstall
rm -rf node_modules package-lock.json docs/
npm install
npm run build
```

---

## Resources

- [peadoubleueh PWA Template](https://github.com/chasemp/peadoubleueh)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

---

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Check for security issues
npm audit

# Rebuild and test
npm run build
npm run preview
```

### Adding Features
1. Edit source files in `/src`
2. Test locally with `npm run dev`
3. Build with `npm run build`
4. Preview with `npm run preview`
5. Commit and push (auto-deploys)

### Monitoring
- Check GitHub Actions for build status
- Monitor site at morty.523.life
- Review analytics if configured
- Test PWA features periodically

---

**Last Updated**: October 13, 2025
**Template Version**: Based on peadoubleueh v1.0
**Status**: ✅ Ready for deployment


