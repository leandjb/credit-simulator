/**
 * Bootstrap: wires store, panel, chart, summary, currency, and toast together.
 * Uses rAF coalescing to batch renders.
 */

import { createStore } from './state.js'
import { initPanel, initPersonCards } from './panel.js'
import { initChart } from './chart.js'
import { initSummary } from './summary.js'
import { initCurrencySwitcher } from './currency.js'
import { initToast } from './toast.js'

export function init () {
  const store = createStore()

  // rAF coalescing for subsequent updates
  let dirty = false
  const subscribers = new Set()

  function scheduleRender (state) {
    if (dirty) return
    dirty = true
    const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (fn) => setTimeout(fn, 0) // eslint-disable-line no-undef
    raf(() => {
      dirty = false
      for (const fn of subscribers) fn(state)
    })
  }

  // Patch store.subscribe to use rAF coalescing
  const originalSubscribe = store.subscribe.bind(store)
  store.subscribe = (fn) => {
    subscribers.add(fn)
    originalSubscribe((state) => scheduleRender(state))
    return () => subscribers.delete(fn)
  }

  // Initialize UI modules
  const paramsContainer = document.getElementById('params-section')
  const personsContainer = document.getElementById('person-cards')
  const warningEl = document.getElementById('percentage-warning')
  const chartSvg = document.getElementById('chart')
  const summaryContainer = document.getElementById('summary')
  const currencyContainer = document.getElementById('currency-switcher')
  const toastContainer = document.getElementById('toast-container')

  initPanel(store, paramsContainer)
  initPersonCards(store, personsContainer, warningEl)
  initChart(store, chartSvg)
  initSummary(store, summaryContainer)
  initCurrencySwitcher(store, currencyContainer)
  initToast(store, toastContainer)

  return store
}

// Auto-init when loaded as a script tag (not when imported as a module)
if (typeof document !== 'undefined' && document.getElementById('params-section')) {
  init()
}
