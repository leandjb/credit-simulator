/**
 * Parameter panel: synced sliders and numeric inputs.
 * Each continuous parameter has a slider + input that stay in sync.
 */

import { formatCurrency, formatPercent } from '../engine/format.js'
import { annualFromMonthly, monthlyFromAnnual } from '../engine/rates.js'

const PARAM_DEFS = [
  {
    id: 'amount',
    label: 'Loan Amount',
    min: 1000,
    max: 10000000,
    step: 1000,
    format: (v, currency) => formatCurrency(v, currency),
    toState: (v) => v,
    fromState: (s) => s.params.amount
  },
  {
    id: 'term',
    label: 'Term (months)',
    min: 1,
    max: 360,
    step: 1,
    format: (v) => `${v} months`,
    toState: (v) => Math.round(v),
    fromState: (s) => s.params.term
  },
  {
    id: 'rateMonthly',
    label: 'Monthly Rate',
    min: 0,
    max: 0.10,
    step: 0.001,
    format: (v) => formatPercent(v),
    toState: (v) => v,
    fromState: (s) => s.params.monthlyRate
  },
  {
    id: 'rateAnnual',
    label: 'Annual Rate (EA)',
    min: 0,
    max: 2.0,
    step: 0.001,
    format: (v) => formatPercent(v),
    toState: (v) => monthlyFromAnnual(v),
    fromState: (s) => annualFromMonthly(s.params.monthlyRate)
  }
]

export function initPanel (store, container) {
  const controls = {}

  for (const def of PARAM_DEFS) {
    const group = document.createElement('div')
    group.className = 'param-group'
    group.id = `param-${def.id}`

    const label = document.createElement('label')
    label.textContent = def.label
    label.htmlFor = `${def.id}-input`

    const sliderRow = document.createElement('div')
    sliderRow.className = 'param-slider-row'

    const slider = document.createElement('input')
    slider.type = 'range'
    slider.min = def.min
    slider.max = def.max
    slider.step = def.step
    slider.id = `${def.id}-slider`
    slider.setAttribute('aria-label', def.label)

    const input = document.createElement('input')
    input.type = 'number'
    input.min = def.min
    input.max = def.max
    input.step = def.step
    input.id = `${def.id}-input`

    sliderRow.appendChild(slider)
    sliderRow.appendChild(input)
    group.appendChild(label)
    group.appendChild(sliderRow)
    container.appendChild(group)

    controls[def.id] = { def, slider, input, group }

    // Slider -> state
    slider.addEventListener('input', () => {
      const raw = parseFloat(slider.value)
      const stateVal = def.toState(raw)
      if (def.id === 'rateMonthly' || def.id === 'rateAnnual') {
        store.update({ params: { ...store.getState().params, monthlyRate: stateVal } })
      } else if (def.id === 'amount') {
        store.update({ params: { ...store.getState().params, amount: stateVal } })
      } else if (def.id === 'term') {
        store.update({ params: { ...store.getState().params, term: stateVal } })
      }
    })

    // Input -> state
    input.addEventListener('change', () => {
      const raw = parseFloat(input.value)
      if (isNaN(raw)) return

      if (raw < def.min || raw > def.max) {
        input.setCustomValidity(`Must be between ${def.min} and ${def.max}`)
        input.reportValidity()
        return
      }
      input.setCustomValidity('')

      const stateVal = def.toState(raw)
      if (def.id === 'rateMonthly' || def.id === 'rateAnnual') {
        store.update({ params: { ...store.getState().params, monthlyRate: stateVal } })
      } else if (def.id === 'amount') {
        store.update({ params: { ...store.getState().params, amount: stateVal } })
      } else if (def.id === 'term') {
        store.update({ params: { ...store.getState().params, term: stateVal } })
      }
    })
  }

  // Subscribe to state changes
  store.subscribe((state) => {
    for (const [, ctrl] of Object.entries(controls)) {
      const val = ctrl.def.fromState(state)
      const display = ctrl.def.format(val, state.currency)

      ctrl.slider.value = val
      ctrl.input.value = val
      ctrl.slider.setAttribute('aria-valuetext', display)
    }
  })

  // Set initial values from current state
  const initialState = store.getState()
  for (const [, ctrl] of Object.entries(controls)) {
    const val = ctrl.def.fromState(initialState)
    const display = ctrl.def.format(val, initialState.currency)

    ctrl.slider.value = val
    ctrl.input.value = val
    ctrl.slider.setAttribute('aria-valuetext', display)
  }

  return controls
}

