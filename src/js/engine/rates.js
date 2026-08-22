/**
 * Rate conversion utilities.
 * Effective annual convention: annual = (1 + monthly)^12 - 1
 */

export function monthlyFromAnnual (annualRate) {
  return Math.pow(1 + annualRate, 1 / 12) - 1
}

export function annualFromMonthly (monthlyRate) {
  return Math.pow(1 + monthlyRate, 12) - 1
}
