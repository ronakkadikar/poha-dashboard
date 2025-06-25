import type { FinancialInputs } from './calculations';

export function getDefaultInputs(): FinancialInputs {
  return {
    // Operational
    hoursPerDay: 10,
    daysPerMonth: 24,
    
    // Production
    paddyRateKgHr: 1000,
    paddyYield: 65.0,
    byproductSalePercent: 32.0,
    
    // Pricing
    paddyRate: 22.0,
    pohaPrice: 45.0,
    byproductRateKg: 7.0,
    
    // Capex
    landCost: 0,
    civilWorkCost: 0,
    machineryCost: 7000000,
    machineryUsefulLifeYears: 15,
    
    // Operating Costs
    packagingCost: 0.5,
    fuelCost: 0.0,
    otherVarCost: 0.0,
    rentPerMonth: 300000,
    laborPerMonth: 400000,
    electricityPerMonth: 150000,
    securitySscInsurancePerMonth: 300000,
    miscPerMonth: 300000,
    
    // Finance
    equityContrib: 30.0,
    interestRate: 9.0,
    taxRatePercent: 25.0,
    
    // Working Capital
    rmInventoryDays: 72,
    fgInventoryDays: 20,
    debtorDays: 45,
    creditorDays: 5,
  };
}