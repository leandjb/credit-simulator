/* eslint-env jest */
import { formatCurrency, formatNumber, formatPercent } from '../src/js/engine/format.js'

describe('format', () => {
  describe('formatCurrency', () => {
    test('formats USD with 2 decimals', () => {
      const result = formatCurrency(1234.56, 'USD')
      expect(result).toContain('1,234.56')
      expect(result).toContain('$')
    })

    test('formats COP with no decimals', () => {
      const result = formatCurrency(1234567, 'COP')
      expect(result).toContain('1.234.567')
      expect(result).toContain('$')
    })

    test('formats 0 correctly', () => {
      expect(formatCurrency(0, 'USD')).toContain('0.00')
      expect(formatCurrency(0, 'COP')).toContain('0')
    })

    test('formats negative amounts', () => {
      const result = formatCurrency(-1000, 'USD')
      expect(result).toContain('1,000.00')
      expect(result).toMatch(/[-−]/)
    })

    test('defaults to USD', () => {
      const result = formatCurrency(100)
      expect(result).toContain('$')
      expect(result).toContain('100.00')
    })
  })

  describe('formatNumber', () => {
    test('formats with default 2 decimals', () => {
      expect(formatNumber(1234.5678)).toBe('1,234.57')
    })

    test('formats with custom decimals', () => {
      expect(formatNumber(1234.5678, 0)).toBe('1,235')
      expect(formatNumber(1234.5678, 4)).toBe('1,234.5678')
    })
  })

  describe('formatPercent', () => {
    test('formats as percentage', () => {
      const result = formatPercent(0.1268)
      expect(result).toContain('12.68')
      expect(result).toContain('%')
    })

    test('formats 0', () => {
      expect(formatPercent(0)).toContain('0')
    })
  })
})
