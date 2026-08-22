## Context

The simulator is a vanilla HTML/CSS/JS single-page app with a glassmorphism design system (dark ground, frosted panels, sky-400 accent). The math engine is currency-agnostic and needs no changes — all modifications are UI-layer. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Person cards below the chart in a full-width band, showing live per-person monthly contributions
- Rate inputs in percent units (25 not 0.25) with bidirectional sync preserved
- Currency-aware amount ranges supporting at least 1,000,000,000 COP
- Styled person-management buttons matching the glass design system
- Real-time updates on every keystroke with focus preservation

**Non-Goals:**
- Currency conversion on switch (existing spec: SHALL NOT convert)
- COP decimal places in display (keep integer per Colombian convention)
- Engine changes (amount has no upper bound in validation; rate cap 10% monthly already covers 200% EA)
- Removing the persons-count stepper (existing spec requires it)

## Decisions

### Layout: persons section as full-width band below chart+summary

**Decision:** Move `#persons-section` out of `<aside class="panel">` into a new `<section class="persons glass-panel">` after `.summary`. Grid: sidebar spans rows 1–2 (params+currency alongside chart+summary); persons band spans columns 1–2 in row 3.

```
┌──────────────┬──────────────────────────┐
│ PARAMS       │        CHART             │ row 1
│              ├──────────────────────────┤
│ CURRENCY     │       SUMMARY KPIs       │ row 2
├──────────────┴──────────────────────────┤
│ PERSONS (full width, card grid)         │ row 3
└─────────────────────────────────────────┘
```

**Why:** Maximum horizontal room for cards (up to 1400px → 6 cards in a row). Sidebar stays focused on parameters. "Below the graph" requirement satisfied on all viewports.

**Alternative considered:** Persons in sidebar with horizontal scroll — rejected (cramped, defeats "analyze in real-time").

### Card layout: CSS grid with auto-fit columns

**Decision:** Person cards container uses `display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))`. Each card is a vertical stack (name, percentage, extra, live contribution). "+ Add Person" is a dashed-border ghost button filling one grid cell.

**Why:** Responsive without media queries. Cards wrap naturally. Dashed cell = universal "add slot" affordance.

### Rate controls: percent-unit transforms in PARAM_DEFS

**Decision:** Rate PARAM_DEFS use `toState(uiValue)` and `fromState(stateValue)` transforms to convert between percent-unit UI values and decimal state values. Monthly: `toState = v => v / 100`, `fromState = s => s.params.monthlyRate * 100`. Annual EA: `toState = v => monthlyFromAnnual(v / 100)`, `fromState = s => annualFromMonthly(s.params.monthlyRate) * 100`. Slider min/max/step in percent units. State remains decimal.

**Why:** Clean separation — engine untouched, UI layer handles display. Bidirectional sync via existing `rates.js` functions.

**Ranges:**
| Param | UI min | UI max | UI step |
|---|---|---|---|
| Monthly % | 0 | 10 | 0.01 |
| Annual EA % | 0 | 200 | 0.1 |

### Currency-aware amount ranges

**Decision:** Export `CURRENCY_RANGES` from `src/js/ui/currency.js`. Panel.js reads bounds on currency change and updates slider min/max/step. On currency switch, if amount falls outside new range, clamp to nearest bound.

**Ranges:**
| Currency | Min | Max | Step |
|---|---|---|---|
| USD | 5,000 | 2,000,000 | 1,000 |
| COP | 1,000,000 | 2,000,000,000 | 1,000,000 |

**Why:** USD mortgage ceiling ≠ COP ceiling. Clamping keeps slider/input/state consistent (no desync). The clamp is visible in the UI — not a silent conversion.

### Real-time updates: input events + structural/value render split

**Decision:**
1. Person-card inputs (name, percentage, extra) fire on `input` event instead of `change`.
2. Parameter numeric inputs fire on `input` when value is valid; invalid intermediates show error styling silently (no `reportValidity` bubble).
3. Split `renderCards` into structural rebuild (when `state.persons` reference changes) and value-only update (on every result change). Structural rebuild captures `document.activeElement` card index + field + selection before rebuild, restores after.

**Why:** Structural rebuild on every rate tick is wasteful and destroys focus. Splitting gives real-time feel without focus loss. Focus capture/restore handles the structural case (add/remove person).

### Button styles: extend currency-btn pattern

**Decision:** Three new button classes reusing `.currency-btn` tokens:
- `.person-card__add`: full-width, dashed border (`border-style: dashed`), ghost surface, accent text on hover
- `.person-card__distribute`: solid ghost (matches `.currency-btn` exactly), inline in toolbar
- `.person-card__remove`: compact icon button (24×24), transparent surface, error-red hover

**Why:** Consistent with existing design system. Dashed = "add slot" affordance. Remove = destructive color hint.

## Risks / Trade-offs

**[Risk] Intermediate invalid values during typing** → Mitigation: suppress `reportValidity` on `input` events; only show border error styling. Full validation reporting stays on `change` (blur/enter).

**[Risk] Focus restore after structural rebuild may race with browser** → Mitigation: synchronous focus restore after DOM rebuild; guard with null-checks on element lookup (element may not exist if card was removed). Works reliably because the DOM is updated before `restoreFocus` is called.

**[Risk] COP amount clamping surprises user on currency switch** → Mitigation: the clamp is visible (slider and input update immediately). Alternative (allow out-of-range value) causes slider/input desync — worse UX.

**[Trade-off] 200% EA slider max vs typical Colombian rates (~25%)** → The interesting range is 10–35% EA. Slider is usable but coarse in that band. Users who need precision use the number input. Narrowing max to 60% would improve slider granularity in the typical band but excludes high-rate microfinance. Keeping 200% for inclusivity.

## Open Questions

- Should the default annual rate change from ~12.68% EA (current 1% monthly) to 25% EA for Colombian context? (Minor — can adjust `DEFAULT_STATE` in state.js.)
