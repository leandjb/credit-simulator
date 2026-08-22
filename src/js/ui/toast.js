/**
 * Toast notifications and inline banners.
 * Auto-dismissing toasts, inline banners in the offending panel.
 */

export function initToast (store, container) {
  let lastResultOk = true

  store.subscribe((state) => {
    const { result } = state

    if (result && !result.ok && lastResultOk) {
      // Show error toast
      result.errors.forEach(err => {
        showToast(container, err.message, 'error')
      })
    }

    lastResultOk = result ? result.ok : true
  })
}

export function showToast (container, message, type = 'info') {
  const toast = document.createElement('div')
  toast.className = `toast toast--${type}`
  toast.textContent = message
  container.appendChild(toast)

  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transition = 'opacity 0.3s ease'
    setTimeout(() => toast.remove(), 300)
  }, 4000)
}
