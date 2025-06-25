import React, { createContext, useContext, useState, useCallback } from 'react';
import { calculateFinancials, type FinancialInputs, type FinancialResults } from '../utils/calculations';
import { getDefaultInputs } from '../utils/defaultValues';

interface CalculationContextType {
  inputs: FinancialInputs;
  results: FinancialResults | null;
  updateInputs: (newInputs: Partial<FinancialInputs>) => void;
  resetToDefaults: () => void;
  isCalculating: boolean;
}

const CalculationContext = createContext<CalculationContextType | undefined>(undefined);

export function CalculationProvider({ children }: { children: React.ReactNode }) {
  const [inputs, setInputs] = useState<FinancialInputs>(getDefaultInputs());
  const [results, setResults] = useState<FinancialResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const updateInputs = useCallback((newInputs: Partial<FinancialInputs>) => {
    setIsCalculating(true);
    
    const updatedInputs = { ...inputs, ...newInputs };
    setInputs(updatedInputs);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const calculatedResults = calculateFinancials(updatedInputs);
      setResults(calculatedResults);
      setIsCalculating(false);
    }, 100);
  }, [inputs]);

  const resetToDefaults = useCallback(() => {
    const defaultInputs = getDefaultInputs();
    setInputs(defaultInputs);
    const calculatedResults = calculateFinancials(defaultInputs);
    setResults(calculatedResults);
  }, []);

  // Calculate initial results
  React.useEffect(() => {
    const calculatedResults = calculateFinancials(inputs);
    setResults(calculatedResults);
  }, []);

  return (
    <CalculationContext.Provider value={{
      inputs,
      results,
      updateInputs,
      resetToDefaults,
      isCalculating
    }}>
      {children}
    </CalculationContext.Provider>
  );
}

export function useCalculation() {
  const context = useContext(CalculationContext);
  if (context === undefined) {
    throw new Error('useCalculation must be used within a CalculationProvider');
  }
  return context;
}