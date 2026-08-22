/** @jest-environment jsdom */
/* eslint-env jest */

import { initPanel } from '../src/js/ui/panel.js'
import { initCurrencySwitcher } from '../src/js/ui/currency.js'
import { createStore } from '../src/js/ui/state.js'

describe('initPanel', () => {
  let store, container

  beforeEach(() => {
    store = createStore()
    container = document.createElement('div')
    document.body.appendChild(container)
    initPanel(store, container)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('creates slider and input for each parameter', () => {
    expect(container.querySelector('#amount-slider')).not.toBeNull()
    expect(container.querySelector('#amount-input')).not.toBeNull()
    expect(container.querySelector('#term-slider')).not.toBeNull()
    expect(container.querySelector('#term-input')).not.toBeNull()
    expect(container.querySelector('#rateMonthly-slider')).not.toBeNull()
    expect(container.querySelector('#rateMonthly-input')).not.toBeNull()
    expect(container.querySelector('#rateAnnual-slider')).not.toBeNull()
    expect(container.querySelector('#rateAnnual-input')).not.toBeNull()
  })

  test('slider and input show initial values', () => {
    const amountSlider = container.querySelector('#amount-slider')
    const amountInput = container.querySelector('#amount-input')
    expect(parseFloat(amountSlider.value)).toBe(100000)
    expect(parseFloat(amountInput.value)).toBe(100000)
  })

  test('rate sliders show percent values', () => {
    const monthlySlider = container.querySelector('#rateMonthly-slider')
    const monthlyInput = container.querySelector('#rateMonthly-input')
    // Default monthlyRate is 0.01 (1%), so UI should show 1
    expect(parseFloat(monthlySlider.value)).toBeCloseTo(1, 1)
    expect(parseFloat(monthlyInput.value)).toBeCloseTo(1, 1)
  })

  test('annual rate slider shows percent EA value', () => {
    const annualSlider = container.querySelector('#rateAnnual-slider')
    const annualInput = container.querySelector('#rateAnnual-input')
    // Default monthlyRate 0.01 → annual EA ≈ 12.68%
    expect(parseFloat(annualSlider.value)).toBeGreaterThan(12)
    expect(parseFloat(annualSlider.value)).toBeLessThan(13)
  })

  test('slider updates state on input', () => {
    const slider = container.querySelector('#amount-slider')
    slider.value = 200000
    slider.dispatchEvent(new Event('input'))

    const state = store.getState()
    expect(state.params.amount).toBe(200000)
  })

  test('input updates state on change', () => {
    const input = container.querySelector('#term-input')
    input.value = 120
    input.dispatchEvent(new Event('change'))

    const state = store.getState()
    expect(state.params.term).toBe(120)
  })

  test('slider and input stay in sync after state update', () => {
    store.update({ params: { ...store.getState().params, amount: 500000 } })

    const slider = container.querySelector('#amount-slider')
    const input = container.querySelector('#amount-input')
    expect(parseFloat(slider.value)).toBe(500000)
    expect(parseFloat(input.value)).toBe(500000)
  })

  test('annual rate slider updates monthly rate in state', () => {
    const slider = container.querySelector('#rateAnnual-slider')
    slider.value = 12
    slider.dispatchEvent(new Event('input'))

    const state = store.getState()
    // 12% EA → monthly ≈ 0.00949 (0.949%)
    expect(state.params.monthlyRate).toBeGreaterThan(0.009)
    expect(state.params.monthlyRate).toBeLessThan(0.01)
  })

  test('amount slider has currency-aware bounds', () => {
    const slider = container.querySelector('#amount-slider')
    // Default USD: min 5000, max 2000000
    expect(parseFloat(slider.min)).toBe(5000)
    expect(parseFloat(slider.max)).toBe(2000000)
  })

  test('aria-valuetext is set on sliders', () => {
    const slider = container.querySelector('#amount-slider')
    expect(slider.getAttribute('aria-valuetext')).not.toBeNull()
    expect(slider.getAttribute('aria-valuetext')).toContain('$')
  })

  test('currency switch clamps amount to COP minimum', () => {
    // Set up currency switcher DOM
    const switcher = document.createElement('div')
    switcher.innerHTML = `
      <button class="currency-btn active" data-currency="USD">USD</button>
      <button class="currency-btn" data-currency="COP">COP</button>
    `
    document.body.appendChild(switcher)
    initCurrencySwitcher(store, switcher)

    // Default amount is 100,000 (within USD range 5k–2M)
    expect(store.getState().params.amount).toBe(100000)

    // Switch to COP — amount should clamp to COP min (1,000,000)
    const copBtn = switcher.querySelector('[data-currency="COP"]')
    copBtn.click()

    const state = store.getState()
    expect(state.currency).toBe('COP')
    expect(state.params.amount).toBe(1000000)

    // Slider and input should reflect clamped value
    const slider = container.querySelector('#amount-slider')
    const input = container.querySelector('#amount-input')
    expect(parseFloat(slider.value)).toBe(1000000)
    expect(parseFloat(input.value)).toBe(1000000)
    expect(parseFloat(slider.min)).toBe(1000000)
    expect(parseFloat(slider.max)).toBe(2000000000)
  })
})
