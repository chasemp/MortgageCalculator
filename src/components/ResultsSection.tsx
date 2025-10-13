import { MortgageResults, MortgageInputs } from '../types';
import { formatCurrency } from '../utils/mortgageCalculations';
import { ExtraPaymentsSection } from './ExtraPaymentsSection';
import { AmortizationSchedule } from './AmortizationSchedule';
import { MortgageCharts } from './MortgageCharts';

interface ResultsSectionProps {
  results: MortgageResults;
  inputs: MortgageInputs;
  activeSection: string;
  onSetActiveSection: (section: string) => void;
  onUpdateInputs?: (updates: Partial<MortgageInputs>) => void;
}

export function ResultsSection({ results, inputs, activeSection, onSetActiveSection, onUpdateInputs }: ResultsSectionProps) {
  const { monthlyPayment, totals, payoffDate, pmiStopMonth } = results;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Payment Summary
        </h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Mortgage Payment
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(monthlyPayment.mortgageOnly, inputs.currency, inputs.locale)}
            </span>
          </div>
          
          {inputs.includeEscrow && (
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                With Escrow
              </span>
              <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {formatCurrency(monthlyPayment.withEscrow, inputs.currency, inputs.locale)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Payoff Date
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date(payoffDate).toLocaleDateString(inputs.locale, {
                year: 'numeric',
                month: 'long'
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Totals Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Total Costs
        </h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Principal</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(totals.principal, inputs.currency, inputs.locale)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Interest</span>
            <span className="font-medium text-red-600 dark:text-red-400">
              {formatCurrency(totals.interest, inputs.currency, inputs.locale)}
            </span>
          </div>
          
          {totals.pmi > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">PMI</span>
              <span className="font-medium text-orange-600 dark:text-orange-400">
                {formatCurrency(totals.pmi, inputs.currency, inputs.locale)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Property Taxes</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(totals.taxes, inputs.currency, inputs.locale)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Insurance</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(totals.insurance, inputs.currency, inputs.locale)}
            </span>
          </div>
          
          {totals.hoa > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">HOA</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(totals.hoa, inputs.currency, inputs.locale)}
              </span>
            </div>
          )}
          
          {totals.interestSavings > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600 dark:text-green-400">Interest Savings</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatCurrency(totals.interestSavings, inputs.currency, inputs.locale)}
              </span>
            </div>
          )}
          
          <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-900 dark:text-white">Total Cost</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(totals.totalCost, inputs.currency, inputs.locale)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PMI Information */}
      {pmiStopMonth && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 text-lg">ℹ️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                PMI Cancellation
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                PMI will be cancelled after month {pmiStopMonth} when LTV reaches {inputs.pmiCancelAtLtvPercent}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-600">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'schedule', label: 'Schedule', icon: '📊' },
              { id: 'charts', label: 'Charts', icon: '📈' },
              { id: 'extras', label: 'Extras', icon: '➕' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSetActiveSection(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeSection === 'schedule' && (
            <AmortizationSchedule
              schedule={results.schedule}
              inputs={inputs}
            />
          )}
          
          {activeSection === 'charts' && (
            <MortgageCharts
              schedule={results.schedule}
              inputs={inputs}
            />
          )}
          
          {activeSection === 'extras' && onUpdateInputs && (
            <div className="hidden lg:block">
              <ExtraPaymentsSection
                inputs={inputs}
                onUpdateInputs={onUpdateInputs}
                activeSection={activeSection}
                onSetActiveSection={onSetActiveSection}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}