import { describe, it, expect } from 'vitest';
import { 
  calculateMonthlyPayment, 
  calculateLoanAmount, 
  calculatePMI, 
  shouldCancelPMI,
  formatCurrency,
  formatPercentage
} from '../mortgageCalculations';
import { MortgageInputs } from '../../types';

describe('Mortgage Calculations', () => {
  describe('calculateMonthlyPayment', () => {
    it('should calculate monthly payment correctly', () => {
      const loanAmount = 400000;
      const monthlyRate = 0.005; // 6% APR / 12
      const months = 360; // 30 years
      
      const payment = calculateMonthlyPayment(loanAmount, monthlyRate, months);
      expect(payment).toBeCloseTo(2398.20, 2);
    });

    it('should handle zero interest rate', () => {
      const loanAmount = 400000;
      const monthlyRate = 0;
      const months = 360;
      
      const payment = calculateMonthlyPayment(loanAmount, monthlyRate, months);
      expect(payment).toBeCloseTo(1111.11, 2);
    });
  });

  describe('calculateLoanAmount', () => {
    it('should calculate loan amount from down payment amount', () => {
      const inputs: Partial<MortgageInputs> = {
        price: 500000,
        downPaymentAmount: 100000,
        downPaymentPercent: undefined
      };
      
      const loanAmount = calculateLoanAmount(inputs as MortgageInputs);
      expect(loanAmount).toBe(400000);
    });

    it('should calculate loan amount from down payment percentage', () => {
      const inputs: Partial<MortgageInputs> = {
        price: 500000,
        downPaymentAmount: undefined,
        downPaymentPercent: 20
      };
      
      const loanAmount = calculateLoanAmount(inputs as MortgageInputs);
      expect(loanAmount).toBe(400000);
    });

    it('should handle no down payment', () => {
      const inputs: Partial<MortgageInputs> = {
        price: 500000,
        downPaymentAmount: undefined,
        downPaymentPercent: undefined
      };
      
      const loanAmount = calculateLoanAmount(inputs as MortgageInputs);
      expect(loanAmount).toBe(500000);
    });
  });

  describe('calculatePMI', () => {
    it('should calculate PMI from annual rate', () => {
      const inputs: Partial<MortgageInputs> = {
        pmiMode: 'rate' as const,
        pmiAnnualRate: 0.6
      };
      
      const pmi = calculatePMI(inputs as MortgageInputs, 400000, 500000);
      expect(pmi).toBe(200); // 0.6% * 400000 / 12
    });

    it('should calculate PMI from fixed monthly amount', () => {
      const inputs: Partial<MortgageInputs> = {
        pmiMode: 'fixed' as const,
        pmiMonthlyFixed: 150
      };
      
      const pmi = calculatePMI(inputs as MortgageInputs, 400000, 500000);
      expect(pmi).toBe(150);
    });

    it('should return 0 for no PMI', () => {
      const inputs: Partial<MortgageInputs> = {
        pmiMode: 'rate' as const,
        pmiAnnualRate: undefined
      };
      
      const pmi = calculatePMI(inputs as MortgageInputs, 400000, 500000);
      expect(pmi).toBe(0);
    });
  });

  describe('shouldCancelPMI', () => {
    it('should cancel PMI when LTV is below threshold', () => {
      const shouldCancel = shouldCancelPMI(400000, 500000, 80);
      expect(shouldCancel).toBe(true);
    });

    it('should not cancel PMI when LTV is above threshold', () => {
      const shouldCancel = shouldCancelPMI(450000, 500000, 80);
      expect(shouldCancel).toBe(false);
    });

    it('should cancel PMI when LTV equals threshold', () => {
      const shouldCancel = shouldCancelPMI(400000, 500000, 80);
      expect(shouldCancel).toBe(true);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      const formatted = formatCurrency(1234.56, 'USD', 'en-US');
      expect(formatted).toBe('$1,235');
    });

    it('should format large numbers correctly', () => {
      const formatted = formatCurrency(1234567.89, 'USD', 'en-US');
      expect(formatted).toBe('$1,234,568');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage correctly', () => {
      const formatted = formatPercentage(6.5, 'en-US', 2);
      expect(formatted).toBe('6.50%');
    });

    it('should format percentage with custom decimals', () => {
      const formatted = formatPercentage(6.5, 'en-US', 1);
      expect(formatted).toBe('6.5%');
    });
  });
});