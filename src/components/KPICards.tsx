import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calculator, PieChart, BarChart3, Target } from 'lucide-react';
import type { FinancialResults } from '../utils/calculations';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface KPICardsProps {
  results: FinancialResults;
}

const KPICards: React.FC<KPICardsProps> = ({ results }) => {
  const kpis = [
    {
      title: 'Annual Revenue',
      value: formatCurrency(results.annualRevenue),
      subtitle: 'Total Income',
      icon: DollarSign,
      color: 'primary',
      trend: results.annualRevenue > 0 ? 'up' : 'neutral',
    },
    {
      title: 'Annual COGS',
      value: formatCurrency(results.annualCogs),
      subtitle: 'Cost of Goods Sold',
      icon: Calculator,
      color: 'error',
      trend: 'neutral',
    },
    {
      title: 'Gross Margin',
      value: formatPercentage(results.grossMargin),
      subtitle: formatCurrency(results.grossProfit),
      icon: Percent,
      color: results.grossMargin > 20 ? 'success' : results.grossMargin > 10 ? 'warning' : 'error',
      trend: results.grossMargin > 20 ? 'up' : results.grossMargin > 10 ? 'neutral' : 'down',
    },
    {
      title: 'Contribution Margin',
      value: formatPercentage(results.contributionMarginPct),
      subtitle: formatCurrency(results.contributionMargin),
      icon: PieChart,
      color: results.contributionMarginPct > 25 ? 'success' : results.contributionMarginPct > 15 ? 'warning' : 'error',
      trend: results.contributionMarginPct > 25 ? 'up' : results.contributionMarginPct > 15 ? 'neutral' : 'down',
    },
    {
      title: 'Net Profit (PAT)',
      value: formatCurrency(results.netProfit),
      subtitle: `${formatPercentage(results.netProfitMargin)} Margin`,
      icon: Target,
      color: results.netProfit > 0 ? 'success' : 'error',
      trend: results.netProfit > 0 ? 'up' : 'down',
    },
    {
      title: 'EBITDA',
      value: formatCurrency(results.ebitda),
      subtitle: `${formatPercentage(results.ebitdaMargin)} Margin`,
      icon: BarChart3,
      color: results.ebitda > 0 ? 'success' : 'error',
      trend: results.ebitda > 0 ? 'up' : 'down',
    },
    {
      title: 'ROCE',
      value: formatPercentage(results.roce),
      subtitle: 'Return on Capital',
      icon: TrendingUp,
      color: results.roce > 15 ? 'success' : results.roce > 10 ? 'warning' : 'error',
      trend: results.roce > 15 ? 'up' : results.roce > 10 ? 'neutral' : 'down',
    },
    {
      title: 'ROE',
      value: formatPercentage(results.roe),
      subtitle: 'Return on Equity',
      icon: TrendingUp,
      color: results.roe > 20 ? 'success' : results.roe > 15 ? 'warning' : 'error',
      trend: results.roe > 20 ? 'up' : results.roe > 15 ? 'neutral' : 'down',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'from-primary-500 to-primary-600 text-white';
      case 'success':
        return 'from-success-500 to-success-600 text-white';
      case 'warning':
        return 'from-warning-500 to-warning-600 text-white';
      case 'error':
        return 'from-error-500 to-error-600 text-white';
      default:
        return 'from-gray-500 to-gray-600 text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-success-500" />;
      case 'down':
        return <TrendingDown size={16} className="text-error-500" />;
      default:
        return null;
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
          Key Performance Indicators
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Essential financial metrics and performance indicators
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="metric-card group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getColorClasses(kpi.color)} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <kpi.icon size={20} />
              </div>
              {getTrendIcon(kpi.trend)}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {kpi.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {kpi.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {kpi.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default KPICards;