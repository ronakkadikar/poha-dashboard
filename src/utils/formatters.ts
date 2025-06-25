export function formatCurrency(amount: number): string {
  try {
    if (amount === 0) return '₹0.00';
    
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    
    // Format with Indian numbering system
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    let formatted = formatter.format(absAmount);
    
    // Remove the currency symbol and add our own
    formatted = formatted.replace('₹', '');
    formatted = `₹${isNegative ? '-' : ''}${formatted}`;
    
    return formatted;
  } catch {
    return 'N/A';
  }
}

export function formatNumber(num: number, decimals: number = 0): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch {
    return 'N/A';
  }
}

export function formatPercentage(num: number, decimals: number = 1): string {
  try {
    return `${num.toFixed(decimals)}%`;
  } catch {
    return 'N/A';
  }
}

export function formatCompactNumber(num: number): string {
  try {
    if (num >= 10000000) { // 1 crore
      return `₹${(num / 10000000).toFixed(1)}Cr`;
    } else if (num >= 100000) { // 1 lakh
      return `₹${(num / 100000).toFixed(1)}L`;
    } else if (num >= 1000) { // 1 thousand
      return `₹${(num / 1000).toFixed(1)}K`;
    } else {
      return formatCurrency(num);
    }
  } catch {
    return 'N/A';
  }
}