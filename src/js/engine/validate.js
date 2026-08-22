/**
 * Input validation for the credit simulator.
 * Returns { ok: true } or { ok: false, errors: [{ field, message }] }
 */

export function validate (params) {
  const errors = []

  if (params.amount == null || params.amount <= 0) {
    errors.push({ field: 'amount', message: 'Loan amount must be greater than zero' })
  }

  if (params.term == null || !Number.isInteger(params.term) || params.term < 1 || params.term > 360) {
    errors.push({ field: 'term', message: 'Term must be an integer between 1 and 360 months' })
  }

  if (params.monthlyRate == null || params.monthlyRate < 0 || params.monthlyRate > 0.10) {
    errors.push({ field: 'monthlyRate', message: 'Monthly interest rate must be between 0% and 10%' })
  }

  if (params.persons == null || !Array.isArray(params.persons) || params.persons.length < 1 || params.persons.length > 6) {
    errors.push({ field: 'persons', message: 'Number of persons must be between 1 and 6' })
  } else {
    const totalPercentage = params.persons.reduce((sum, p) => sum + (p.percentage || 0), 0)
    if (Math.abs(totalPercentage - 100) > 0.01) {
      errors.push({ field: 'persons', message: `Percentages must sum to 100% (currently ${totalPercentage.toFixed(1)}%)` })
    }

    for (let i = 0; i < params.persons.length; i++) {
      const person = params.persons[i]
      if (person.extra != null && person.extra < 0) {
        errors.push({ field: `persons[${i}].extra`, message: `Extra payment for person ${i + 1} must be non-negative` })
      }
    }
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors }
}
