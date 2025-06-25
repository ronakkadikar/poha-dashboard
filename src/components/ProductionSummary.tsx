import React from 'react';
import { motion } from 'framer-motion';
import type { FinancialResults } from '../utils/calculations';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface ProductionSummaryProps {
  results: FinancialResults;
}

const ProductionSummary: React.FC<ProductionSummaryProps> = ({ results }) => {
  const summaryData = [
    {
      metric: 'Paddy Consumption (kg)',
      daily: formatNumber(results.dailyPaddy),
      monthly: formatNumber(results.dailyPaddy * results.daysPerMonth),
      annual: formatNumber(results.annualPaddy),
    },
    {
      metric: 'Poha Production (kg)',
      daily: formatNumber(results.annualPoha / (results.daysPerMonth * 12)),
      monthly: formatNumber(results.annualPoha / 12),
      annual: formatNumber(results.annualPoha),
    },
    {
      metric: 'Byproduct Generated (kg)',
      daily: formatNumber(results.dailyByproductGen),
      monthly: formatNumber(results.dailyByproductGen * results.daysPerMonth),
      annual: formatNumber(results.dailyByproductGen * results.daysPerMonth * 12),
    },
    {
      metric: 'Byproduct Sold (kg)',
      daily: formatNumber(results.dailyByproductSold),
      monthly: formatNumber(results.dailyByproductSold * results.daysPerMonth),
      annual: formatNumber(results.annualByproductSold),
    },
    {
      metric: 'Total Revenue',
      daily: formatCurrency(results.annualRevenue / 365),
      monthly: formatCurrency(results.annualRevenue / 12),
      annual: formatCurrency(results.annualRevenue),
    },
    {
      metric: 'COGS',
      daily: formatCurrency(results.annualCogs / 365),
      monthly: formatCurrency(results.annualCogs / 12),
      annual: formatCurrency(results.annualCogs),
    },
    {
      metric: 'Gross Profit',
      daily: formatCurrency(results.grossProfit / 365),
      monthly: formatCurrency(results.grossProfit / 12),
      annual: formatCurrency(results.grossProfit),
    },
  ];

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Production & Financial Summary
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive overview of production volumes and financial performance
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Metric
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  Daily
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  Monthly
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                  Annual
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {summaryData.map((row, index) => (
                <motion.tr
                  key={row.metric}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {row.metric}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-right font-mono">
                    {row.daily}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-right font-mono">
                    {row.monthly}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right font-mono font-semibold">
                    {row.annual}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
};

export default ProductionSummary;