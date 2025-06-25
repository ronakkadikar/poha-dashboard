import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { useCalculation } from '../contexts/CalculationContext';
import ParameterPanel from './ParameterPanel';
import KPICards from './KPICards';
import ProductionSummary from './ProductionSummary';
import BreakevenAnalysis from './BreakevenAnalysis';
import SensitivityAnalysis from './SensitivityAnalysis';
import FinancialStatements from './FinancialStatements';
import DetailedBreakdowns from './DetailedBreakdowns';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [showParameters, setShowParameters] = useState(false);
  const { results, resetToDefaults, isCalculating } = useCalculation();

  const handleExportData = () => {
    if (!results) return;
    
    try {
      const dataStr = JSON.stringify(results, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `poha-manufacturing-analysis-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleReset = () => {
    resetToDefaults();
    toast.success('Parameters reset to defaults');
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading calculations...</p>
        </div>
      </div>
    );
  }

  if (results.error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 text-center max-w-md"
        >
          <AlertTriangle className="w-16 h-16 text-error-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Calculation Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {results.error}
          </p>
          <button
            onClick={() => setShowParameters(true)}
            className="btn-primary px-6 py-2"
          >
            Adjust Parameters
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="dashboard" className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Manufacturing Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time financial analysis and business insights
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowParameters(true)}
              className="btn-outline px-4 py-2 flex items-center space-x-2"
            >
              <Settings size={16} />
              <span>Parameters</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportData}
              className="btn-secondary px-4 py-2 flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="btn-outline px-4 py-2 flex items-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Reset</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Byproduct Warning */}
        {results.byproductLimitHit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-warning-600 dark:text-warning-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-warning-800 dark:text-warning-200">
                  Byproduct Constraint Warning
                </h3>
                <p className="text-sm text-warning-700 dark:text-warning-300 mt-1">
                  Trying to sell {results.byproductSalePercent.toFixed(1)}% ({results.dailyByproductTarget.toLocaleString()} kg/day) 
                  but only {results.dailyByproductGen.toLocaleString()} kg/day is generated. 
                  Consider reducing the 'Byproduct Sale %' parameter.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading Overlay */}
        {isCalculating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-strong">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <span className="text-gray-700 dark:text-gray-300">Recalculating...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          <KPICards results={results} />
          <ProductionSummary results={results} />
          <BreakevenAnalysis results={results} />
          <SensitivityAnalysis />
          <FinancialStatements results={results} />
          <DetailedBreakdowns results={results} />
        </div>

        {/* Parameter Panel */}
        <ParameterPanel 
          isOpen={showParameters} 
          onClose={() => setShowParameters(false)} 
        />
      </div>
    </div>
  );
};

export default Dashboard;