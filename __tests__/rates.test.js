/* eslint-env jest */
import { monthlyFromAnnual, annualFromMonthly } from '../src/js/engine/rates.js'

describe('rates', () => {
  describe('monthlyFromAnnual', () => {
    test('converts 12.68% annual to ~1% monthly', () => {
      const annual = 0.1268
      const monthly = monthlyFromAnnual(annual)
      expect(monthly).toBeCloseTo(0.01, 4)
    })

    test('returns 0 for 0% annual', () => {
      expect(monthlyFromAnnual(0)).toBe(0)
    })

    test('handles high rates', () => {
      const monthly = monthlyFromAnnual(1.0)
      expect(monthly).toBeGreaterThan(0)
      expect(monthly).toBeLessThan(1)
    })
  })

  describe('annualFromMonthly', () => {
    test('converts 1% monthly to ~12.68% annual', () => {
      const monthly = 0.01
      const annual = annualFromMonthly(monthly)
      expect(annual).toBeCloseTo(0.1268, 3)
    })

    test('returns 0 for 0% monthly', () => {
      expect(annualFromMonthly(0)).toBe(0)
    })
  })

  describe('round-trip', () => {
    test('monthly -> annual -> monthly preserves value', () => {
      const original = 0.015
      const roundTrip = monthlyFromAnnual(annualFromMonthly(original))
      expect(roundTrip).toBeCloseTo(original, 12)
    })

    test('annual -> monthly -> annual preserves value', () => {
      const original = 0.18
      const roundTrip = annualFromMonthly(monthlyFromAnnual(original))
      expect(roundTrip).toBeCloseTo(original, 12)
    })
  })
})
