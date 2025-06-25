import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { FinancialResults } from '../utils/calculations';
import { formatCurrency, formatCompactNumber } from '../utils/formatters';

interface BreakevenAnalysisProps {
  results: FinancialResults;
}

const BreakevenAnalysis: React.FC<BreakevenAnalysisProps> = ({ results }) => {
  const [selectedMetric, setSelectedMetric] = useState<'EBITDA' | 'Net Profit'>('EBITDA');

  // Calculate breakeven
  const rmCost = results.paddyRate;
  const totalVarCost = rmCost + results.totalVarCostPerKg;
  const pohaRev = results.pohaPrice * (results.paddyYield / 100);
  const byproductRev = results.byproductRateKg * Math.min(
    results.byproductSalePercent / 100,
    (100 - results.paddyYield) / 100
  );
  const revPerKg = pohaRev + byproductRev;
  const contributionPerKg = revPerKg - totalVarCost;

  const fixedCosts = selectedMetric === 'EBITDA' 
    ? results.annualFixedOpex
    : results.annualFixedOpex + results.annualDepreciation + results.totalInterest;

  const breakevenVol = contributionPerKg > 0 ? fixedCosts / contributionPerKg : 0;
  const breakevenRevenue = breakevenVol * revPerKg;

  // Generate chart data
  const maxVol = Math.max(results.annualPaddy, breakevenVol) * 1.5;
  const dataPoints = 50;
  const stepSize = maxVol / dataPoints;

  const chartData = Array.from({ length: dataPoints + 1 }, (_, i) => {
    const volume = i * stepSize;
    const revenue = volume * revPerKg;
    const totalCosts = fixedCosts + (volume * totalVarCost);
    
    return {
      volume: Math.round(volume),
      revenue: Math.round(revenue),
      costs: Math.round(totalCosts),
      profit: Math.round(revenue - totalCosts),
    };
  });

  return (
    <section id="analytics">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Breakeven Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Determine the minimum production volume required to achieve profitability
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Metric Selector */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Breakeven Metric
            </h3>
            <div className="flex space-x-2">
              {(['EBITDA', 'Net Profit'] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedMetric === metric
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>

          {/* Breakeven Metrics */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Breakeven Metrics ({selectedMetric})
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Breakeven Volume</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(breakevenVol)} kg/year
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Breakeven Revenue</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(breakevenRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Current Volume</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(results.annualPaddy)} kg/year
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">Volume vs Breakeven</span>
                <span className={`font-semibold ${
                  results.annualPaddy > breakevenVol ? 'text-success-600' : 'text-error-600'
                }`}>
                  {results.annualPaddy > breakevenVol ? 'Above' : 'Below'} Breakeven
                </span>
              </div>
            </div>
          </div>

          {/* Calculation Details */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Calculation Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Fixed Costs to Cover: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(fixedCosts)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Revenue per kg Paddy: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(revPerKg)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Variable Cost per kg: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(totalVarCost)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Contribution per kg: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(contributionPerKg)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Breakeven Chart
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="volume" 
                  tickFormatter={(value) => formatCompactNumber(value).replace('₹', '')}
                  className="text-xs"
                />
                <YAxis 
                  tickFormatter={(value) => formatCompactNumber(value)}
                  className="text-xs"
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'revenue' ? 'Revenue' : name === 'costs' ? 'Total Costs' : 'Profit'
                  ]}
                  labelFormatter={(value) => `Volume: ${formatCurrency(value)} kg`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  dot={false}
                  name="revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="costs" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={false}
                  name="costs"
                />
                {breakevenVol > 0 && breakevenVol < maxVol && (
                  <ReferenceLine 
                    x={breakevenVol} 
                    stroke="#f59e0b" 
                    strokeDasharray="5 5"
                    label={{ value: "Breakeven", position: "top" }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BreakevenAnalysis;