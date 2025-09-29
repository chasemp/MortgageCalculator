import { useState, useMemo } from 'react';
import { AmortizationEntry, MortgageInputs } from '../types';
import { formatCurrency, formatPercentage } from '../utils/mortgageCalculations';

interface AmortizationScheduleProps {
  schedule: AmortizationEntry[];
  inputs: MortgageInputs;
}

export function AmortizationSchedule({ schedule, inputs }: AmortizationScheduleProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Filter and paginate schedule
  const filteredSchedule = useMemo(() => {
    if (!searchTerm) return schedule;
    
    const term = searchTerm.toLowerCase();
    return schedule.filter(entry => 
      entry.date.toLowerCase().includes(term) ||
      formatCurrency(entry.paymentMortgageOnly, inputs.currency, inputs.locale).toLowerCase().includes(term) ||
      formatCurrency(entry.interest, inputs.currency, inputs.locale).toLowerCase().includes(term) ||
      formatCurrency(entry.principal, inputs.currency, inputs.locale).toLowerCase().includes(term) ||
      formatCurrency(entry.balance, inputs.currency, inputs.locale).toLowerCase().includes(term)
    );
  }, [schedule, searchTerm, inputs.currency, inputs.locale]);
  
  const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchedule = filteredSchedule.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };
  
  const exportToCSV = () => {
    const headers = [
      'Date',
      'Payment',
      'Interest',
      'Principal',
      'Extra Principal',
      'PMI',
      'Balance',
      'Cumulative Interest',
      'Cumulative Principal',
      'LTV %'
    ];
    
    const csvContent = [
      headers.join(','),
      ...schedule.map(entry => [
        entry.date,
        entry.paymentMortgageOnly.toFixed(2),
        entry.interest.toFixed(2),
        entry.principal.toFixed(2),
        entry.extraPrincipal.toFixed(2),
        entry.pmi.toFixed(2),
        entry.balance.toFixed(2),
        entry.cumulativeInterest.toFixed(2),
        entry.cumulativePrincipal.toFixed(2),
        entry.ltv.toFixed(2)
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `amortization-schedule-${inputs.startYearMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search schedule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
          />
          
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value={6}>6 per page</option>
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
            <option value={60}>60 per page</option>
            <option value={120}>120 per page</option>
          </select>
        </div>
        
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm font-medium"
        >
          📊 Export CSV
        </button>
      </div>
      
      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Interest
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Principal
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Extra
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                PMI
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                LTV
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentSchedule.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(entry.date).toLocaleDateString(inputs.locale, {
                    year: 'numeric',
                    month: 'short'
                  })}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                  {formatCurrency(entry.paymentMortgageOnly, inputs.currency, inputs.locale)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 text-right">
                  {formatCurrency(entry.interest, inputs.currency, inputs.locale)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 text-right">
                  {formatCurrency(entry.principal, inputs.currency, inputs.locale)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 text-right">
                  {entry.extraPrincipal > 0 ? formatCurrency(entry.extraPrincipal, inputs.currency, inputs.locale) : '-'}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-orange-600 dark:text-orange-400 text-right">
                  {entry.pmi > 0 ? formatCurrency(entry.pmi, inputs.currency, inputs.locale) : '-'}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right font-medium">
                  {formatCurrency(entry.balance, inputs.currency, inputs.locale)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                  {formatPercentage(entry.ltv, inputs.locale, 1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredSchedule.length)} of {filteredSchedule.length} entries
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      currentPage === totalPages
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}