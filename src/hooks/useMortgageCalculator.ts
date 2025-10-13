import { useState, useEffect, useCallback } from 'react';
import { MortgageInputs, MortgageResults, UIState } from '../types';
import { generateAmortizationSchedule } from '../utils/mortgageCalculations';

// Default inputs
const defaultInputs: MortgageInputs = {
  price: 450000,
  downPaymentPercent: 20,
  termYears: 30,
  aprPercent: 6.5,
  startYearMonth: new Date().toISOString().slice(0, 7), // Current year-month
  annualTaxes: 4800,
  annualInsurance: 1500,
  hoaMonthly: 0,
  pmiMode: 'rate',
  pmiAnnualRate: 0.6,
  pmiCancelAtLtvPercent: 80,
  includeEscrow: true,
  extraMonthlyPrincipal: 0,
  extraAnnual: { month: 12, amount: 0 },
  extraOneTime: [],
  currency: 'USD',
  locale: 'en-US',
  version: 1
};

const defaultUIState: UIState = {
  theme: 'system',
  activeSection: 'inputs',
  isCalculating: false,
  lastCalculationTime: 0
};

export function useMortgageCalculator() {
  const [inputs, setInputs] = useState<MortgageInputs>(defaultInputs);
  const [uiState, setUIState] = useState<UIState>(defaultUIState);
  const [results, setResults] = useState<MortgageResults | null>(null);

  // Calculate results when inputs change
  const calculateResults = useCallback(() => {
    setUIState(prev => ({ ...prev, isCalculating: true }));
    
    try {
      const newResults = generateAmortizationSchedule(inputs);
      setResults(newResults);
      setUIState(prev => ({ 
        ...prev, 
        isCalculating: false, 
        lastCalculationTime: Date.now() 
      }));
    } catch (error) {
      console.error('Calculation error:', error);
      setUIState(prev => ({ ...prev, isCalculating: false }));
    }
  }, [inputs]);

  // Debounced calculation
  useEffect(() => {
    const timeoutId = setTimeout(calculateResults, 300);
    return () => clearTimeout(timeoutId);
  }, [calculateResults]);

  // Update inputs
  const updateInputs = useCallback((updates: Partial<MortgageInputs>) => {
    setInputs(prev => ({ ...prev, ...updates }));
  }, []);

  // Update UI state
  const updateUIState = useCallback((updates: Partial<UIState>) => {
    setUIState(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset to defaults
  const resetInputs = useCallback(() => {
    setInputs(defaultInputs);
  }, []);

  // URL sharing functions
  const generateShareUrl = useCallback(() => {
    const params = new URLSearchParams();
    
    // Encode all inputs as URL parameters
    Object.entries(inputs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Handle arrays (like extraOneTime)
          value.forEach((item, index) => {
            if (typeof item === 'object') {
              Object.entries(item).forEach(([subKey, subValue]) => {
                params.append(`${key}[${index}].${subKey}`, String(subValue));
              });
            } else {
              params.append(`${key}[${index}]`, String(item));
            }
          });
        } else if (typeof value === 'object') {
          // Handle objects (like extraAnnual)
          Object.entries(value).forEach(([subKey, subValue]) => {
            params.append(`${key}.${subKey}`, String(subValue));
          });
        } else {
          params.append(key, String(value));
        }
      }
    });
    
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [inputs]);

  const loadFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.size === 0) return;
    
    try {
      const urlInputs: Partial<MortgageInputs> = {};
      
      // Parse URL parameters back to inputs
      for (const [key, value] of params.entries()) {
        if (key.includes('[') && key.includes(']')) {
          // Handle array parameters
          const [baseKey, indexAndSubKey] = key.split('[');
          const [indexStr, subKey] = indexAndSubKey.split('].');
          const index = parseInt(indexStr);
          
          if (!urlInputs[baseKey as keyof MortgageInputs]) {
            urlInputs[baseKey as keyof MortgageInputs] = [] as any;
          }
          
          if (Array.isArray(urlInputs[baseKey as keyof MortgageInputs])) {
            const arr = urlInputs[baseKey as keyof MortgageInputs] as any[];
            if (!arr[index]) arr[index] = {};
            arr[index][subKey] = isNaN(Number(value)) ? value : Number(value);
          }
        } else if (key.includes('.')) {
          // Handle object parameters
          const [baseKey, subKey] = key.split('.');
          if (!urlInputs[baseKey as keyof MortgageInputs]) {
            urlInputs[baseKey as keyof MortgageInputs] = {} as any;
          }
          (urlInputs[baseKey as keyof MortgageInputs] as any)[subKey] = 
            isNaN(Number(value)) ? value : Number(value);
        } else {
          // Handle simple parameters
          (urlInputs as any)[key] = 
            isNaN(Number(value)) ? value : Number(value);
        }
      }
      
      setInputs(prev => ({ ...prev, ...urlInputs }));
    } catch (error) {
      console.error('Error parsing URL parameters:', error);
    }
  }, []);

  // Load from URL on mount
  useEffect(() => {
    loadFromUrl();
  }, [loadFromUrl]);

  // Update URL when inputs change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newUrl = generateShareUrl();
      window.history.replaceState({}, '', newUrl);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [generateShareUrl]);

  // Theme management
  const toggleTheme = useCallback(() => {
    setUIState(prev => {
      const newTheme = prev.theme === 'light' ? 'dark' : 
                      prev.theme === 'dark' ? 'system' : 'light';
      return { ...prev, theme: newTheme };
    });
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (uiState.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', uiState.theme === 'dark');
    }
  }, [uiState.theme]);

  return {
    inputs,
    uiState,
    results,
    updateInputs,
    updateUIState,
    resetInputs,
    generateShareUrl,
    loadFromUrl,
    toggleTheme
  };
}