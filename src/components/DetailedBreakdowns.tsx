import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Calculator, DollarSign, TrendingUp, PieChart } from 'lucide-react';
import type { FinancialResults } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

interface DetailedBreakdownsProps {
  results: FinancialResults;
}

const DetailedBreakdowns: React.FC<DetailedBreakdownsProps> = ({ results }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const breakdownSections = [
    {
      id: 'revenue',
      title: 'Revenue Calculation (Annual)',
      icon: DollarSign,
      color: 'primary',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Total revenue is the sum of income from selling the primary product (Poha) and any byproducts.
          </p>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Poha Revenue:</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                <li>
                  <strong>Calculation:</strong> Annual Poha Production ({formatCurrency(results.annualPoha)} kg) × 
                  Poha Price per kg ({formatCurrency(results.pohaPrice)}) = <strong className="text-primary-600">{formatCurrency(results.annualPohaRevenue)}</strong>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Byproduct Revenue:</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                <li>
                  <strong>Calculation:</strong> Annual Byproduct Sold ({formatCurrency(results.annualByproductSold)} kg) × 
                  Byproduct Price per kg ({formatCurrency(results.byproductRateKg)}) = <strong className="text-primary-600">{formatCurrency(results.annualByproductRevenue)}</strong>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Final Calculation:</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                <li>
                  <strong>Total Annual Revenue:</strong> Poha Revenue ({formatCurrency(results.annualPohaRevenue)}) + 
                  Byproduct Revenue ({formatCurrency(results.annualByproductRevenue)}) = <strong className="text-success-600 text-lg">{formatCurrency(results.annualRevenue)}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'working-capital',
      title: 'Working Capital Calculation',
      icon: Calculator,
      color: 'secondary',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Working capital is the cash needed to fund day-to-day operations. It's calculated by subtracting operating current liabilities from operating current assets.
          </p>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Calculate Current Assets (Money tied up in operations):</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                <li><strong>Raw Material Inventory:</strong> Daily COGS ({formatCurrency(results.dailyCogs)}) × {results.rmInventoryDays} days = <strong>{formatCurrency(results.rmInventory)}</strong></li>
                <li><strong>Finished Goods Inventory:</strong> Daily Production Cost ({formatCurrency(results.dailyProdCost)}) × {results.fgInventoryDays} days = <strong>{formatCurrency(results.fgInventory)}</strong></li>
                <li><strong>Accounts Receivable:</strong> Daily Revenue ({formatCurrency(results.dailyRev)}) × {results.debtorDays} days = <strong>{formatCurrency(results.receivables)}</strong></li>
                <li><strong>Total Current Assets:</strong> {formatCurrency(results.rmInventory)} + {formatCurrency(results.fgInventory)} + {formatCurrency(results.receivables)} = <strong className="text-primary-600">{formatCurrency(results.currentAssets)}</strong></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Calculate Current Liabilities (Credit received from suppliers):</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                <li><strong>Accounts Payable:</strong> Daily COGS ({formatCurrency(results.dailyCogs)}) × {results.creditorDays} days = <strong>{formatCurrency(results.payables)}</strong></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Final Calculation:</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                <li><strong>Net Working Capital (NWC):</strong> Total Current Assets ({formatCurrency(results.currentAssets)}) - Accounts Payable ({formatCurrency(results.payables)}) = <strong className="text-success-600 text-lg">{formatCurrency(results.netWorkingCapital)}</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'interest',
      title: 'Interest Cost Calculation (Annual)',
      icon: TrendingUp,
      color: 'warning',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Interest is calculated on both the term loan for capital assets (CAPEX) and the loan required for working capital.
          </p>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Interest on Term Loan (CAPEX Loan):</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                <li><strong>Total Debt:</strong> Total CAPEX ({formatCurrency(results.totalCapex)}) × (100% - {results.equityContrib}% Equity) = <strong>{formatCurrency(results.debt)}</strong></li>
                <li><strong>Interest on Debt:</strong> {formatCurrency(results.debt)} × {results.interestRate}% = <strong>{formatCurrency(results.interestFixed)}</strong></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Interest on Working Capital Loan:</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                <li><strong>Interest on NWC:</strong> Net Working Capital ({formatCurrency(results.netWorkingCapital)}) × {results.interestRate}% = <strong>{formatCurrency(results.interestWc)}</strong></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Final Calculation:</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                <li><strong>Total Annual Interest:</strong> Interest on Debt ({formatCurrency(results.interestFixed)}) + Interest on NWC ({formatCurrency(results.interestWc)}) = <strong className="text-error-600 text-lg">{formatCurrency(results.totalInterest)}</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'roce',
      title: 'Return on Capital Employed (ROCE) Calculation',
      icon: PieChart,
      color: 'success',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            ROCE measures how efficiently a company is using its capital to generate profits.
          </p>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Calculate Capital Employed:</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                <li><strong>Total CAPEX:</strong> Sum of Land, Civil, and Machinery costs = <strong>{formatCurrency(results.totalCapex)}</strong></li>
                <li><strong>Net Working Capital (NWC):</strong> (Calculated above) = <strong>{formatCurrency(results.netWorkingCapital)}</strong></li>
                <li><strong>Total Capital Employed:</strong> Total CAPEX ({formatCurrency(results.totalCapex)}) + NWC ({formatCurrency(results.netWorkingCapital)}) = <strong className="text-primary-600">{formatCurrency(results.capitalEmployed)}</strong></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Calculate EBIT (Earnings Before Interest & Tax):</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                <li><strong>EBIT:</strong> (See P&L Statement) = <strong>{formatCurrency(results.ebit)}</strong></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Final Calculation:</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-4">
                <li><strong>ROCE:</strong> (EBIT / Capital Employed) × 100 = ({formatCurrency(results.ebit)} / {formatCurrency(results.capitalEmployed)}) × 100 = <strong className="text-success-600 text-lg">{results.roce.toFixed(2)}%</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'text-primary-600 bg-primary-100 dark:bg-primary-900/20';
      case 'secondary':
        return 'text-secondary-600 bg-secondary-100 dark:bg-secondary-900/20';
      case 'success':
        return 'text-success-600 bg-success-100 dark:bg-success-900/20';
      case 'warning':
        return 'text-warning-600 bg-warning-100 dark:bg-warning-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Detailed Calculation Breakdowns
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Step-by-step explanations of key financial calculations
        </p>
      </motion.div>

      <div className="space-y-4">
        {breakdownSections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${getColorClasses(section.color)} flex items-center justify-center`}>
                  <section.icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h3>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has(section.id) ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={20} className="text-gray-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSections.has(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="pt-4">
                      {section.content}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default DetailedBreakdowns;