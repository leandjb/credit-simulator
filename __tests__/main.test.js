/** @jest-environment jsdom */
/* eslint-env jest */

import { init } from '../src/js/ui/main.js'

describe('main.js wiring', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="params-section"></div>
      <div id="person-cards"></div>
      <div id="percentage-warning" hidden></div>
      <svg id="chart"></svg>
      <div id="summary">
        <span id="kpi-installment-value">—</span>
        <span id="kpi-payoff-value">—</span>
        <span id="kpi-equilibrium-value">—</span>
        <span id="kpi-interest-value">—</span>
      </div>
      <div id="currency-switcher">
        <button class="currency-btn active" data-currency="USD">USD</button>
        <button class="currency-btn" data-currency="COP">COP</button>
      </div>
      <div id="toast-container"></div>
    `
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('init returns store', () => {
    const store = init()
    expect(store).toBeDefined()
    expect(store.getState).toBeDefined()
  })

  test('panel controls are created', () => {
    init()
    expect(document.querySelector('#amount-slider')).not.toBeNull()
    expect(document.querySelector('#term-slider')).not.toBeNull()
  })

  test('person cards are created', () => {
    init()
    expect(document.querySelectorAll('.person-card').length).toBeGreaterThan(0)
  })

  test('chart has content', () => {
    init()
    const svg = document.querySelector('#chart')
    expect(svg.children.length).toBeGreaterThan(0)
  })

  test('summary shows values', () => {
    init()
    const installment = document.querySelector('#kpi-installment-value')
    expect(installment.textContent).not.toBe('—')
    expect(installment.textContent).toContain('$')
  })

  test('currency switcher works', () => {
    init()
    const copBtn = document.querySelector('[data-currency="COP"]')
    copBtn.click()

    expect(copBtn.classList.contains('active')).toBe(true)
  })
})
