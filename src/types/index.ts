// Core data types for the mortgage calculator

export interface MortgageInputs {
  // Basic loan information
  price: number;
  downPaymentAmount?: number;
  downPaymentPercent?: number;
  termYears: number;
  aprPercent: number;
  startYearMonth: string; // Format: "YYYY-MM"
  
  // Additional costs
  annualTaxes: number;
  annualInsurance: number;
  hoaMonthly: number;
  
  // PMI configuration
  pmiMode: 'rate' | 'fixed';
  pmiAnnualRate?: number;
  pmiMonthlyFixed?: number;
  pmiCancelAtLtvPercent: number;
  
  // Escrow and extras
  includeEscrow: boolean;
  extraMonthlyPrincipal: number;
  extraAnnual: {
    month: number; // 1-12
    amount: number;
  };
  extraOneTime: Array<{
    yearMonth: string; // Format: "YYYY-MM"
    amount: number;
  }>;
  
  // Localization
  currency: string;
  locale: string;
  version: number;
}

export interface AmortizationEntry {
  date: string; // Format: "YYYY-MM-DD"
  paymentMortgageOnly: number;
  interest: number;
  principal: number;
  extraPrincipal: number;
  pmi: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
  ltv: number; // Loan-to-value ratio
}

export interface MortgageTotals {
  principal: number;
  interest: number;
  pmi: number;
  taxes: number;
  insurance: number;
  hoa: number;
  monthsToPayoff: number;
  totalCost: number;
  interestSavings: number; // From extra payments
}

export interface MortgageResults {
  schedule: AmortizationEntry[];
  totals: MortgageTotals;
  monthlyPayment: {
    mortgageOnly: number;
    withEscrow: number;
  };
  payoffDate: string;
  pmiStopMonth?: number;
}

export interface ChartData {
  balanceOverTime: Array<{
    month: number;
    balance: number;
  }>;
  principalVsInterest: Array<{
    year: number;
    principal: number;
    interest: number;
  }>;
}

// URL sharing types
export interface ShareableConfig {
  inputs: MortgageInputs;
  timestamp: number;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// UI state types
export interface UIState {
  theme: Theme;
  activeSection: 'inputs' | 'extras' | 'results' | 'schedule' | 'charts';
  isCalculating: boolean;
  lastCalculationTime: number;
}