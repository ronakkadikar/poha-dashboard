import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calculator, BarChart3, PieChart } from 'lucide-react';

const Hero = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Financial Modeling',
      description: 'Comprehensive financial calculations and projections'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Real-time KPIs and business metrics tracking'
    },
    {
      icon: BarChart3,
      title: 'Sensitivity Analysis',
      description: 'Impact analysis of key variables on profitability'
    },
    {
      icon: PieChart,
      title: 'Breakeven Analysis',
      description: 'Determine optimal production volumes and pricing'
    }
  ];

  return (
    <section className="pt-20 pb-16 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Poha Manufacturing
              </span>
              <br />
              <span className="text-3xl md:text-5xl">Financial Dashboard</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto text-balance">
              Comprehensive financial analysis and business intelligence platform for poha manufacturing operations. 
              Make data-driven decisions with real-time insights and advanced analytics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="card p-6 text-center hover:shadow-medium transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;