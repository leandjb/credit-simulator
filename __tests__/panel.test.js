/** @jest-environment jsdom */
/* eslint-env jest */

import { initPanel } from '../src/js/ui/panel.js'
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
    slider.value = 0.12
    slider.dispatchEvent(new Event('input'))

    const state = store.getState()
    expect(state.params.monthlyRate).toBeGreaterThan(0)
    expect(state.params.monthlyRate).toBeLessThan(0.12)
  })

  test('aria-valuetext is set on sliders', () => {
    const slider = container.querySelector('#amount-slider')
    expect(slider.getAttribute('aria-valuetext')).not.toBeNull()
    expect(slider.getAttribute('aria-valuetext')).toContain('$')
  })
})
