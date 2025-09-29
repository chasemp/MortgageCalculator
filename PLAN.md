# Mortgage Calculator PWA – Project Plan

## Goal
Design a robust, mobile-first, static PWA mortgage calculator (deployable to GitHub Pages) that:
- Computes monthly payment and full amortization with principal, interest, taxes, insurance, PMI, and HOA
- Models extra payments (monthly, annual, and one-time) that shorten payoff and reduce interest
- Breaks down total cost into principal vs interest, with taxes/insurance/HOA shown separately
- Provides shareable results via a REST-like URL that fully encodes inputs
- Works offline as a PWA and is optimized for mobile

## Scope and Assumptions
- **Loan type**: Fixed-rate, fully amortizing
- **Compounding**: Monthly
- **PMI**: Optional, stops when LTV ≤ 80% (or configurable threshold), auto-cancel at 78% LTV optional
- **Escrow**: Taxes/insurance may be included in displayed “monthly payment” but are not part of principal/interest amortization
- **Currency/locale**: Default USD/en-US; format numbers/currency cleanly
- **Static hosting**: Single-page app with all state in URL and/or localStorage; no server

## Core Features
### Inputs
- Home price, down payment (amount or %)
- Loan term (years), annual interest rate (APR)
- Start date (month/year)
- Annual property taxes, annual homeowners insurance, HOA monthly dues
- PMI annual rate (or fixed monthly amount), PMI cancel LTV threshold
- Escrow toggle (show “with escrow” vs “mortgage-only”)
- Extra payments: recurring monthly, recurring annual (select month), arbitrary one-time list

### Outputs
- Monthly mortgage-only payment
- Monthly totals with escrow (taxes, insurance, HOA)
- Amortization schedule: monthly row with interest, principal, balance, PMI (if any)
- Totals:
  - Principal paid vs interest paid (always broken out)
  - Taxes, insurance, HOA totals displayed separately
  - Total time to payoff (months/years)
- Visualizations: balance over time, stacked principal vs interest per year
- PMI timeline: start/stop
- Export: CSV of amortization schedule

### Share
- Share button: copies shareable URL to clipboard and invokes Web Share API when available
- URL encodes all inputs (and version), so recipients load identical scenario

### PWA
- Offline: caching of app shell and last-used inputs
- Installable with icons and theme color
- Works as a static site on GitHub Pages

## Calculation Details
### Monthly mortgage payment (mortgage-only)
Let loan amount L = price − downPayment, monthly rate r = APR/12, term months n = years × 12.
If r > 0: M = L · [ r(1+r)^n / ((1+r)^n − 1) ]; else M = L / n.

### Monthly escrow components
- Taxes monthly = annualTaxes / 12
- Insurance monthly = annualInsurance / 12
- HOA monthly = hoaMonthly

### PMI
- Option A: PMI monthly = (pmiAnnualRate × currentPrincipalBalance) / 12
- Option B: user-provided PMI monthly amount
- Stop PMI when current LTV ≤ threshold (e.g., 80%) using original property value

### Amortization with extra payments
For each month: interest = currentBalance × r; scheduledPrincipal = M − interest; add extra payments (monthly, annual, one-time); totalPrincipal = scheduledPrincipal + extras; newBalance = max(0, currentBalance − totalPrincipal). If payoff occurs mid-month, adjust final payment. Recompute PMI stop when LTV threshold crossed. Track cumulative principal, interest, PMI, taxes, insurance, HOA, and month count.

## Data Model (state)
### Inputs state
- price, downPaymentAmount | downPaymentPercent (mutually exclusive UI), termYears, aprPercent, startYearMonth
- annualTaxes, annualInsurance, hoaMonthly
- pmiMode: rate | fixed, pmiAnnualRate | pmiMonthlyFixed, pmiCancelAtLtvPercent
- includeEscrow: boolean
- extraMonthlyPrincipal
- extraAnnual: month (1–12), amount
- extraOneTime: array of { yearMonth, amount }
- currency, locale
- version

### Derived
- loanAmount, monthlyRate, months

### Results
- schedule: array of monthly entries { date, paymentMortgageOnly, interest, principal, extraPrincipal, pmi, balance }
- totals: { principal, interest, pmi, taxes, insurance, hoa, monthsToPayoff }
- charts data series

## URL Sharing Strategy
- Encode inputs in query params (e.g., `?price=450000&dpPct=20&apr=6.5&term=30&tax=4800&ins=1500&hoa=50&pmiRate=0.006&pmiLtv=80&escrow=1&xtraM=200&xtraA=12:1000&xtra1=2026-03:5000&start=2025-10&v=1`)
- For multiple one-time extras, support repeated keys or a compact, URL-safe delimited value
- On load: parse URL first; fallback to localStorage; fallback to sensible defaults
- Debounce updates to URL; optional compressed `cfg=` param for long scenarios

## UX and Mobile Optimization
- Mobile-first single-column layout; collapsible sections: Inputs, Extras, Results, Schedule, Charts
- Sticky summary bar with monthly payment (mortgage-only vs with escrow) and payoff date
- Inputs: numeric inputmode, toggle down payment % vs amount, validation
- Results: clear principal vs interest separation; taxes/insurance/HOA separated; PMI stop badge; CSV export
- Accessibility: semantic HTML, labels, keyboard navigable, visible focus, contrast; accessible chart summaries

## PWA and Static Hosting (GitHub Pages)
- Build as a single-page app using standard query params
- `manifest.json` with icons, name, theme/background colors
- Service worker via Workbox/vite-plugin-pwa: cache-first app shell, stale-while-revalidate assets
- Offline behavior: calculator works with last inputs
- GitHub Actions for CI to build and deploy `dist` to `gh-pages` branch; set Vite `base: '/MortgageCalculator/'`

## Tech Stack
- React + TypeScript + Vite
- Lightweight CSS (Tailwind or CSS modules)
- Chart.js with accessible data table fallback
- Custom URL/state hooks; Vitest + Testing Library; Prettier + ESLint

## Testing Plan
- Unit: payment formula edge cases; amortization accuracy; PMI stop; extra payments; totals integrity
- Integration: URL parse/serialize roundtrip; share button; offline PWA
- Snapshot/visual: mobile breakpoints

## Privacy and Legal
- No personal data; all client-side
- Disclaimer: results are estimates; consult your lender

## Milestones
- M1: Foundations – scaffold, UI shell, state + URL, basic PWA
- M2: Core Calculations – payment formula, amortization engine, escrow, PMI
- M3: Extras & Effects – extra payments, totals, payoff acceleration messaging
- M4: Visualization & Export – charts, schedule table, CSV export
- M5: Share & PWA Polish – share URL, offline tweaks, icons
- M6: QA & Release – tests, a11y, deploy to GitHub Pages

## Acceptance Criteria
- Adjusting any input updates mortgage-only, with-escrow total, payoff date, totals (principal vs interest), PMI stop month
- Share URL reproduces identical results elsewhere
- App is installable, works offline, and renders well on small screens
- CSV export matches displayed schedule totals

