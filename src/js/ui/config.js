/**
 * Initial configuration panel.
 * Lets users set number of persons, names, and currency before starting.
 */

export function initConfig (store, onComplete) {
  const panel = document.createElement('div')
  panel.className = 'config-panel glass-panel'
  panel.innerHTML = `
    <h2>Configure Your Simulation</h2>
    <div class="config-field">
      <label for="config-persons">Number of persons</label>
      <input type="number" id="config-persons" min="1" max="6" value="2">
    </div>
    <div id="config-names"></div>
    <div class="config-field">
      <label for="config-currency">Currency</label>
      <select id="config-currency">
        <option value="USD">USD ($)</option>
        <option value="COP">COP ($)</option>
      </select>
    </div>
    <button id="config-start" class="config-start-btn">Start Simulating</button>
  `

  const namesContainer = panel.querySelector('#config-names')
  const personsInput = panel.querySelector('#config-persons')
  const currencySelect = panel.querySelector('#config-currency')
  const startBtn = panel.querySelector('#config-start')

  function renderNameFields (count) {
    namesContainer.innerHTML = ''
    for (let i = 0; i < count; i++) {
      const field = document.createElement('div')
      field.className = 'config-field'
      field.innerHTML = `
        <label for="config-name-${i}">Person ${i + 1} name</label>
        <input type="text" id="config-name-${i}" value="Person ${i + 1}">
      `
      namesContainer.appendChild(field)
    }
  }

  personsInput.addEventListener('change', () => {
    const count = Math.max(1, Math.min(6, parseInt(personsInput.value) || 2))
    renderNameFields(count)
  })

  startBtn.addEventListener('click', () => {
    const count = parseInt(personsInput.value) || 2
    const currency = currencySelect.value
    const persons = []

    for (let i = 0; i < count; i++) {
      const nameInput = panel.querySelector(`#config-name-${i}`)
      persons.push({
        name: nameInput ? nameInput.value : `Person ${i + 1}`,
        percentage: Math.floor(100 / count) + (i === 0 ? 100 % count : 0),
        extra: 0
      })
    }

    store.update({ persons, currency })
    panel.remove()
    if (onComplete) onComplete()
  })

  renderNameFields(2)

  return panel
}