export function initPersonCards (store, container, warningEl) {
  function renderCards (persons) {
    container.innerHTML = ''

    persons.forEach((person, index) => {
      const card = document.createElement('div')
      card.className = 'person-card'
      card.dataset.index = index

      const name = document.createElement('input')
      name.type = 'text'
      name.className = 'person-card__name'
      name.value = person.name
      name.setAttribute('aria-label', `Person ${index + 1} name`)
      name.addEventListener('change', () => {
        const updated = [...persons]
        updated[index] = { ...updated[index], name: name.value }
        store.update({ persons: updated })
      })

      const pctField = document.createElement('div')
      pctField.className = 'person-card__field'
      const pctLabel = document.createElement('label')
      pctLabel.textContent = 'Percentage'
      pctLabel.htmlFor = `person-${index}-pct`
      const pctInput = document.createElement('input')
      pctInput.type = 'number'
      pctInput.id = `person-${index}-pct`
      pctInput.min = 0
      pctInput.max = 100
      pctInput.step = 1
      pctInput.value = person.percentage
      pctInput.addEventListener('change', () => {
        const updated = [...persons]
        updated[index] = { ...updated[index], percentage: parseFloat(pctInput.value) || 0 }
        store.update({ persons: updated })
      })
      pctField.appendChild(pctLabel)
      pctField.appendChild(pctInput)

      const extraField = document.createElement('div')
      extraField.className = 'person-card__field'
      const extraLabel = document.createElement('label')
      extraLabel.textContent = 'Extra/month'
      extraLabel.htmlFor = `person-${index}-extra`
      const extraInput = document.createElement('input')
      extraInput.type = 'number'
      extraInput.id = `person-${index}-extra`
      extraInput.min = 0
      extraInput.step = 100
      extraInput.value = person.extra || 0
      extraInput.addEventListener('change', () => {
        const updated = [...persons]
        updated[index] = { ...updated[index], extra: parseFloat(extraInput.value) || 0 }
        store.update({ persons: updated })
      })
      extraField.appendChild(extraLabel)
      extraField.appendChild(extraInput)

      card.appendChild(name)
      card.appendChild(pctField)
      card.appendChild(extraField)

      if (persons.length > 1) {
        const removeBtn = document.createElement('button')
        removeBtn.textContent = '×'
        removeBtn.className = 'person-card__remove'
        removeBtn.setAttribute('aria-label', `Remove ${person.name}`)
        removeBtn.addEventListener('click', () => {
          const updated = persons.filter((_, i) => i !== index)
          redistributeEqually(updated)
          store.update({ persons: updated })
        })
        card.appendChild(removeBtn)
      }

      container.appendChild(card)
    })

    // Add person button
    if (persons.length < 6) {
      const addBtn = document.createElement('button')
      addBtn.textContent = '+ Add Person'
      addBtn.className = 'person-card__add'
      addBtn.addEventListener('click', () => {
        const updated = [...persons, { name: `Person ${persons.length + 1}`, percentage: 0, extra: 0 }]
        redistributeEqually(updated)
        store.update({ persons: updated })
      })
      container.appendChild(addBtn)
    }

    // Distribute equally button
    if (persons.length > 1) {
      const distBtn = document.createElement('button')
      distBtn.textContent = 'Distribute Equally'
      distBtn.className = 'person-card__distribute'
      distBtn.addEventListener('click', () => {
        const updated = [...persons]
        redistributeEqually(updated)
        store.update({ persons: updated })
      })
      container.appendChild(distBtn)
    }

    // Update warning banner
    const total = persons.reduce((sum, p) => sum + p.percentage, 0)
    if (Math.abs(total - 100) > 0.01) {
      warningEl.hidden = false
      warningEl.textContent = `Percentages sum to ${total.toFixed(1)}% — must be 100%`
    } else {
      warningEl.hidden = true
    }
  }

  function redistributeEqually (persons) {
    const share = Math.floor(100 / persons.length)
    const remainder = 100 - share * persons.length
    persons.forEach((p, i) => {
      p.percentage = share + (i === 0 ? remainder : 0)
    })
  }

  store.subscribe((state) => {
    renderCards(state.persons)
  })

  // Initial render
  renderCards(store.getState().persons)
}
