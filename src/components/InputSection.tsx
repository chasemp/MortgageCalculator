import { useState } from 'react';
import { MortgageInputs } from '../types';

interface InputSectionProps {
  inputs: MortgageInputs;
  onUpdateInputs: (updates: Partial<MortgageInputs>) => void;
  activeSection: string;
  onSetActiveSection: (section: string) => void;
}

export function InputSection({ inputs, onUpdateInputs }: InputSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleInputChange = (field: keyof MortgageInputs, value: any) => {
    onUpdateInputs({ [field]: value });
  };

  const handleDownPaymentModeChange = (mode: 'amount' | 'percent') => {
    if (mode === 'amount') {
      const amount = (inputs.price * (inputs.downPaymentPercent || 0)) / 100;
      onUpdateInputs({ 
        downPaymentAmount: amount, 
        downPaymentPercent: undefined 
      });
    } else {
      const percent = inputs.downPaymentAmount ? 
        (inputs.downPaymentAmount / inputs.price) * 100 : 0;
      onUpdateInputs({ 
        downPaymentPercent: percent, 
        downPaymentAmount: undefined 
      });
    }
  };

  const downPaymentMode = inputs.downPaymentAmount !== undefined ? 'amount' : 'percent';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between">
          Loan Details
          <span className="text-sm text-gray-500">
            {isExpanded ? '▼' : '▶'}
          </span>
        </h2>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Home Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Home Price
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={inputs.price}
              onChange={(e) => handleInputChange('price', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="450000"
            />
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Down Payment
            </label>
            <div className="flex space-x-2 mb-2">
              <button
                onClick={() => handleDownPaymentModeChange('amount')}
                className={`px-3 py-1 text-sm rounded-md ${
                  downPaymentMode === 'amount'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Amount
              </button>
              <button
                onClick={() => handleDownPaymentModeChange('percent')}
                className={`px-3 py-1 text-sm rounded-md ${
                  downPaymentMode === 'percent'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Percentage
              </button>
            </div>
            <div className="flex space-x-2">
              <input
                type="number"
                inputMode="numeric"
                step={downPaymentMode === 'amount' ? '1000' : '0.1'}
                value={downPaymentMode === 'amount' ? (inputs.downPaymentAmount || 0) : (inputs.downPaymentPercent || 0)}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (downPaymentMode === 'amount') {
                    handleInputChange('downPaymentAmount', value);
                  } else {
                    handleInputChange('downPaymentPercent', value);
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder={downPaymentMode === 'amount' ? '90000' : '20'}
              />
              <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                {downPaymentMode === 'amount' ? '$' : '%'}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {downPaymentMode === 'amount' 
                ? `${((inputs.downPaymentAmount || 0) / inputs.price * 100).toFixed(1)}% of home price`
                : `$${((inputs.downPaymentPercent || 0) / 100 * inputs.price).toLocaleString('en-US', { maximumFractionDigits: 0 })} down payment`
              }
            </p>
          </div>

          {/* Loan Term and Interest Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Loan Term (years)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={inputs.termYears}
                onChange={(e) => handleInputChange('termYears', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={inputs.aprPercent}
                onChange={(e) => handleInputChange('aprPercent', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="6.5"
              />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="month"
              value={inputs.startYearMonth}
              onChange={(e) => handleInputChange('startYearMonth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Property Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property Link (Optional)
            </label>
            <input
              type="url"
              value={inputs.propertyLink || ''}
              onChange={(e) => handleInputChange('propertyLink', e.target.value)}
              placeholder="https://example.com/property/123"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Add a link to the property listing for easy reference
            </p>
          </div>

          {/* Additional Costs */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
              Additional Costs
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Annual Property Taxes
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={inputs.annualTaxes}
                  onChange={(e) => handleInputChange('annualTaxes', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="4800"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Annual Homeowners Insurance
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={inputs.annualInsurance}
                  onChange={(e) => handleInputChange('annualInsurance', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="1500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monthly HOA Dues
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={inputs.hoaMonthly}
                  onChange={(e) => handleInputChange('hoaMonthly', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Escrow Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="includeEscrow"
              checked={inputs.includeEscrow}
              onChange={(e) => handleInputChange('includeEscrow', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="includeEscrow" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Include escrow in monthly payment display
            </label>
          </div>
        </div>
      )}
    </div>
  );
}