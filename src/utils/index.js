/**
 * @function formartCurrency
 * Format number as currency
 * 
 * @param  {number} amount
 * @returns {string} number formatted currency with {2} minimumFractionDigits
 * 
 * @example
 * formatCurrency(2)
 * // => $0.00
 */
export const formartCurrency = amount => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}
