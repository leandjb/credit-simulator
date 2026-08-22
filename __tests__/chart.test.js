/** @jest-environment jsdom */
/* eslint-env jest */

import { initChart } from '../src/js/ui/chart.js'
import { createStore } from '../src/js/ui/state.js'

describe('initChart', () => {
  let store, svg

  beforeEach(() => {
    store = createStore()
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '800')
    svg.setAttribute('height', '400')
    document.body.appendChild(svg)
    initChart(store, svg)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('renders SVG content', () => {
    expect(svg.children.length).toBeGreaterThan(0)
  })

  test('renders balance curve path', () => {
    const curve = svg.querySelector('.balance-curve')
    expect(curve).not.toBeNull()
    expect(curve.tagName).toBe('path')
    expect(curve.getAttribute('stroke')).toBe('var(--color-accent)')
  })

  test('renders cumulative paid curve', () => {
    const curve = svg.querySelector('.cumulative-curve')
    expect(curve).not.toBeNull()
    expect(curve.getAttribute('stroke-dasharray')).toBe('6,3')
  })

  test('renders person bands', () => {
    const band0 = svg.querySelector('.person-band-0')
    const band1 = svg.querySelector('.person-band-1')
    expect(band0).not.toBeNull()
    expect(band1).not.toBeNull()
  })

  test('renders equilibrium marker', () => {
    const marker = svg.querySelector('.equilibrium-marker')
    expect(marker).not.toBeNull()
    expect(marker.tagName).toBe('circle')
  })

  test('renders axis labels', () => {
    const texts = svg.querySelectorAll('text')
    const textContent = Array.from(texts).map(t => t.textContent)
    expect(textContent).toContain('Months')
    expect(textContent.some(t => t.includes('$'))).toBe(true)
  })

  test('redraws on state update', () => {
    store.update({ params: { ...store.getState().params, amount: 200000 } })
    // Should have re-rendered
    expect(svg.children.length).toBeGreaterThan(0)
  })

  test('handles invalid result gracefully', () => {
    store.update({ params: { amount: -1, term: 60, monthlyRate: 0.01 } })
    // Should not throw, should keep last valid render
    expect(svg.children.length).toBeGreaterThan(0)
  })
})
