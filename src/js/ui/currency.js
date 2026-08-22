/**
 * Currency switcher: USD/COP toggle.
 * Changes formatting only, no conversion.
 */

export const CURRENCY_RANGES = {
  USD: { min: 5000, max: 2000000, step: 1000 },
  COP: { min: 1000000, max: 2000000000, step: 1000000 }
}

export function initCurrencySwitcher (store, container) {
  const buttons = container.querySelectorAll('.currency-btn')

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currency = btn.dataset.currency
      const range = CURRENCY_RANGES[currency]
      const currentAmount = store.getState().params.amount

      let amount = currentAmount
      if (range) {
        if (currentAmount < range.min) amount = range.min
        if (currentAmount > range.max) amount = range.max
      }

      store.update({
        currency,
        params: { ...store.getState().params, amount }
      })

      // Update active state
      buttons.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
    })
  })

  // Sync active state from store
  store.subscribe((state) => {
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.currency === state.currency)
    })
  })
}
