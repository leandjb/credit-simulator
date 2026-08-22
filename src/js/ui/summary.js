/**
 * KPI summary cards.
 * Displays installment, payoff, equilibrium, and total interest.
 */

import { formatCurrency } from '../engine/format.js'

export function initSummary (store, container) {
  function render (state) {
    const { result, currency } = state
    if (!result || !result.ok) return

    const { summary, equilibrium } = result

    const installmentEl = container.querySelector('#kpi-installment-value')
    const payoffEl = container.querySelector('#kpi-payoff-value')
    const equilibriumEl = container.querySelector('#kpi-equilibrium-value')
    const interestEl = container.querySelector('#kpi-interest-value')

    if (installmentEl) {
      installmentEl.textContent = formatCurrency(summary.installment, currency)
    }

    if (payoffEl) {
      if (summary.monthsSaved > 0) {
        payoffEl.textContent = `${summary.realPayoffMonth} of ${summary.nominalTerm} — ${summary.monthsSaved} saved`
      } else {
        payoffEl.textContent = `${summary.realPayoffMonth} months`
      }
    }

    if (equilibriumEl) {
      if (equilibrium) {
        equilibriumEl.textContent = `Month ${equilibrium.month}`
      } else {
        equilibriumEl.textContent = '—'
      }
    }

    if (interestEl) {
      interestEl.textContent = formatCurrency(summary.totalInterest, currency)
    }
  }

  store.subscribe(render)
  render(store.getState())
}
