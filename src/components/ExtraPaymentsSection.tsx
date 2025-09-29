import { useState } from 'react';
import { MortgageInputs } from '../types';
import { formatCurrency } from '../utils/mortgageCalculations';

interface ExtraPaymentsSectionProps {
  inputs: MortgageInputs;
  onUpdateInputs: (updates: Partial<MortgageInputs>) => void;
  activeSection: string;
  onSetActiveSection: (section: string) => void;
}

export function ExtraPaymentsSection({ inputs, onUpdateInputs }: ExtraPaymentsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (field: keyof MortgageInputs, value: any) => {
    onUpdateInputs({ [field]: value });
  };

  const handleExtraAnnualChange = (field: 'month' | 'amount', value: number) => {
    onUpdateInputs({
      extraAnnual: {
        ...inputs.extraAnnual,
        [field]: value
      }
    });
  };

  const addOneTimeExtra = () => {
    const newExtra = {
      yearMonth: new Date().toISOString().slice(0, 7), // Current year-month
      amount: 0
    };
    onUpdateInputs({
      extraOneTime: [...inputs.extraOneTime, newExtra]
    });
  };

  const updateOneTimeExtra = (index: number, field: 'yearMonth' | 'amount', value: string | number) => {
    const updated = [...inputs.extraOneTime];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onUpdateInputs({ extraOneTime: updated });
  };

  const removeOneTimeExtra = (index: number) => {
    const updated = inputs.extraOneTime.filter((_, i) => i !== index);
    onUpdateInputs({ extraOneTime: updated });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between">
          Extra Payments
          <span className="text-sm text-gray-500">
            {isExpanded ? '▼' : '▶'}
          </span>
        </h2>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-6">
          {/* Monthly Extra Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monthly Extra Principal
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                inputMode="numeric"
                value={inputs.extraMonthlyPrincipal}
                onChange={(e) => handleInputChange('extraMonthlyPrincipal', Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="0"
                min="0"
              />
              <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                {formatCurrency(inputs.extraMonthlyPrincipal, inputs.currency, inputs.locale)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Additional principal payment every month
            </p>
          </div>

          {/* Annual Extra Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Annual Extra Payment
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Month
                </label>
                <select
                  value={inputs.extraAnnual.month}
                  onChange={(e) => handleExtraAnnualChange('month', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleDateString('en-US', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={inputs.extraAnnual.amount}
                  onChange={(e) => handleExtraAnnualChange('amount', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              One-time extra payment made annually in the selected month
            </p>
          </div>

          {/* One-time Extra Payments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                One-time Extra Payments
              </label>
              <button
                onClick={addOneTimeExtra}
                className="px-3 py-1 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                + Add Payment
              </button>
            </div>
            
            {inputs.extraOneTime.length === 0 ? (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <p className="text-sm">No one-time payments scheduled</p>
                <p className="text-xs mt-1">Click "Add Payment" to schedule extra payments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {inputs.extraOneTime.map((extra, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Date
                        </label>
                        <input
                          type="month"
                          value={extra.yearMonth}
                          onChange={(e) => updateOneTimeExtra(index, 'yearMonth', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Amount
                        </label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={extra.amount}
                          onChange={(e) => updateOneTimeExtra(index, 'amount', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:text-white text-sm"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeOneTimeExtra(index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                      title="Remove payment"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {(inputs.extraMonthlyPrincipal > 0 || inputs.extraAnnual.amount > 0 || inputs.extraOneTime.some(e => e.amount > 0)) && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Extra Payments Summary
              </h3>
              <div className="space-y-1 text-sm">
                {inputs.extraMonthlyPrincipal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Monthly extra:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(inputs.extraMonthlyPrincipal, inputs.currency, inputs.locale)}/month
                    </span>
                  </div>
                )}
                {inputs.extraAnnual.amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Annual extra:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(inputs.extraAnnual.amount, inputs.currency, inputs.locale)}/year
                    </span>
                  </div>
                )}
                {inputs.extraOneTime.filter(e => e.amount > 0).length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">One-time payments:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {inputs.extraOneTime.filter(e => e.amount > 0).length} scheduled
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}