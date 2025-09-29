import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { AmortizationEntry, MortgageInputs } from '../types';
import { formatCurrency } from '../utils/mortgageCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MortgageChartsProps {
  schedule: AmortizationEntry[];
  inputs: MortgageInputs;
}

export function MortgageCharts({ schedule, inputs }: MortgageChartsProps) {
  // Prepare data for balance over time chart
  const balanceOverTimeData = useMemo(() => {
    const labels = schedule.map((entry) => {
      const date = new Date(entry.date);
      return `${date.toLocaleDateString(inputs.locale, { month: 'short' })} ${date.getFullYear()}`;
    });
    
    const balanceData = schedule.map(entry => entry.balance);
    
    return {
      labels,
      datasets: [
        {
          label: 'Remaining Balance',
          data: balanceData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.1
        }
      ]
    };
  }, [schedule, inputs.locale]);

  // Prepare data for principal vs interest chart (yearly)
  const principalVsInterestData = useMemo(() => {
    const yearlyData: { [year: number]: { principal: number; interest: number } } = {};
    
    schedule.forEach(entry => {
      const year = new Date(entry.date).getFullYear();
      if (!yearlyData[year]) {
        yearlyData[year] = { principal: 0, interest: 0 };
      }
      yearlyData[year].principal += entry.principal;
      yearlyData[year].interest += entry.interest;
    });
    
    const years = Object.keys(yearlyData).map(Number).sort();
    const labels = years.map(year => year.toString());
    const principalData = years.map(year => yearlyData[year].principal);
    const interestData = years.map(year => yearlyData[year].interest);
    
    return {
      labels,
      datasets: [
        {
          label: 'Principal',
          data: principalData,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1
        },
        {
          label: 'Interest',
          data: interestData,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1
        }
      ]
    };
  }, [schedule]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${formatCurrency(value, inputs.currency, inputs.locale)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value, inputs.currency, inputs.locale);
          }
        }
      }
    }
  };

  const balanceChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Remaining Balance Over Time'
      }
    }
  };

  const principalInterestChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Principal vs Interest by Year'
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Balance Over Time Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="h-80">
          <Line data={balanceOverTimeData} options={balanceChartOptions} />
        </div>
      </div>

      {/* Principal vs Interest Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="h-80">
          <Bar data={principalVsInterestData} options={principalInterestChartOptions} />
        </div>
      </div>

      {/* Chart Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Balance Reduction
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Your balance will decrease from {formatCurrency(schedule[0]?.balance || 0, inputs.currency, inputs.locale)} 
            to {formatCurrency(schedule[schedule.length - 1]?.balance || 0, inputs.currency, inputs.locale)} 
            over {schedule.length} months.
          </p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
            Principal vs Interest
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            You'll pay {formatCurrency(schedule.reduce((sum, entry) => sum + entry.principal, 0), inputs.currency, inputs.locale)} 
            in principal and {formatCurrency(schedule.reduce((sum, entry) => sum + entry.interest, 0), inputs.currency, inputs.locale)} 
            in interest over the life of the loan.
          </p>
        </div>
      </div>
    </div>
  );
}