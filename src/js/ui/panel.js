/**
 * Parameter panel: synced sliders and numeric inputs.
 * Each continuous parameter has a slider + input that stay in sync.
 * Rate controls display in percent units; state remains decimal.
 * Amount ranges are currency-aware.
 */

import { formatCurrency, formatPercent } from '../engine/format.js'
import { annualFromMonthly, monthlyFromAnnual } from '../engine/rates.js'
import { CURRENCY_RANGES } from './currency.js'

function getAmountBounds (currency) {
  return CURRENCY_RANGES[currency] || CURRENCY_RANGES.USD
}

const PARAM_DEFS = [
  {
    id: 'amount',
    label: 'Loan Amount',
    getBounds: (state) => getAmountBounds(state.currency),
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
    label: 'Monthly Rate (%)',
    min: 0,
    max: 10,
    step: 0.01,
    format: (v) => formatPercent(v / 100),
    toUI: (decimal) => decimal * 100,
    fromUI: (percent) => percent / 100,
    toState: (uiVal) => uiVal / 100,
    fromState: (s) => s.params.monthlyRate * 100
  },
  {
    id: 'rateAnnual',
    label: 'Annual Rate EA (%)',
    min: 0,
    max: 200,
    step: 0.1,
    format: (v) => formatPercent(v / 100),
    toUI: (decimal) => annualFromMonthly(decimal) * 100,
    fromUI: (percent) => monthlyFromAnnual(percent / 100),
    toState: (uiVal) => monthlyFromAnnual(uiVal / 100),
    fromState: (s) => annualFromMonthly(s.params.monthlyRate) * 100
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
    slider.id = `${def.id}-slider`
    slider.setAttribute('aria-label', def.label)

    const input = document.createElement('input')
    input.type = 'number'
    input.id = `${def.id}-input`

    // Set initial bounds
    const state = store.getState()
    const bounds = def.getBounds ? def.getBounds(state) : { min: def.min, max: def.max, step: def.step }
    slider.min = bounds.min
    slider.max = bounds.max
    slider.step = bounds.step
    input.min = bounds.min
    input.max = bounds.max
    input.step = bounds.step

    sliderRow.appendChild(slider)
    sliderRow.appendChild(input)
    group.appendChild(label)
    group.appendChild(sliderRow)
    container.appendChild(group)

    controls[def.id] = { def, slider, input, group }

    // Slider -> state
    slider.addEventListener('input', () => {
      const raw = parseFloat(slider.value)
      if (isNaN(raw)) return
      const stateVal = def.toState(raw)
      if (def.id === 'rateMonthly' || def.id === 'rateAnnual') {
        store.update({ params: { ...store.getState().params, monthlyRate: stateVal } })
      } else if (def.id === 'amount') {
        store.update({ params: { ...store.getState().params, amount: stateVal } })
      } else if (def.id === 'term') {
        store.update({ params: { ...store.getState().params, term: stateVal } })
      }
    })

    // Input -> state (real-time on input, silent validation)
    input.addEventListener('input', () => {
      const raw = parseFloat(input.value)
      if (isNaN(raw)) return

      const currentBounds = def.getBounds ? def.getBounds(store.getState()) : { min: def.min, max: def.max }
      if (raw < currentBounds.min || raw > currentBounds.max) {
        input.style.borderColor = 'var(--color-error)'
        return
      }
      input.style.borderColor = ''

      const stateVal = def.toState(raw)
      if (def.id === 'rateMonthly' || def.id === 'rateAnnual') {
        store.update({ params: { ...store.getState().params, monthlyRate: stateVal } })
      } else if (def.id === 'amount') {
        store.update({ params: { ...store.getState().params, amount: stateVal } })
      } else if (def.id === 'term') {
        store.update({ params: { ...store.getState().params, term: stateVal } })
      }
    })

    // Full validation on commit (blur)
    input.addEventListener('change', () => {
      const raw = parseFloat(input.value)
      if (isNaN(raw)) return

      const currentBounds = def.getBounds ? def.getBounds(store.getState()) : { min: def.min, max: def.max }
      if (raw < currentBounds.min || raw > currentBounds.max) {
        input.setCustomValidity(`Must be between ${currentBounds.min} and ${currentBounds.max}`)
        input.reportValidity()
        return
      }
      input.setCustomValidity('')
      input.style.borderColor = ''

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

      // Update bounds for currency-aware params
      if (ctrl.def.getBounds) {
        const bounds = ctrl.def.getBounds(state)
        ctrl.slider.min = bounds.min
        ctrl.slider.max = bounds.max
        ctrl.slider.step = bounds.step
        ctrl.input.min = bounds.min
        ctrl.input.max = bounds.max
        ctrl.input.step = bounds.step
      }

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
  let lastPersonsRef = null
  const contributionEls = new Map()

  function captureFocus () {
    const active = document.activeElement
    if (!active || !container.contains(active)) return null
    const card = active.closest('.person-card')
    if (!card) return null
    return {
      index: parseInt(card.dataset.index),
      fieldClass: active.className,
      selectionStart: active.selectionStart,
      selectionEnd: active.selectionEnd
    }
  }

  function restoreFocus (focusInfo) {
    if (!focusInfo) return
    const cards = container.querySelectorAll('.person-card')
    const card = cards[focusInfo.index]
    if (!card) return
    const el = card.querySelector(`.${focusInfo.fieldClass}`)
    if (!el) return
    el.focus()
    if (el.setSelectionRange && focusInfo.selectionStart != null) {
      el.setSelectionRange(focusInfo.selectionStart, focusInfo.selectionEnd)
    }
  }

  function buildCards (persons, currency) {
    container.innerHTML = ''
    contributionEls.clear()

    persons.forEach((person, index) => {
      const card = document.createElement('div')
      card.className = 'person-card'
      card.dataset.index = index

      const name = document.createElement('input')
      name.type = 'text'
      name.className = 'person-card__name'
      name.value = person.name
      name.setAttribute('aria-label', `Person ${index + 1} name`)
      name.addEventListener('input', () => {
        const updated = [...store.getState().persons]
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
      pctInput.className = 'person-card__pct'
      pctInput.min = 0
      pctInput.max = 100
      pctInput.step = 1
      pctInput.value = person.percentage
      pctInput.addEventListener('input', () => {
        const updated = [...store.getState().persons]
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
      extraInput.className = 'person-card__extra'
      extraInput.min = 0
      extraInput.step = 100
      extraInput.value = person.extra || 0
      extraInput.addEventListener('input', () => {
        const updated = [...store.getState().persons]
        updated[index] = { ...updated[index], extra: parseFloat(extraInput.value) || 0 }
        store.update({ persons: updated })
      })
      extraField.appendChild(extraLabel)
      extraField.appendChild(extraInput)

      const contribution = document.createElement('div')
      contribution.className = 'person-card__contribution'
      contribution.textContent = '—'
      contributionEls.set(index, contribution)

      card.appendChild(name)
      card.appendChild(pctField)
      card.appendChild(extraField)
      card.appendChild(contribution)

      if (persons.length > 1) {
        const removeBtn = document.createElement('button')
        removeBtn.textContent = '×'
        removeBtn.className = 'person-card__remove'
        removeBtn.setAttribute('aria-label', `Remove ${person.name}`)
        removeBtn.addEventListener('click', () => {
          const updated = store.getState().persons.filter((_, i) => i !== index)
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
        const updated = [...store.getState().persons, { name: `Person ${store.getState().persons.length + 1}`, percentage: 0, extra: 0 }]
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
        const updated = [...store.getState().persons]
        redistributeEqually(updated)
        store.update({ persons: updated })
      })
      container.appendChild(distBtn)
    }
  }

  function updateContributions (state) {
    if (!state.result || !state.result.ok) {
      for (const [, el] of contributionEls) {
        el.textContent = '—'
      }
      return
    }
    const installment = state.result.summary.installment
    const persons = state.persons
    for (const [index, el] of contributionEls) {
      if (index >= persons.length) continue
      const p = persons[index]
      const contribution = installment * (p.percentage / 100) + (p.extra || 0)
      el.textContent = formatCurrency(contribution, state.currency)
    }
  }

  function updateWarning (persons) {
    const total = persons.reduce((sum, p) => sum + p.percentage, 0)
    if (Math.abs(total - 100) > 0.01) {
      warningEl.hidden = false
      warningEl.textContent = `Percentages sum to ${total.toFixed(1)}% — must be 100%`
    } else {
      warningEl.hidden = true
    }
  }

  store.subscribe((state) => {
    const personsRef = state.persons
    if (personsRef !== lastPersonsRef) {
      // Structural rebuild: persons array changed (add/remove/edit)
      const focusInfo = captureFocus()
      lastPersonsRef = personsRef
      buildCards(state.persons, state.currency)
      updateContributions(state)
      updateWarning(state.persons)
      restoreFocus(focusInfo)
    } else {
      // Value-only update: result changed (rate/amount/term slider)
      updateContributions(state)
      updateWarning(state.persons)
    }
  })

  // Initial render
  const initialState = store.getState()
  lastPersonsRef = initialState.persons
  buildCards(initialState.persons, initialState.currency)
  updateContributions(initialState)
  updateWarning(initialState.persons)
}

function redistributeEqually (persons) {
  const share = Math.floor(100 / persons.length)
  const remainder = 100 - share * persons.length
  persons.forEach((p, i) => {
    p.percentage = share + (i === 0 ? remainder : 0)
  })
}
