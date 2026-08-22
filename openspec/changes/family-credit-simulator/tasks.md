## 1. Project scaffolding

- [x] 1.1 Create `index.html` skeleton (hero shell, panel/chart/summary regions, `<script type="module" src="src/js/ui/main.js">`) and the `src/css/` + `src/js/{engine,ui}` + `__tests__/` directories; verify `index.html` opens without console errors
- [x] 1.2 Add `jest` + `jest-environment-jsdom` devDependencies and the pinned ESM test script (`node --experimental-vm-modules node_modules/jest/bin/jest.js`) with `jest.config.js` (node env for engine, jsdom via docblock for UI); verify a placeholder test passes via `pnpm test`

## 2. Engine (pure modules, TDD)

- [x] 2.1 Implement `src/js/engine/rates.js` (monthly ↔ effective annual, exact inverses) and `__tests__/rates.test.js` covering both directions, 0% rate, and round-trip tolerance; verify tests pass
- [x] 2.2 Implement `src/js/engine/validate.js` (amount > 0, term 1–360, monthly rate 0–10%, persons 1–6, extras ≥ 0, percentages sum 100, per-field error messages) and `__tests__/validate.test.js` covering each invalid case plus boundary values (term = 360 accepted); verify tests pass
- [x] 2.3 Implement `src/js/engine/simulation.js` — Price schedule (equal installments, interest on remaining balance, zero-rate case), per-person percentage split, extra payments with prorated final month, 360-iteration safety cap, real payoff month, months saved — and `__tests__/simulation.test.js` covering the standard schedule, zero interest, split math, early payoff, proration, and degenerate-input error; verify tests pass
- [x] 2.4 Add equilibrium-point + summary metrics (cumulative paid vs. remaining balance, first crossing or explicit absence; installment, totals, payoff, months saved) to `simulation.js` with tests for exists / never-reached / with-extras scenarios; verify tests pass

## 3. State and formatting

- [x] 3.1 Implement `src/js/ui/state.js` (single store, `update()` recompute via `simulate()`, `subscribe()`, last-valid-result retention on validation failure) and `__tests__/state.test.js` covering update-notify, frozen-chart-on-invalid-input, and derived annual-rate view; verify tests pass
- [x] 3.2 Implement `src/js/engine/format.js` (cached `Intl.NumberFormat` for USD 2-dec / COP 0-dec, shared number-to-string helper) and `__tests__/format.test.js` covering both currencies and symbol placement; verify tests pass

## 4. Parameter panel and persons

- [x] 4.1 Implement slider+input parameter controls (amount, term, monthly rate, annual rate derived view) in `src/js/ui/panel.js` with two-way sync, out-of-range flagging + toast, and `aria-valuetext` currency labels; verify by dragging each slider and typing each input in the browser and via jsdom wiring tests in `__tests__/panel.test.js`
- [x] 4.2 Implement person cards (name, percentage, extra payment, add/remove 1–6, "distribute equally" action, running sum indicator + blocking banner when ≠ 100%) in `panel.js`; verify add/remove/redistribute flows and the 95% and 110% banner cases in `__tests__/panel.test.js`

## 5. Chart

- [x] 5.1 Implement `src/js/ui/chart.js` SVG scaffold (viewBox, labeled month/currency axes, legend, glass-compatible styling hooks) rendering balance and cumulative-paid curves from a schedule; verify curves appear correctly for a known schedule via jsdom test in `__tests__/chart.test.js`
- [x] 5.2 Add per-person stacked contribution bands (distinct colors, legend names) and the equilibrium marker with month label, plus the no-equilibrium state; verify band proportions and marker placement/absence in `__tests__/chart.test.js`
- [x] 5.3 Add rAF coalescing in `main.js` (dirty flag + one render per frame) and verify rapid slider drags produce a single recompute per frame and no full-page reload; check via manual drag test and a jsdom test asserting render calls are batched

## 6. Summary, currency, feedback, config

- [x] 6.1 Implement KPI summary cards (`src/js/ui/summary.js`: installment, payoff "47 of 60 — 13 saved", equilibrium month, total interest) formatted in active currency; verify card contents for the months-saved scenario in `__tests__/summary.test.js`
- [x] 6.2 Implement the USD/COP switcher (formatters only, no conversion, COP no-decimals, explicit not-converted label) and re-render on switch; verify via jsdom test that values reformat and state amounts are unchanged
- [x] 6.3 Implement `src/js/ui/toast.js` (auto-dismissing toasts, inline banners in the offending panel, chart frozen at last valid state); verify banner shows on invalid percentage sum and toast auto-dismisses in `__tests__/toast.test.js`
- [x] 6.4 Implement `src/js/ui/config.js` initial configuration panel (persons 1–6, names, currency) applying to the simulator on start; verify a 4-person COP start yields 4 cards + COP formatting in jsdom test

## 7. Landing shell and visual world

- [x] 7.1 Run the impeccable new-work flow on the hero+simulator surface to establish the glassmorphism visual contract (DESIGN.md + `src/css/tokens.css` custom properties); verify DESIGN.md exists and tokens are consumed by the CSS
- [x] 7.2 Build the landing shell: hero with headline/subheadline and embedded simulator above the fold on desktop, value sections (shared-screen analysis, per-person clarity, payoff story — no financial-advice or rate claims), all in English; verify copy review against `landing-page` spec
- [x] 7.3 Apply glassmorphism across shell + simulator (`src/css/glass.css` panel recipes, backdrop blur with `@supports` fallback, AA contrast, TV-distance type scale) and responsive layout (side-by-side ≥ 768px, stacked below); verify at 320px, 768px, 1280px, and 1920px widths in the browser
- [x] 7.4 Add a11y chart fallback (`role="img"` + aria-label + visually-hidden month/payment table) and labeled sliders; verify with a screen-reader pass or axe-style manual check that all controls have accessible names

## 8. Quality gates

- [x] 8.1 Run full `pnpm test` (all engine + UI suites green) and `npx standard` (no lint errors); fix any findings
- [x] 8.2 Run `node .opencode/skills/impeccable/scripts/detect.mjs --json index.html src/` once over the finished UI and fix everything it reports in one batch; re-run at most once to confirm clean
- [x] 8.3 Final manual sweep in the browser: drag every slider, edit every input, add/remove persons, break the percentage sum, switch currencies, resize across breakpoints; verify behavior matches the `simulator-ui` spec scenarios
