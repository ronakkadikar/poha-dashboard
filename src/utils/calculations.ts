export interface FinancialInputs {
  // Operational
  hoursPerDay: number;
  daysPerMonth: number;
  
  // Production
  paddyRateKgHr: number;
  paddyYield: number;
  byproductSalePercent: number;
  
  // Pricing
  paddyRate: number;
  pohaPrice: number;
  byproductRateKg: number;
  
  // Capex
  landCost: number;
  civilWorkCost: number;
  machineryCost: number;
  machineryUsefulLifeYears: number;
  
  // Operating Costs
  packagingCost: number;
  fuelCost: number;
  otherVarCost: number;
  rentPerMonth: number;
  laborPerMonth: number;
  electricityPerMonth: number;
  securitySscInsurancePerMonth: number;
  miscPerMonth: number;
  
  // Finance
  equityContrib: number;
  interestRate: number;
  taxRatePercent: number;
  
  // Working Capital
  rmInventoryDays: number;
  fgInventoryDays: number;
  debtorDays: number;
  creditorDays: number;
}

export interface FinancialResults extends FinancialInputs {
  // Production metrics
  totalCapex: number;
  dailyPaddy: number;
  annualPaddy: number;
  annualPoha: number;
  dailyByproductGen: number;
  dailyByproductSold: number;
  annualByproductSold: number;
  dailyByproductTarget: number;
  byproductLimitHit: boolean;
  
  // Revenue metrics
  annualRevenue: number;
  annualPohaRevenue: number;
  annualByproductRevenue: number;
  
  // Cost metrics
  annualCogs: number;
  grossProfit: number;
  annualVarCosts: number;
  annualFixedOpex: number;
  annualDepreciation: number;
  
  // Profitability metrics
  ebit: number;
  ebitda: number;
  ebt: number;
  netProfit: number;
  taxes: number;
  
  // Working capital metrics
  netWorkingCapital: number;
  rmInventory: number;
  fgInventory: number;
  receivables: number;
  payables: number;
  currentAssets: number;
  
  // Financial structure
  equity: number;
  debt: number;
  totalInterest: number;
  interestFixed: number;
  interestWc: number;
  capitalEmployed: number;
  totalAssets: number;
  
  // Ratios
  roce: number;
  roe: number;
  grossMargin: number;
  netProfitMargin: number;
  ebitdaMargin: number;
  contributionMargin: number;
  contributionMarginPct: number;
  
  // Per unit metrics
  totalVarCostPerKg: number;
  dailyCogs: number;
  dailyProdCost: number;
  dailyRev: number;
  
  // Validation
  error?: string;
}

