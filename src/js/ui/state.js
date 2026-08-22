/**
 * Single store with pub/sub.
 * Holds params, persons, currency. Recomputes engine on every update.
 */

import { simulate } from '../engine/simulation.js'

const DEFAULT_STATE = {
  params: {
    amount: 100000,
    term: 60,
    monthlyRate: 0.01
  },
  persons: [
    { name: 'Person 1', percentage: 50, extra: 0 },
    { name: 'Person 2', percentage: 50, extra: 0 }
  ],
  currency: 'USD',
  result: null
}

export function createStore () {
  let state = JSON.parse(JSON.stringify(DEFAULT_STATE))
  let lastValidResult = null
  const subscribers = new Set()

  function getState () {
    return state
  }

  function getLastValidResult () {
    return lastValidResult
  }

  function update (patch) {
    state = { ...state, ...patch }

    if (patch.params || patch.persons) {
      const simParams = {
        amount: state.params.amount,
        term: state.params.term,
        monthlyRate: state.params.monthlyRate,
        persons: state.persons
      }

      const result = simulate(simParams)

      if (result.ok) {
        state = { ...state, result }
        lastValidResult = result
      } else {
        state = { ...state, result }
      }
    }

    notify()
  }

  function subscribe (fn) {
    subscribers.add(fn)
    return () => subscribers.delete(fn)
  }

  function notify () {
    for (const fn of subscribers) {
      fn(state)
    }
  }

  // Initial computation
  update({ params: state.params, persons: state.persons })

  return { getState, getLastValidResult, update, subscribe }
}
