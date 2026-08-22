/* eslint-env jest */
import { validate } from '../src/js/engine/validate.js'

const validParams = {
  amount: 100000,
  term: 60,
  monthlyRate: 0.01,
  persons: [
    { name: 'Ana', percentage: 50, extra: 0 },
    { name: 'Luis', percentage: 50, extra: 0 }
  ]
}

describe('validate', () => {
  test('accepts valid params', () => {
    expect(validate(validParams)).toEqual({ ok: true })
  })

  describe('amount', () => {
    test('rejects zero amount', () => {
      const result = validate({ ...validParams, amount: 0 })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('amount')
    })

    test('rejects negative amount', () => {
      const result = validate({ ...validParams, amount: -1000 })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('amount')
    })

    test('rejects null amount', () => {
      const result = validate({ ...validParams, amount: null })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('amount')
    })
  })

  describe('term', () => {
    test('rejects term of 0', () => {
      const result = validate({ ...validParams, term: 0 })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('term')
    })

    test('rejects term over 360', () => {
      const result = validate({ ...validParams, term: 361 })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('term')
    })

    test('rejects non-integer term', () => {
      const result = validate({ ...validParams, term: 12.5 })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('term')
    })

    test('accepts term of 360', () => {
      const result = validate({ ...validParams, term: 360 })
      expect(result.ok).toBe(true)
    })

    test('accepts term of 1', () => {
      const result = validate({ ...validParams, term: 1 })
      expect(result.ok).toBe(true)
    })
  })

  describe('monthlyRate', () => {
    test('rejects negative rate', () => {
      const result = validate({ ...validParams, monthlyRate: -0.01 })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('monthlyRate')
    })

    test('rejects rate over 10%', () => {
      const result = validate({ ...validParams, monthlyRate: 0.11 })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('monthlyRate')
    })

    test('accepts 0% rate', () => {
      const result = validate({ ...validParams, monthlyRate: 0 })
      expect(result.ok).toBe(true)
    })

    test('accepts 10% rate', () => {
      const result = validate({ ...validParams, monthlyRate: 0.10 })
      expect(result.ok).toBe(true)
    })
  })

  describe('persons', () => {
    test('rejects empty persons array', () => {
      const result = validate({ ...validParams, persons: [] })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('persons')
    })

    test('rejects more than 6 persons', () => {
      const persons = Array.from({ length: 7 }, (_, i) => ({
        name: `P${i}`, percentage: i === 0 ? 100 - 6 * 10 : 10, extra: 0
      }))
      const result = validate({ ...validParams, persons })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('persons')
    })

    test('accepts 1 person at 100%', () => {
      const result = validate({
        ...validParams,
        persons: [{ name: 'Solo', percentage: 100, extra: 0 }]
      })
      expect(result.ok).toBe(true)
    })

    test('accepts 6 persons', () => {
      const persons = Array.from({ length: 6 }, (_, i) => ({
        name: `P${i}`, percentage: i === 0 ? 100 - 5 * (100 / 6) : 100 / 6, extra: 0
      }))
      const result = validate({ ...validParams, persons })
      expect(result.ok).toBe(true)
    })

    test('rejects percentages summing to 110%', () => {
      const result = validate({
        ...validParams,
        persons: [
          { name: 'A', percentage: 60, extra: 0 },
          { name: 'B', percentage: 50, extra: 0 }
        ]
      })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('persons')
      expect(result.errors[0].message).toContain('110.0%')
    })

    test('rejects percentages summing to 95%', () => {
      const result = validate({
        ...validParams,
        persons: [
          { name: 'A', percentage: 50, extra: 0 },
          { name: 'B', percentage: 45, extra: 0 }
        ]
      })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('persons')
      expect(result.errors[0].message).toContain('95.0%')
    })

    test('rejects negative extra payment', () => {
      const result = validate({
        ...validParams,
        persons: [
          { name: 'A', percentage: 50, extra: -100 },
          { name: 'B', percentage: 50, extra: 0 }
        ]
      })
      expect(result.ok).toBe(false)
      expect(result.errors[0].field).toBe('persons[0].extra')
    })
  })

  test('collects multiple errors', () => {
    const result = validate({ amount: -1, term: 0, monthlyRate: -1, persons: [] })
    expect(result.ok).toBe(false)
    expect(result.errors.length).toBeGreaterThan(1)
  })
})
