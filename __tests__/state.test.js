/* eslint-env jest */
// @jest-environment jsdom
import { jest } from '@jest/globals'
import { createStore } from '../src/js/ui/state.js'

describe('createStore', () => {
  let store

  beforeEach(() => {
    store = createStore()
  })

  test('initializes with default state', () => {
    const state = store.getState()
    expect(state.params.amount).toBe(100000)
    expect(state.params.term).toBe(60)
    expect(state.params.monthlyRate).toBe(0.01)
    expect(state.persons).toHaveLength(2)
    expect(state.currency).toBe('USD')
    expect(state.result).not.toBeNull()
    expect(state.result.ok).toBe(true)
  })

  test('update recomputes engine result', () => {
    store.update({ params: { amount: 200000, term: 120, monthlyRate: 0.015 } })
    const state = store.getState()
    expect(state.params.amount).toBe(200000)
    expect(state.result.ok).toBe(true)
    expect(state.result.summary.installment).toBeGreaterThan(0)
  })

  test('update with invalid params retains last valid result', () => {
    const lastValid = store.getLastValidResult()
    expect(lastValid).not.toBeNull()
    expect(lastValid.ok).toBe(true)

    store.update({ params: { amount: -1, term: 60, monthlyRate: 0.01 } })
    const state = store.getState()
    expect(state.result.ok).toBe(false)
    expect(store.getLastValidResult()).toBe(lastValid)
  })

  test('subscribe receives state on update', () => {
    const listener = jest.fn()
    store.subscribe(listener)

    store.update({ currency: 'COP' })
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(store.getState())
  })

  test('unsubscribe stops notifications', () => {
    const listener = jest.fn()
    const unsub = store.subscribe(listener)

    store.update({ currency: 'COP' })
    expect(listener).toHaveBeenCalledTimes(1)

    unsub()
    store.update({ currency: 'USD' })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('update with persons recomputes', () => {
    store.update({
      persons: [
        { name: 'Ana', percentage: 60, extra: 100 },
        { name: 'Luis', percentage: 40, extra: 0 }
      ]
    })
    const state = store.getState()
    expect(state.result.ok).toBe(true)
    expect(state.persons[0].name).toBe('Ana')
  })

  test('derived annual rate', () => {
    const state = store.getState()
    const annual = (1 + state.params.monthlyRate) ** 12 - 1
    expect(annual).toBeCloseTo(0.1268, 3)
  })
})
