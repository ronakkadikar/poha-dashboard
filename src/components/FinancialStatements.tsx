import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, PieChart } from 'lucide-react';
import type { FinancialResults } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

interface FinancialStatementsProps {
  results: FinancialResults;
}

const FinancialStatements: React.FC<FinancialStatementsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState<'pnl' | 'balance'>('pnl');

  const pnlData = [
    { label: 'Total Revenue', amount: results.annualRevenue, isSubtotal: false },
    { label: 'COGS', amount: -results.annualCogs, isSubtotal: false },
    { label: 'Gross Profit', amount: results.grossProfit, isSubtotal: true },
    { label: 'Variable OpEx', amount: -results.annualVarCosts, isSubtotal: false },
    { label: 'Fixed OpEx', amount: -results.annualFixedOpex, isSubtotal: false },
    { label: 'Depreciation', amount: -results.annualDepreciation, isSubtotal: false },
    { label: 'EBIT', amount: results.ebit, isSubtotal: true },
    { label: 'Total Interest', amount: -results.totalInterest, isSubtotal: false },
    { label: 'EBT', amount: results.ebt, isSubtotal: true },
    { label: 'Taxes', amount: -results.taxes, isSubtotal: false },
    { label: 'Net Profit (PAT)', amount: results.netProfit, isSubtotal: true },
  ];

  const balanceSheetData = [
    { label: 'Assets', amount: null, isHeader: true },
    { label: 'Total Capex', amount: results.totalCapex, isSubtotal: false },
    { label: 'RM Inventory', amount: results.rmInventory, isSubtotal: false },
    { label: 'FG Inventory', amount: results.fgInventory, isSubtotal: false },
    { label: 'Receivables', amount: results.receivables, isSubtotal: false },
    { label: 'Total Assets', amount: results.totalAssets, isSubtotal: true },
    { label: '', amount: null, isHeader: false },
    { label: 'Liabilities & Equity', amount: null, isHeader: true },
    { label: 'Equity', amount: results.equity, isSubtotal: false },
    { label: 'Debt', amount: results.debt, isSubtotal: false },
    { label: 'Payables', amount: results.payables, isSubtotal: false },
    { label: 'Net Working Capital', amount: results.netWorkingCapital, isSubtotal: true },
    { label: 'Capital Employed', amount: results.capitalEmployed, isSubtotal: true },
  ];

  const tabs = [
    { id: 'pnl', label: 'P&L Statement', icon: FileText },
    { id: 'balance', label: 'Balance Sheet', icon: PieChart },
  ];

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Financial Statements
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive financial position and performance analysis
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card overflow-hidden"
      >
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'pnl' | 'balance')}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'pnl' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Profit & Loss Statement (Annual)
              </h3>
              {pnlData.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex justify-between items-center py-2 ${
                    item.isSubtotal 
                      ? 'border-t border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className={item.isSubtotal ? 'font-semibold' : ''}>
                    {item.label}
                  </span>
                  <span className={`font-mono ${
                    item.isSubtotal ? 'font-bold text-lg' : ''
                  } ${
                    item.amount < 0 ? 'text-error-600' : 
                    item.amount > 0 ? 'text-success-600' : 
                    'text-gray-900 dark:text-white'
                  }`}>
                    {item.amount < 0 ? `(${formatCurrency(Math.abs(item.amount))})` : formatCurrency(item.amount)}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'balance' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Balance Sheet
              </h3>
              {balanceSheetData.map((item, index) => (
                <motion.div
                  key={`${item.label}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex justify-between items-center py-2 ${
                    item.isHeader 
                      ? 'font-bold text-gray-900 dark:text-white text-lg border-b border-gray-300 dark:border-gray-600 mb-2' 
                      : item.isSubtotal 
                        ? 'border-t border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white' 
                        : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className={item.isSubtotal || item.isHeader ? 'font-semibold' : ''}>
                    {item.label}
                  </span>
                  {item.amount !== null && (
                    <span className={`font-mono ${
                      item.isSubtotal || item.isHeader ? 'font-bold text-lg text-gray-900 dark:text-white' : ''
                    }`}>
                      {item.amount < 0 ? `(${formatCurrency(Math.abs(item.amount))})` : formatCurrency(item.amount)}
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default FinancialStatements;