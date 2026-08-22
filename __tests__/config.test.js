/** @jest-environment jsdom */
/* eslint-env jest */
import { jest } from '@jest/globals'
import { initConfig } from '../src/js/ui/config.js'
import { createStore } from '../src/js/ui/state.js'

describe('initConfig', () => {
  let store

  beforeEach(() => {
    store = createStore()
    document.body.innerHTML = '<div id="config-mount"></div>'
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('creates config panel', () => {
    const panel = initConfig(store)
    document.getElementById('config-mount').appendChild(panel)
    expect(panel.classList.contains('config-panel')).toBe(true)
  })

  test('has persons input', () => {
    const panel = initConfig(store)
    document.getElementById('config-mount').appendChild(panel)
    expect(panel.querySelector('#config-persons')).not.toBeNull()
  })

  test('has currency select', () => {
    const panel = initConfig(store)
    document.getElementById('config-mount').appendChild(panel)
    expect(panel.querySelector('#config-currency')).not.toBeNull()
  })

  test('has start button', () => {
    const panel = initConfig(store)
    document.getElementById('config-mount').appendChild(panel)
    expect(panel.querySelector('#config-start')).not.toBeNull()
  })

  test('renders name fields for default 2 persons', () => {
    const panel = initConfig(store)
    document.getElementById('config-mount').appendChild(panel)
    const names = panel.querySelectorAll('#config-names .config-field')
    expect(names).toHaveLength(2)
  })

  test('updates name fields when persons count changes', () => {
    const panel = initConfig(store)
    document.getElementById('config-mount').appendChild(panel)
    const personsInput = panel.querySelector('#config-persons')
    personsInput.value = 4
    personsInput.dispatchEvent(new Event('change'))

    const names = panel.querySelectorAll('#config-names .config-field')
    expect(names).toHaveLength(4)
  })

  test('start button applies config to store', () => {
    const panel = initConfig(store)
    document.getElementById('config-mount').appendChild(panel)

    const startBtn = panel.querySelector('#config-start')
    startBtn.click()

    const state = store.getState()
    expect(state.persons).toHaveLength(2)
    expect(state.currency).toBe('USD')
  })

  test('start button removes panel', () => {
    const panel = initConfig(store)
    document.getElementById('config-mount').appendChild(panel)

    const startBtn = panel.querySelector('#config-start')
    startBtn.click()

    expect(document.querySelector('.config-panel')).toBeNull()
  })

  test('start button calls onComplete', () => {
    const onComplete = jest.fn()
    const panel = initConfig(store, onComplete)
    document.getElementById('config-mount').appendChild(panel)

    const startBtn = panel.querySelector('#config-start')
    startBtn.click()

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  test('applies selected currency', () => {
    const panel = initConfig(store)
    document.getElementById('config-mount').appendChild(panel)

    const currencySelect = panel.querySelector('#config-currency')
    currencySelect.value = 'COP'

    const startBtn = panel.querySelector('#config-start')
    startBtn.click()

    expect(store.getState().currency).toBe('COP')
  })
})