export function calculateFinancials(inputs: FinancialInputs): FinancialResults {
  try {
    // Basic validations
    const totalCapex = inputs.landCost + inputs.civilWorkCost + inputs.machineryCost;
    
    if (inputs.paddyYield <= 0 || inputs.pohaPrice <= 0 || totalCapex <= 0) {
      return {
        ...inputs,
        error: 'Invalid inputs: Yield, Price, and Capex must be greater than 0',
      } as FinancialResults;
    }

    // Production calculations
    const dailyPaddy = inputs.paddyRateKgHr * inputs.hoursPerDay;
    const annualPaddy = dailyPaddy * inputs.daysPerMonth * 12;
    const annualPoha = annualPaddy * (inputs.paddyYield / 100);
    
    // Byproduct calculations
    const dailyByproductGen = dailyPaddy - (dailyPaddy * (inputs.paddyYield / 100));
    const dailyByproductTarget = dailyPaddy * (inputs.byproductSalePercent / 100);
    const dailyByproductSold = Math.min(dailyByproductTarget, dailyByproductGen);
    const annualByproductSold = dailyByproductSold * inputs.daysPerMonth * 12;
    const byproductLimitHit = dailyByproductTarget > dailyByproductGen;
    
    // Revenue calculations
    const annualPohaRevenue = annualPoha * inputs.pohaPrice;
    const annualByproductRevenue = annualByproductSold * inputs.byproductRateKg;
    const annualRevenue = annualPohaRevenue + annualByproductRevenue;
    
    // Cost calculations
    const annualCogs = annualPaddy * inputs.paddyRate;
    const grossProfit = annualRevenue - annualCogs;
    
    const varCostPerKg = inputs.packagingCost + inputs.fuelCost + inputs.otherVarCost;
    const annualVarCosts = annualPaddy * varCostPerKg;
    
    const annualFixedOpex = (
      inputs.rentPerMonth +
      inputs.laborPerMonth +
      inputs.electricityPerMonth +
      inputs.securitySscInsurancePerMonth +
      inputs.miscPerMonth
    ) * 12;
    
    const annualDepreciation = inputs.machineryUsefulLifeYears > 0 
      ? (inputs.machineryCost + inputs.civilWorkCost) / inputs.machineryUsefulLifeYears 
      : 0;
    
    const ebit = grossProfit - annualVarCosts - annualFixedOpex - annualDepreciation;
    const ebitda = ebit + annualDepreciation;
    
    // Working capital calculations
    const dailyCogs = annualCogs / 365;
    const dailyPohaProduction = annualPoha / (inputs.daysPerMonth * 12);
    const dailyProdCost = annualPoha > 0 ? (annualCogs + annualVarCosts) / annualPoha : 0;
    const dailyRev = annualRevenue / 365;
    
    const rmInventory = dailyCogs * inputs.rmInventoryDays;
    const fgInventory = (dailyPohaProduction * dailyProdCost) * inputs.fgInventoryDays;
    const receivables = dailyRev * inputs.debtorDays;
    const payables = dailyCogs * inputs.creditorDays;
    const currentAssets = rmInventory + fgInventory + receivables;
    
    // Financial structure
    const equity = totalCapex * (inputs.equityContrib / 100);
    const debt = totalCapex - equity;
    const netWorkingCapital = currentAssets - payables;
    
    // Interest calculations
    const interestFixed = debt * (inputs.interestRate / 100);
    const interestWc = Math.max(0, netWorkingCapital) * (inputs.interestRate / 100);
    const totalInterest = interestFixed + interestWc;
    
    // Final profitability
    const ebt = ebit - totalInterest;
    const taxes = Math.max(0, ebt) * (inputs.taxRatePercent / 100);
    const netProfit = ebt - taxes;
    
    // Capital metrics
    const capitalEmployed = totalCapex + netWorkingCapital;
    const totalAssets = totalCapex + currentAssets;
    
    // Ratios
    const roce = capitalEmployed !== 0 ? (ebit / capitalEmployed) * 100 : 0;
    const roe = equity > 0 ? (netProfit / equity) * 100 : 0;
    const grossMargin = annualRevenue > 0 ? (grossProfit / annualRevenue) * 100 : 0;
    const netProfitMargin = annualRevenue > 0 ? (netProfit / annualRevenue) * 100 : 0;
    const ebitdaMargin = annualRevenue > 0 ? (ebitda / annualRevenue) * 100 : 0;
    
    const contributionMargin = annualRevenue - annualCogs - annualVarCosts;
    const contributionMarginPct = annualRevenue > 0 ? (contributionMargin / annualRevenue) * 100 : 0;

    return {
      ...inputs,
      totalCapex,
      dailyPaddy,
      annualPaddy,
      annualPoha,
      dailyByproductGen,
      dailyByproductSold,
      annualByproductSold,
      dailyByproductTarget,
      byproductLimitHit,
      annualRevenue,
      annualPohaRevenue,
      annualByproductRevenue,
      annualCogs,
      grossProfit,
      annualVarCosts,
      annualFixedOpex,
      annualDepreciation,
      ebit,
      ebitda,
      ebt,
      netProfit,
      taxes,
      netWorkingCapital,
      rmInventory,
      fgInventory,
      receivables,
      payables,
      currentAssets,
      equity,
      debt,
      totalInterest,
      interestFixed,
      interestWc,
      capitalEmployed,
      totalAssets,
      roce,
      roe,
      grossMargin,
      netProfitMargin,
      ebitdaMargin,
      contributionMargin,
      contributionMarginPct,
      totalVarCostPerKg: varCostPerKg,
      dailyCogs,
      dailyProdCost,
      dailyRev,
    };
  } catch (error) {
    return {
      ...inputs,
      error: 'Calculation error occurred. Please check your inputs.',
    } as FinancialResults;
  }
}