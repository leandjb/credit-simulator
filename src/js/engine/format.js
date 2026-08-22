/**
 * Currency formatting utilities.
 * Uses Intl.NumberFormat for locale-aware formatting.
 */

const formatters = {
  USD: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }),
  COP: new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

export function formatCurrency (amount, currency = 'USD') {
  const formatter = formatters[currency] || formatters.USD
  return formatter.format(amount)
}

export function formatNumber (n, decimals = 2) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(n)
}

export function formatPercent (n, decimals = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(n)
}
