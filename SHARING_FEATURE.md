# Share Feature Documentation

## Overview

The mortgage calculator includes a powerful share feature that generates URLs with all calculation parameters pre-populated, including the property link.

## How It Works

### 1. Share Button
Click the **📤 Share** button in the header to generate a shareable link.

### 2. Share Methods

**On Mobile/Modern Browsers:**
- Opens native share dialog
- Share via text, email, social media, etc.
- Title: "Mortgage Calculator - morty.523.life"
- Message: "Check out this mortgage calculation with all the details pre-filled"

**On Desktop/Older Browsers:**
- Automatically copies URL to clipboard
- Toast notification confirms copy
- Paste the URL anywhere to share

### 3. URL Structure

The generated URL includes ALL calculation parameters:

```
https://morty.523.life/?
  price=450000
  &downPaymentPercent=20
  &termYears=30
  &aprPercent=6.5
  &startYearMonth=2025-10
  &propertyLink=https://zillow.com/property/123
  &annualTaxes=4800
  &annualInsurance=1500
  &hoaMonthly=0
  &pmiMode=rate
  &pmiAnnualRate=0.6
  &pmiCancelAtLtvPercent=80
  &includeEscrow=true
  &extraMonthlyPrincipal=200
  &extraAnnual.month=12
  &extraAnnual.amount=1000
  &currency=USD
  &locale=en-US
  &version=1
```

### 4. What Gets Shared

✅ **Basic Loan Details:**
- Home price
- Down payment (amount or percentage)
- Loan term
- Interest rate (APR)
- Start date
- **Property link** ← NEW!

✅ **Additional Costs:**
- Annual property taxes
- Annual homeowners insurance
- Monthly HOA dues
- PMI settings (rate or fixed amount)
- PMI cancellation threshold

✅ **Extra Payments:**
- Monthly extra principal
- Annual extra payment (month and amount)
- One-time extra payments (with dates)

✅ **Display Preferences:**
- Include escrow toggle
- Currency and locale

### 5. When Someone Opens Your Link

When a recipient opens your shared link at `morty.523.life`:

1. **All inputs are pre-filled** with your values
2. **Property link appears** in both input and results sections
3. **Calculations run automatically** showing identical results
4. **They can modify values** to explore different scenarios
5. **They can click the property link** to view the listing

## Use Cases

### Real Estate Agents
```
Agent to Client:
"Here's the mortgage breakdown for the property at [link].
I've included 20% down and showed you the impact of 
$200/month extra payments."
```

### Home Buyers
```
Buyer to Family:
"What do you think of this property? Here's what the 
monthly payment would look like with our budget."
```

### Financial Planning
```
Couple Planning:
"I ran the numbers with different down payment amounts.
Check out scenario A vs B."
```

### Lender Pre-Qualification
```
Lender to Buyer:
"Based on your pre-qualification, here's what you can 
afford with current rates."
```

## Examples

### Simple Share
```
https://morty.523.life/?price=500000&downPaymentPercent=20&termYears=30&aprPercent=7
```
Result: Basic 30-year fixed mortgage at 7% APR with 20% down

### With Property Link
```
https://morty.523.life/?price=450000&downPaymentPercent=20&termYears=30&aprPercent=6.5&propertyLink=https://zillow.com/homedetails/123-main-st/456
```
Result: Complete calculation with clickable property link

### With Extra Payments
```
https://morty.523.life/?price=600000&downPaymentPercent=25&termYears=30&aprPercent=6.75&extraMonthlyPrincipal=300&extraAnnual.month=12&extraAnnual.amount=5000
```
Result: Shows interest savings from $300/month + $5,000 annual bonus payment

### Complete Scenario
```
https://morty.523.life/?price=750000&downPaymentPercent=20&termYears=30&aprPercent=7.25&propertyLink=https://redfin.com/property/789&annualTaxes=8400&annualInsurance=2000&hoaMonthly=150&pmiAnnualRate=0.5&extraMonthlyPrincipal=500
```
Result: Full calculation with property link, all costs, and extra payments

## Technical Details

### URL Generation
- Uses `window.location.origin` - works in any environment
- Development: `http://localhost:5173`
- Production: `https://morty.523.life`
- Encodes all non-null/undefined values
- Handles nested objects (extraAnnual)
- Handles arrays (extraOneTime)

### URL Parsing
- Runs automatically on page load
- Parses query parameters
- Populates all input fields
- Triggers calculation
- Maintains URL in browser address bar

### URL Length
- Modern browsers support URLs up to ~2000 characters
- Current implementation uses ~400-800 characters typically
- Well within safe limits for all scenarios

## Privacy & Security

✅ **Client-Side Only:**
- No data sent to servers
- All calculation happens in browser
- URLs are generated locally

✅ **Safe to Share:**
- Contains only financial calculation data
- No personal information
- No authentication tokens
- Property links are user-provided

✅ **Link Security:**
- Property links open with `rel="noopener noreferrer"`
- Prevents tab hijacking
- External links clearly marked

## Browser Support

**Share API (Native Dialog):**
- iOS Safari 12+
- Android Chrome 61+
- Samsung Internet 8+
- Edge 93+

**Clipboard API (Fallback):**
- Chrome 63+
- Firefox 53+
- Safari 13.1+
- Edge 79+

**URL Parameters (Core Feature):**
- All modern browsers (IE11+)
- Mobile browsers
- PWA installed apps

## Future Enhancements

Potential additions:
- QR code generation for easy mobile sharing
- Short URL service integration
- Save/Load calculation presets
- Email share template
- Print-friendly calculation summary

---

**Last Updated:** October 13, 2025
**Version:** 1.0


