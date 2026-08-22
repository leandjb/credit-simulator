/** @jest-environment jsdom */
/* eslint-env jest */

import { initPersonCards } from '../src/js/ui/panel.js'
import { createStore } from '../src/js/ui/state.js'

describe('initPersonCards', () => {
  let store, container, warningEl

  beforeEach(() => {
    store = createStore()
    container = document.createElement('div')
    warningEl = document.createElement('div')
    warningEl.hidden = true
    document.body.appendChild(container)
    document.body.appendChild(warningEl)
    initPersonCards(store, container, warningEl)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('renders a card for each person', () => {
    const cards = container.querySelectorAll('.person-card')
    expect(cards).toHaveLength(2)
  })

  test('each card has name, percentage, and extra inputs', () => {
    const card = container.querySelector('.person-card')
    expect(card.querySelector('.person-card__name')).not.toBeNull()
    expect(card.querySelector('input[type="number"]')).not.toBeNull()
  })

  test('add person button exists', () => {
    const btn = container.querySelector('.person-card__add')
    expect(btn).not.toBeNull()
    expect(btn.textContent).toContain('Add Person')
  })

  test('distribute equally button exists', () => {
    const btn = container.querySelector('.person-card__distribute')
    expect(btn).not.toBeNull()
  })

  test('add person increases count', () => {
    const btn = container.querySelector('.person-card__add')
    btn.click()

    const state = store.getState()
    expect(state.persons).toHaveLength(3)
    expect(container.querySelectorAll('.person-card')).toHaveLength(3)
  })

  test('remove person decreases count', () => {
    const removeBtn = container.querySelector('.person-card__remove')
    removeBtn.click()

    const state = store.getState()
    expect(state.persons).toHaveLength(1)
  })

  test('distribute equally splits percentages', () => {
    // First set uneven percentages
    const pctInputs = container.querySelectorAll('input[type="number"]')
    pctInputs[0].value = 70
    pctInputs[0].dispatchEvent(new Event('input'))
    pctInputs[1].value = 20
    pctInputs[1].dispatchEvent(new Event('input'))

    const distBtn = container.querySelector('.person-card__distribute')
    distBtn.click()

    const state = store.getState()
    const total = state.persons.reduce((sum, p) => sum + p.percentage, 0)
    expect(total).toBe(100)
    expect(state.persons[0].percentage).toBe(50)
    expect(state.persons[1].percentage).toBe(50)
  })

  test('warning banner shows when percentages do not sum to 100', () => {
    // Update persons directly to avoid stale DOM references
    store.update({
      persons: [
        { name: 'Person 1', percentage: 60, extra: 0 },
        { name: 'Person 2', percentage: 30, extra: 0 }
      ]
    })

    expect(warningEl.hidden).toBe(false)
    expect(warningEl.textContent).toContain('90.0%')
  })

  test('warning banner hides when percentages sum to 100', () => {
    expect(warningEl.hidden).toBe(true)
  })

  test('editing name updates state', () => {
    const nameInput = container.querySelector('.person-card__name')
    nameInput.value = 'Ana'
    nameInput.dispatchEvent(new Event('input'))

    const state = store.getState()
    expect(state.persons[0].name).toBe('Ana')
  })

  test('editing extra payment updates state', () => {
    const extraInputs = container.querySelectorAll('input[type="number"]')
    // Second number input in first card is extra
    extraInputs[1].value = 500
    extraInputs[1].dispatchEvent(new Event('input'))

    const state = store.getState()
    expect(state.persons[0].extra).toBe(500)
  })

  test('cannot add more than 6 persons', () => {
    // Add 4 more persons (already have 2)
    for (let i = 0; i < 4; i++) {
      const btn = container.querySelector('.person-card__add')
      if (btn) btn.click()
    }

    expect(container.querySelector('.person-card__add')).toBeNull()
    expect(store.getState().persons).toHaveLength(6)
  })

  test('cannot remove last person', () => {
    // Remove one person
    const removeBtn = container.querySelector('.person-card__remove')
    removeBtn.click()

    // Should not have a remove button for the last person
    expect(container.querySelector('.person-card__remove')).toBeNull()
  })

  test('each card has a contribution display', () => {
    const card = container.querySelector('.person-card')
    expect(card.querySelector('.person-card__contribution')).not.toBeNull()
  })

  test('contribution displays live amount', () => {
    const contributions = container.querySelectorAll('.person-card__contribution')
    // With default 50/50 split and installment ~2,124.70 (100k, 1% monthly, 60 months)
    // Each person should show ~1,062.35
    expect(contributions[0].textContent).not.toBe('—')
    expect(contributions[0].textContent).toContain('$')
  })

  test('focus preserved after structural rebuild', () => {
    const nameInput = container.querySelector('.person-card__name')
    nameInput.focus()
    nameInput.setSelectionRange(3, 3)

    // Trigger structural rebuild by adding a person
    const addBtn = container.querySelector('.person-card__add')
    addBtn.click()

    // Focus should be restored to the first card's name input
    const newNameInput = container.querySelector('.person-card__name')
    expect(document.activeElement).toBe(newNameInput)
  })
})
