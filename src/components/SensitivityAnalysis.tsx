import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCalculation } from '../contexts/CalculationContext';
import { calculateFinancials } from '../utils/calculations';
import { formatCurrency, formatNumber } from '../utils/formatters';

const SensitivityAnalysis: React.FC = () => {
  const { inputs } = useCalculation();
  const [selectedVariable, setSelectedVariable] = useState<string>('pohaPrice');
  const [sensitivityRange, setSensitivityRange] = useState<[number, number]>([-20, 20]);

  const variableOptions = [
    { key: 'pohaPrice', label: 'Poha Selling Price', unit: '₹/kg' },
    { key: 'paddyRate', label: 'Paddy Purchase Rate', unit: '₹/kg' },
    { key: 'paddyYield', label: 'Paddy to Poha Yield', unit: '%' },
    { key: 'interestRate', label: 'Interest Rate', unit: '%' },
    { key: 'paddyRateKgHr', label: 'Processing Rate', unit: 'kg/hr' },
    { key: 'byproductSalePercent', label: 'Byproduct Sale %', unit: '%' },
  ];

  const sensitivityData = useMemo(() => {
    const baseValue = inputs[selectedVariable as keyof typeof inputs] as number;
    const data = [];
    
    for (let i = sensitivityRange[0]; i <= sensitivityRange[1]; i += 2) {
      const multiplier = 1 + (i / 100);
      const newValue = baseValue * multiplier;
      const newInputs = { ...inputs, [selectedVariable]: newValue };
      const results = calculateFinancials(newInputs);
      
      data.push({
        change: i,
        value: newValue,
        netProfit: results.netProfit,
        ebitda: results.ebitda,
        roce: results.roce,
        revenue: results.annualRevenue,
      });
    }
    
    return data;
  }, [inputs, selectedVariable, sensitivityRange]);

  const currentVariable = variableOptions.find(v => v.key === selectedVariable);
  const baseValue = inputs[selectedVariable as keyof typeof inputs] as number;

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Sensitivity Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze the impact of key variables on business performance
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Analysis Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Variable to Analyze
                </label>
                <select
                  value={selectedVariable}
                  onChange={(e) => setSelectedVariable(e.target.value)}
                  className="input"
                >
                  {variableOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sensitivity Range (% change)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={sensitivityRange[0]}
                    onChange={(e) => setSensitivityRange([Number(e.target.value), sensitivityRange[1]])}
                    className="input"
                    placeholder="Min %"
                  />
                  <input
                    type="number"
                    value={sensitivityRange[1]}
                    onChange={(e) => setSensitivityRange([sensitivityRange[0], Number(e.target.value)])}
                    className="input"
                    placeholder="Max %"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Base Value:</strong> {formatNumber(baseValue, 2)} {currentVariable?.unit}</p>
                  <p><strong>Range:</strong> {formatNumber(baseValue * (1 + sensitivityRange[0]/100), 2)} to {formatNumber(baseValue * (1 + sensitivityRange[1]/100), 2)} {currentVariable?.unit}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Impact Summary
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sensitivityData.filter((_, i) => i % 2 === 0).map((point) => (
                <div key={point.change} className="flex justify-between items-center py-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {point.change > 0 ? '+' : ''}{point.change}%
                  </span>
                  <span className={`font-medium ${
                    point.netProfit > 0 ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {formatCurrency(point.netProfit)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Impact on Net Profit
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensitivityData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="change"
                  tickFormatter={(value) => `${value}%`}
                  className="text-xs"
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                  className="text-xs"
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'netProfit' ? 'Net Profit' : 
                    name === 'ebitda' ? 'EBITDA' : 
                    name === 'revenue' ? 'Revenue' : 'ROCE'
                  ]}
                  labelFormatter={(value) => `${value}% change`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="netProfit" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  name="netProfit"
                />
                <Line 
                  type="monotone" 
                  dataKey="ebitda" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  dot={false}
                  name="ebitda"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SensitivityAnalysis;