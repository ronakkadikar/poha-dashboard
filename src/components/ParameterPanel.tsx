import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { useCalculation } from '../contexts/CalculationContext';
import { useForm } from 'react-hook-form';
import type { FinancialInputs } from '../utils/calculations';

interface ParameterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({ isOpen, onClose }) => {
  const { inputs, updateInputs, resetToDefaults } = useCalculation();
  const { register, handleSubmit, reset, watch } = useForm<FinancialInputs>({
    defaultValues: inputs,
  });

  // Watch for changes and update calculations in real-time
  const watchedValues = watch();
  React.useEffect(() => {
    const subscription = watch((value) => {
      updateInputs(value as FinancialInputs);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateInputs]);

  const handleReset = () => {
    resetToDefaults();
    reset();
  };

  const parameterSections = [
    {
      title: 'Operational Parameters',
      fields: [
        { key: 'hoursPerDay', label: 'Production Hours/Day', type: 'number', min: 5, max: 24, step: 1 },
        { key: 'daysPerMonth', label: 'Operational Days/Month', type: 'number', min: 1, max: 31, step: 1 },
      ]
    },
    {
      title: 'Production Parameters',
      fields: [
        { key: 'paddyRateKgHr', label: 'Paddy Processing Rate (kg/hr)', type: 'number', min: 100, step: 10 },
        { key: 'paddyYield', label: 'Poha Yield (%)', type: 'number', min: 50, max: 80, step: 0.1 },
        { key: 'byproductSalePercent', label: 'Byproduct Sale (%)', type: 'number', min: 0, max: 40, step: 0.1 },
      ]
    },
    {
      title: 'Pricing Parameters',
      fields: [
        { key: 'paddyRate', label: 'Paddy Purchase Rate (₹/kg)', type: 'number', min: 0, step: 0.1 },
        { key: 'pohaPrice', label: 'Poha Selling Price (₹/kg)', type: 'number', min: 0, step: 0.1 },
        { key: 'byproductRateKg', label: 'Byproduct Selling Rate (₹/kg)', type: 'number', min: 0, step: 0.1 },
      ]
    },
    {
      title: 'Capital Expenditure',
      fields: [
        { key: 'landCost', label: 'Land Cost (₹)', type: 'number', min: 0, step: 10000 },
        { key: 'civilWorkCost', label: 'Civil Work Cost (₹)', type: 'number', min: 0, step: 10000 },
        { key: 'machineryCost', label: 'Machinery Cost (₹)', type: 'number', min: 0, step: 10000 },
        { key: 'machineryUsefulLifeYears', label: 'Useful Life (Years)', type: 'number', min: 1, max: 50, step: 1 },
      ]
    },
    {
      title: 'Operating Costs',
      fields: [
        { key: 'packagingCost', label: 'Packaging (₹/kg of paddy)', type: 'number', min: 0, step: 0.01 },
        { key: 'fuelCost', label: 'Fuel/Power (₹/kg of paddy)', type: 'number', min: 0, step: 0.01 },
        { key: 'otherVarCost', label: 'Other Variable (₹/kg of paddy)', type: 'number', min: 0, step: 0.01 },
        { key: 'rentPerMonth', label: 'Rent/Month (₹)', type: 'number', min: 0, step: 1000 },
        { key: 'laborPerMonth', label: 'Labor/Month (₹)', type: 'number', min: 0, step: 1000 },
        { key: 'electricityPerMonth', label: 'Electricity/Month (₹)', type: 'number', min: 0, step: 1000 },
        { key: 'securitySscInsurancePerMonth', label: 'Security & Insurance/Month (₹)', type: 'number', min: 0, step: 1000 },
        { key: 'miscPerMonth', label: 'Misc Overheads/Month (₹)', type: 'number', min: 0, step: 1000 },
      ]
    },
    {
      title: 'Finance Parameters',
      fields: [
        { key: 'equityContrib', label: 'Equity Contribution (%)', type: 'number', min: 0, max: 100, step: 0.1 },
        { key: 'interestRate', label: 'Interest Rate (%)', type: 'number', min: 0, max: 50, step: 0.01 },
        { key: 'taxRatePercent', label: 'Corporate Tax Rate (%)', type: 'number', min: 0, max: 50, step: 0.1 },
      ]
    },
    {
      title: 'Working Capital',
      fields: [
        { key: 'rmInventoryDays', label: 'RM Inventory Days', type: 'number', min: 0, max: 365, step: 1 },
        { key: 'fgInventoryDays', label: 'FG Inventory Days', type: 'number', min: 0, max: 365, step: 1 },
        { key: 'debtorDays', label: 'Debtor Days (Receivables)', type: 'number', min: 0, max: 365, step: 1 },
        { key: 'creditorDays', label: 'Creditor Days (Payables)', type: 'number', min: 0, max: 365, step: 1 },
      ]
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-900 shadow-strong z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Parameters
                </h2>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="btn-outline px-3 py-2 flex items-center space-x-2"
                  >
                    <RotateCcw size={16} />
                    <span>Reset</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {parameterSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    {section.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {section.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {field.label}
                        </label>
                        <input
                          {...register(field.key as keyof FinancialInputs, {
                            valueAsNumber: true,
                            min: field.min,
                            max: field.max,
                          })}
                          type={field.type}
                          step={field.step}
                          min={field.min}
                          max={field.max}
                          className="input"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ParameterPanel;