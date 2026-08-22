/**
 * Price (French) amortization engine.
 * Generates monthly schedule with per-person split and extra payments.
 */

import { validate } from './validate.js'

const MAX_ITERATIONS = 360

function roundCents (n) {
  return Math.round(n * 100) / 100
}

export function simulate (params) {
  const validation = validate(params)
  if (!validation.ok) {
    return { ok: false, errors: validation.errors }
  }

  const { amount, term, monthlyRate, persons } = params
  const installment = roundCents(computeInstallment(amount, monthlyRate, term))
  const schedule = []
  let balance = amount
  let cumulativePaid = 0
  let totalInterest = 0
  let realPayoffMonth = null
  let equilibrium = null

  const maxMonth = Math.min(term, MAX_ITERATIONS)

  for (let month = 1; month <= maxMonth; month++) {
    if (balance <= 0) break

    const interest = roundCents(monthlyRate * balance)
    let principal = roundCents(installment - interest)
    let extra = persons.reduce((sum, p) => sum + (p.extra || 0), 0)

    // Final month or proration: absorb rounding to zero out balance
    if (month === maxMonth || principal + extra >= balance) {
      principal = balance
      extra = 0
    }

    const actualInstallment = roundCents(interest + principal)
    balance = roundCents(Math.max(0, balance - principal - extra))
    cumulativePaid = roundCents(cumulativePaid + actualInstallment + extra)
    totalInterest = roundCents(totalInterest + interest)

    const row = {
      month,
      installment: actualInstallment,
      interest,
      principal,
      extra,
      balance,
      persons: persons.map(p => ({
        name: p.name,
        share: roundCents((actualInstallment * p.percentage) / 100),
        extra: p.extra || 0
      }))
    }

    schedule.push(row)

    if (balance <= 0 && realPayoffMonth === null) {
      realPayoffMonth = month
    }

    if (equilibrium === null && cumulativePaid >= balance) {
      equilibrium = { month, cumulativePaid, balance }
    }
  }

  if (realPayoffMonth === null) {
    realPayoffMonth = schedule.length
  }

  const summary = {
    installment,
    totalPaid: cumulativePaid,
    totalInterest,
    realPayoffMonth,
    nominalTerm: term,
    monthsSaved: Math.max(0, term - realPayoffMonth)
  }

  return { ok: true, schedule, summary, equilibrium }
}

function computeInstallment (principal, monthlyRate, term) {
  if (monthlyRate === 0) {
    return principal / term
  }
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term))
}
