import { MortgageInputs, AmortizationEntry, MortgageTotals, MortgageResults } from '../types';

/**
 * Calculate monthly mortgage payment using standard formula
 */
export function calculateMonthlyPayment(
  loanAmount: number,
  monthlyRate: number,
  months: number
): number {
  if (monthlyRate === 0) {
    return loanAmount / months;
  }
  
  const factor = Math.pow(1 + monthlyRate, months);
  return loanAmount * (monthlyRate * factor) / (factor - 1);
}

/**
 * Calculate total interest paid without extra payments
 */
export function calculateInterestWithoutExtras(
  loanAmount: number,
  monthlyRate: number,
  months: number
): number {
  const monthlyPayment = calculateMonthlyPayment(loanAmount, monthlyRate, months);
  let currentBalance = loanAmount;
  let totalInterest = 0;
  
  for (let month = 1; month <= months && currentBalance > 0; month++) {
    const interest = currentBalance * monthlyRate;
    const principal = Math.min(monthlyPayment - interest, currentBalance);
    
    totalInterest += interest;
    currentBalance = Math.max(0, currentBalance - principal);
    
    if (currentBalance <= 0) break;
  }
  
  return totalInterest;
}

/**
 * Calculate loan amount from price and down payment
 */
export function calculateLoanAmount(inputs: MortgageInputs): number {
  const { price, downPaymentAmount, downPaymentPercent } = inputs;
  
  if (downPaymentAmount !== undefined) {
    return Math.max(0, price - downPaymentAmount);
  }
  
  if (downPaymentPercent !== undefined) {
    return Math.max(0, price * (1 - downPaymentPercent / 100));
  }
  
  return price; // No down payment specified
}

/**
 * Calculate PMI amount for a given month
 */
export function calculatePMI(
  inputs: MortgageInputs,
  currentBalance: number,
  _originalPrice: number
): number {
  const { pmiMode, pmiAnnualRate, pmiMonthlyFixed } = inputs;
  
  if (pmiMode === 'fixed' && pmiMonthlyFixed !== undefined) {
    return pmiMonthlyFixed;
  }
  
  if (pmiMode === 'rate' && pmiAnnualRate !== undefined) {
    return (pmiAnnualRate * currentBalance) / 12;
  }
  
  return 0;
}

/**
 * Check if PMI should be cancelled based on LTV
 */
export function shouldCancelPMI(
  currentBalance: number,
  originalPrice: number,
  cancelThreshold: number
): boolean {
  const ltv = (currentBalance / originalPrice) * 100;
  return ltv <= cancelThreshold;
}

/**
 * Generate complete amortization schedule
 */
export function generateAmortizationSchedule(inputs: MortgageInputs): MortgageResults {
  const loanAmount = calculateLoanAmount(inputs);
  const monthlyRate = inputs.aprPercent / 100 / 12;
  const months = inputs.termYears * 12;
  
  const monthlyPayment = calculateMonthlyPayment(loanAmount, monthlyRate, months);
  
  const schedule: AmortizationEntry[] = [];
  let currentBalance = loanAmount;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  let pmiStopMonth: number | undefined;
  
  // Parse start date
  const [startYear, startMonth] = inputs.startYearMonth.split('-').map(Number);
  let currentDate = new Date(startYear, startMonth - 1, 1);
  
  for (let month = 1; month <= months && currentBalance > 0; month++) {
    const interest = currentBalance * monthlyRate;
    const scheduledPrincipal = monthlyRate === 0 ? 
      currentBalance : 
      Math.min(monthlyPayment - interest, currentBalance);
    
    // Calculate extra payments
    let extraPrincipal = inputs.extraMonthlyPrincipal;
    
    // Annual extra payment
    if (month % 12 === inputs.extraAnnual.month) {
      extraPrincipal += inputs.extraAnnual.amount;
    }
    
    // One-time extra payments
    const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const oneTimeExtra = inputs.extraOneTime
      .filter(extra => extra.yearMonth === currentYearMonth)
      .reduce((sum, extra) => sum + extra.amount, 0);
    extraPrincipal += oneTimeExtra;
    
    // Calculate PMI
    const pmi = calculatePMI(inputs, currentBalance, inputs.price);
    const shouldCancel = shouldCancelPMI(currentBalance, inputs.price, inputs.pmiCancelAtLtvPercent);
    const finalPMI = shouldCancel ? 0 : pmi;
    
    // Check if PMI should stop
    if (finalPMI === 0 && pmi > 0 && !pmiStopMonth) {
      pmiStopMonth = month;
    }
    
    const totalPrincipal = Math.min(scheduledPrincipal + extraPrincipal, currentBalance);
    const newBalance = Math.max(0, currentBalance - totalPrincipal);
    
    cumulativeInterest += interest;
    cumulativePrincipal += totalPrincipal;
    
    const ltv = (currentBalance / inputs.price) * 100;
    
    schedule.push({
      date: currentDate.toISOString().split('T')[0],
      paymentMortgageOnly: monthlyPayment,
      interest,
      principal: totalPrincipal,
      extraPrincipal,
      pmi: finalPMI,
      balance: newBalance,
      cumulativeInterest,
      cumulativePrincipal,
      ltv
    });
    
    currentBalance = newBalance;
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
    
    // If paid off, break
    if (currentBalance <= 0) {
      break;
    }
  }
  
  // Calculate interest savings from extra payments
  // This is the difference between interest paid with extra payments vs without
  const interestWithoutExtras = calculateInterestWithoutExtras(loanAmount, monthlyRate, months);
  const interestSavings = Math.max(0, interestWithoutExtras - cumulativeInterest);

  // Calculate totals
  const totals: MortgageTotals = {
    principal: cumulativePrincipal,
    interest: cumulativeInterest,
    pmi: schedule.reduce((sum, entry) => sum + entry.pmi, 0),
    taxes: (inputs.annualTaxes / 12) * schedule.length,
    insurance: (inputs.annualInsurance / 12) * schedule.length,
    hoa: inputs.hoaMonthly * schedule.length,
    monthsToPayoff: schedule.length,
    totalCost: cumulativePrincipal + cumulativeInterest + 
      schedule.reduce((sum, entry) => sum + entry.pmi, 0) +
      (inputs.annualTaxes / 12) * schedule.length +
      (inputs.annualInsurance / 12) * schedule.length +
      inputs.hoaMonthly * schedule.length,
    interestSavings
  };
  
  const monthlyEscrow = inputs.includeEscrow ? 
    (inputs.annualTaxes + inputs.annualInsurance) / 12 + inputs.hoaMonthly : 0;
  
  const payoffDate = schedule.length > 0 ? 
    schedule[schedule.length - 1].date : 
    inputs.startYearMonth + '-01';
  
  return {
    schedule,
    totals,
    monthlyPayment: {
      mortgageOnly: monthlyPayment,
      withEscrow: monthlyPayment + monthlyEscrow
    },
    payoffDate,
    pmiStopMonth
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(
  value: number, 
  locale: string = 'en-US',
  decimals: number = 2
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
}