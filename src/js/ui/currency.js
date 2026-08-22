/**
 * Currency switcher: USD/COP toggle.
 * Changes formatting only, no conversion.
 */

export function initCurrencySwitcher (store, container) {
  const buttons = container.querySelectorAll('.currency-btn')

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currency = btn.dataset.currency
      store.update({ currency })

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
