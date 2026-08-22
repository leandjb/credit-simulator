/* eslint-env jest */
import { simulate } from '../src/js/engine/simulation.js'

const baseParams = {
  amount: 100000,
  term: 12,
  monthlyRate: 0.01,
  persons: [
    { name: 'Ana', percentage: 50, extra: 0 },
    { name: 'Luis', percentage: 50, extra: 0 }
  ]
}

describe('simulate', () => {
  describe('standard schedule', () => {
    test('produces correct number of rows', () => {
      const result = simulate(baseParams)
      expect(result.ok).toBe(true)
      expect(result.schedule).toHaveLength(12)
    })

    test('each installment is equal (to the cent)', () => {
      const result = simulate(baseParams)
      const installments = result.schedule.map(r => r.installment)
      const first = installments[0]
      // All months except the last (which absorbs rounding) should be equal
      installments.slice(0, -1).forEach(inst => {
        expect(inst).toBeCloseTo(first, 2)
      })
    })

    test('final balance is 0', () => {
      const result = simulate(baseParams)
      expect(result.schedule[result.schedule.length - 1].balance).toBe(0)
    })

    test('interest + principal equals installment each month', () => {
      const result = simulate(baseParams)
      result.schedule.forEach(row => {
        expect(row.interest + row.principal).toBeCloseTo(row.installment, 2)
      })
    })

    test('interest declines each month', () => {
      const result = simulate(baseParams)
      for (let i = 1; i < result.schedule.length; i++) {
        expect(result.schedule[i].interest).toBeLessThan(result.schedule[i - 1].interest)
      }
    })
  })

  describe('zero interest rate', () => {
    test('installment equals amount / term', () => {
      const result = simulate({ ...baseParams, monthlyRate: 0 })
      expect(result.ok).toBe(true)
      expect(result.summary.installment).toBeCloseTo(100000 / 12, 2)
    })

    test('no interest portion', () => {
      const result = simulate({ ...baseParams, monthlyRate: 0 })
      result.schedule.forEach(row => {
        expect(row.interest).toBe(0)
      })
    })

    test('schedule completes at term', () => {
      const result = simulate({ ...baseParams, monthlyRate: 0 })
      expect(result.schedule).toHaveLength(12)
      expect(result.schedule[11].balance).toBe(0)
    })
  })

  describe('per-person split', () => {
    test('splits installment by percentage', () => {
      const result = simulate(baseParams)
      const row = result.schedule[0]
      expect(row.persons[0].share).toBeCloseTo(row.installment * 0.5, 2)
      expect(row.persons[1].share).toBeCloseTo(row.installment * 0.5, 2)
    })

    test('handles uneven split', () => {
      const result = simulate({
        ...baseParams,
        persons: [
          { name: 'Ana', percentage: 60, extra: 0 },
          { name: 'Luis', percentage: 40, extra: 0 }
        ]
      })
      expect(result.ok).toBe(true)
      const row = result.schedule[0]
      expect(row.persons[0].share).toBeCloseTo(row.installment * 0.6, 2)
      expect(row.persons[1].share).toBeCloseTo(row.installment * 0.4, 2)
    })
  })

  describe('extra payments', () => {
    test('shortens the term', () => {
      const result = simulate({
        ...baseParams,
        term: 60,
        persons: [
          { name: 'Ana', percentage: 50, extra: 500 },
          { name: 'Luis', percentage: 50, extra: 500 }
        ]
      })
      expect(result.ok).toBe(true)
      expect(result.summary.realPayoffMonth).toBeLessThan(60)
      expect(result.summary.monthsSaved).toBeGreaterThan(0)
    })

    test('final month is prorated', () => {
      const result = simulate({
        ...baseParams,
        term: 60,
        persons: [
          { name: 'Ana', percentage: 50, extra: 500 },
          { name: 'Luis', percentage: 50, extra: 500 }
        ]
      })
      expect(result.ok).toBe(true)
      const lastRow = result.schedule[result.schedule.length - 1]
      expect(lastRow.balance).toBe(0)
    })

    test('no negative balance', () => {
      const result = simulate({
        ...baseParams,
        term: 60,
        persons: [
          { name: 'Ana', percentage: 50, extra: 500 },
          { name: 'Luis', percentage: 50, extra: 500 }
        ]
      })
      result.schedule.forEach(row => {
        expect(row.balance).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('validation errors', () => {
    test('rejects invalid amount', () => {
      const result = simulate({ ...baseParams, amount: -1 })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('amount')
    })

    test('rejects invalid percentages', () => {
      const result = simulate({
        ...baseParams,
        persons: [
          { name: 'Ana', percentage: 60, extra: 0 },
          { name: 'Luis', percentage: 50, extra: 0 }
        ]
      })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('persons')
    })
  })

  describe('summary', () => {
    test('reports correct totals', () => {
      const result = simulate(baseParams)
      expect(result.summary.installment).toBeGreaterThan(0)
      expect(result.summary.totalPaid).toBeGreaterThan(baseParams.amount)
      expect(result.summary.totalInterest).toBeGreaterThan(0)
      expect(result.summary.realPayoffMonth).toBe(12)
      expect(result.summary.nominalTerm).toBe(12)
      expect(result.summary.monthsSaved).toBe(0)
    })

    test('reports months saved with extras', () => {
      const result = simulate({
        ...baseParams,
        term: 60,
        persons: [
          { name: 'Ana', percentage: 50, extra: 500 },
          { name: 'Luis', percentage: 50, extra: 500 }
        ]
      })
      expect(result.summary.monthsSaved).toBeGreaterThan(0)
      expect(result.summary.realPayoffMonth).toBeLessThan(60)
    })
  })

  describe('equilibrium', () => {
    test('exists for a standard schedule', () => {
      const result = simulate(baseParams)
      expect(result.equilibrium).not.toBeNull()
      expect(result.equilibrium.month).toBeGreaterThan(0)
      expect(result.equilibrium.month).toBeLessThanOrEqual(12)
    })

    test('cumulative paid >= balance at equilibrium', () => {
      const result = simulate(baseParams)
      const eq = result.equilibrium
      expect(eq.cumulativePaid).toBeGreaterThanOrEqual(eq.balance)
    })

    test('cumulative paid < balance before equilibrium', () => {
      const result = simulate(baseParams)
      const eq = result.equilibrium
      if (eq.month > 1) {
        const prev = result.schedule[eq.month - 2]
        const prevCumulative = result.schedule
          .slice(0, eq.month - 1)
          .reduce((sum, r) => sum + r.installment + r.extra, 0)
        expect(prevCumulative).toBeLessThan(prev.balance)
      }
    })

    test('equilibrium moves with extras', () => {
      const without = simulate({ ...baseParams, term: 60 })
      const withExtras = simulate({
        ...baseParams,
        term: 60,
        persons: [
          { name: 'Ana', percentage: 50, extra: 500 },
          { name: 'Luis', percentage: 50, extra: 500 }
        ]
      })
      expect(withExtras.equilibrium).not.toBeNull()
      expect(withExtras.equilibrium.month).toBeLessThan(without.equilibrium.month)
    })
  })
})
