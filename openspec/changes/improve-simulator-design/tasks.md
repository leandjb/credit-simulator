## 1. Layout Restructure

- [x] 1.1 Move `#persons-section` out of `<aside class="panel">` in index.html into a new `<section class="persons glass-panel" id="persons-section">` after `.summary`, and verify the DOM structure matches the spec (params sidebar, chart, summary, persons band)
- [x] 1.2 Update `.simulator` grid in main.css: sidebar spans rows 1–2, persons section spans columns 1–2 in row 3; verify desktop layout renders correctly
- [x] 1.3 Update responsive breakpoint (768px): stacking order params → chart → summary → persons; verify mobile layout

## 2. Button Styles

- [x] 2.1 Add `.person-card__add` CSS (dashed border, ghost surface, full-width, accent hover) and verify it renders as a styled dashed ghost button
- [x] 2.2 Add `.person-card__distribute` CSS (solid ghost matching `.currency-btn`) and verify it renders consistently
- [x] 2.3 Add `.person-card__remove` CSS (compact icon button, transparent, error-red hover) and verify it renders as a styled × button

## 3. Percent-Unit Rate Controls

- [x] 3.1 Add `toState`/`fromState` transforms to rate PARAM_DEFS in panel.js (monthly: ÷100/×100; annual: monthlyFromAnnual(v/100) / annualFromMonthly×100) and verify slider/input show percent values (e.g. 25 not 0.25)
- [x] 3.2 Update rate slider min/max/step to percent units (monthly 0–10 step 0.01; annual 0–200 step 0.1) and verify slider range matches spec
- [x] 3.3 Update rate input validation to work in percent units and verify out-of-range percent values are flagged correctly

## 4. Currency-Aware Amount Ranges

- [x] 4.1 Export `CURRENCY_RANGES` constant from currency.js (USD: 5k–2M step 1k; COP: 1M–2B step 1M) and verify constants are accessible
- [x] 4.2 Update panel.js amount PARAM_DEF to read bounds from `CURRENCY_RANGES` based on current currency and verify slider min/max/step update on currency switch
- [x] 4.3 Add amount clamping logic: on currency switch, if amount outside new range, clamp to nearest bound and verify the amount updates visibly

## 5. Real-Time Input Events

- [x] 5.1 Switch person-card inputs (name, percentage, extra) from `change` to `input` event and verify state updates on every keystroke
- [x] 5.2 Switch parameter numeric inputs to `input` event with silent validation (no `reportValidity` on intermediate invalid values) and verify no toast/validity popup during typing
- [x] 5.3 Split `renderCards` into structural rebuild (on persons reference change) and value-only update (on result change) and verify cards do not rebuild on rate slider drag

## 6. Focus Preservation

- [x] 6.1 Add focus capture before structural rebuild: record `activeElement` card index + field class + selectionStart/End and verify focus metadata is captured
- [x] 6.2 Add focus restore after structural rebuild: find matching element, call `focus()` + `setSelectionRange()` and verify caret position is preserved after add/remove person

## 7. Live Per-Person Contribution

- [x] 7.1 Add a `.person-card__contribution` element to each card showing `installment × pct / 100 + extra` formatted in active currency and verify it displays the correct amount
- [x] 7.2 Update contribution values on every state change (part of value-only update) and verify contribution updates when percentage or extra changes

## 8. Tests

- [x] 8.1 Update panel.test.js: rate slider/input show percent values, annual rate input accepts percent (25 → monthlyRate ~0.0187), amount bounds adapt to currency and verify all panel tests pass
- [x] 8.2 Update person-cards.test.js: add test for live contribution display, verify `input` events fire on keystroke, verify focus preservation after structural rebuild and verify all person-card tests pass
- [x] 8.3 Run full test suite (`npm test`) and verify all tests pass
- [x] 8.4 Add test for currency switch clamping: switching USD→COP with amount=100,000 clamps to 1,000,000 and verify slider/input reflect new value
