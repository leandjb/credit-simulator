## Context

Greenfield repo: empty except tooling (`package.json` with `"type": "module"`, pnpm, `standard` linter, OpenSpec, impeccable). No framework, no build step — the constraint is vanilla HTML/CSS/JS plus Jest, per the brief and proposal. The impeccable init captured product truth in PRODUCT.md; the visual world (glassmorphism) will be established during implementation via impeccable new-work, not in this document.

## Goals / Non-Goals

**Goals:**

- Pure static site: open `index.html`, everything works. No bundler, no dev server required, no runtime dependencies.
- Engine/UI separation: the amortization math is a pure, dependency-free ES module importable by Jest with no DOM.
- Hand-rolled SVG chart that stays smooth under slider dragging.
- DRY/KISS: small module surface, one-way data flow, no state library.

**Non-Goals:**

- No FX conversion between USD and COP (formatting only, per spec).
- No persistence (no localStorage of simulations) — v1 keeps state in memory.
- No SAC/Price toggle (Price only — decided in interview).
- No mobile-first native app or PWA install flow.
- No debt-capacity scoring or affordability advice logic.

## Decisions

### D1: File layout — flat `src/` with `index.html` at root

```
index.html
src/
  css/        main.css, tokens.css (design tokens), glass.css (panel recipes)
  js/
    engine/   simulation.js   (schedule, equilibrium, summary — pure)
              validate.js     (input validation — pure)
              rates.js        (monthly <-> effective annual — pure)
              format.js       (currency/Intl formatting — pure)
    ui/        state.js       (single store + pub/sub)
               panel.js       (sliders, inputs, person cards)
               chart.js       (SVG builder + diff update)
               summary.js     (KPI cards)
               toast.js       (banners/toasts)
               config.js      (initial configuration panel)
               main.js        (bootstrap, wiring)
__tests__/     one test file per engine module + UI wiring tests
```

**Why:** pure modules live in `engine/` and never touch `document`; Jest imports them directly. UI modules each own one region of the DOM. Alternative (one big `app.js`) fails the Jest-verification requirement cleanly and violates DRY.

### D2: Chart rendering — hand-rolled SVG, full rebuild per update (no virtual diff)

The chart module receives the schedule + summary and rebuilds its SVG path elements on each update. Sliders use `input` events (fire per pixel), so updates must be cheap: for a 360-month schedule this is ~360-point path strings and a handful of elements — microseconds. A D3-style enter/update/exit diff was considered and rejected: complexity without measurable benefit at this data size.

**Why hand-rolled SVG over canvas:** crisp at any DPI, CSS-animatable (marker transitions), and glassmorphism layering (blur filters, gradients) composites naturally with the page. Canvas would isolate the chart from the page's visual system.

### D3: Performance guard — `requestAnimationFrame` coalescing

Slider `input` handlers mark state dirty and schedule one rAF-flushed render, so a fast drag produces one render per frame, not one per event. Engine recompute (360 iterations max) happens inside that same frame. Debounce was rejected: it adds visible lag to the "dynamic graph" feel the brief demands.

### D4: State — single store with pub/sub

`state.js` holds one frozen-ish object (`params`, `persons`, `currency`), exposes `getState()`, `update(patch)`, and `subscribe(fn)`. Every mutation flows through `update()`, which recomputes the engine result and notifies subscribers. This is the KISS/DRY answer to "who owns truth" without a framework.

### D5: Engine purity and error handling — result objects, not exceptions

`simulate(params)` returns `{ ok: true, schedule, summary, equilibrium }` or `{ ok: false, errors: [{ field, message }] }`. **Why:** the UI freezes the chart at the last valid state on invalid input (spec: "chart freezes at last valid state"); keeping the last good result is trivial when errors are values. Thrown exceptions across the rAF boundary would also lose stack context in Jest DOM tests.

### D6: Rate linking — effective annual convention, single source of truth

`rates.js` holds `monthlyFromAnnual(a) = (1+a)^(1/12) - 1` and `annualFromMonthly(m) = (1+m)^12 - 1`. State stores the monthly rate only; the annual input is a derived view. Editing annual writes back through `monthlyFromAnnual`. Round-trip drift is bounded by floating point (< 1e-12) and covered by a test.

### D7: Extra payments — applied post-installment, per-person attribution

Each month: installment splits by percentage; extras are added to principal reduction. Per-person monthly total = share + extra. The schedule loop runs to balance ≤ 0 with a hard cap at 360 iterations (validation already bounds term, but the cap is defense in depth for the "never amortizes" case). The real payoff month and months-saved come from this loop; the equilibrium point is computed on the same pass (cumulative paid vs. remaining balance), so the engine does one pass total.

### D8: Currency — `Intl.NumberFormat`, currency as display concern only

`format.js` builds two cached formatters (USD 2-decimals, COP 0-decimals). Switching currency changes formatters and re-renders; no engine recompute (values are currency-agnostic — the loan amount is "in whatever currency you're thinking in"). Labels state this explicitly ("amounts shown in COP, not converted").

### D9: Jest with native ESM via `--experimental-vm-modules`

`"type": "module"` is already set, and the code is pure ESM. Jest config: `testEnvironment: 'node'` for engine tests, `testEnvironment: 'jsdom'` for UI wiring tests, run via `node --experimental-vm-modules node_modules/jest/bin/jest.js` (pinned in the `test` script — no Babel, no CommonJS transpilation). **Alternative rejected:** Babel transform adds a dependency and a build layer to a no-build project. Jest (not Vitest) because the brief mandates it.

### D10: Visual world — established during implementation, not here

The glassmorphism brief is binding, but palette, type, and specific glass recipes belong to the impeccable new-work flow (`/impeccable` on the hero+simulator surface), which runs at the start of implementation and writes DESIGN.md. This design fixes only the technical enabler: `tokens.css` holds CSS custom properties so the visual contract has one place to live.

### D11: A11y floor for the shared screen

Sliders are native `<input type="range">` with programmatically linked `<label>`s and `aria-valuetext` carrying currency-formatted values; the chart has an offscreen data-table summary (`role="img"` + `aria-label`, plus a visually-hidden table of month/payment pairs for screen readers). Contrast AA is a spec requirement; the detector (`impeccable detect`) runs as the finish gate.

## Risks / Trade-offs

- [Native ESM Jest flag is quasi-experimental] → Pin the exact invocation in the `test` script; document Node version requirement (≥ 20). If it breaks on a Node upgrade, the fallback is one small Babel config — contained to test tooling.
- [Full SVG rebuild on every frame could jank on low-end TVs] → Data is bounded (≤ 361 points). If profiling shows jank, downsample path points to viewport width before building the `d` string — a contained change inside `chart.js`.
- [Backdrop-blur on large chart panel is GPU-expensive on old devices] → Limit blur radius on the chart panel; provide `@supports not (backdrop-filter)` fallback with solid translucent background.
- [Percentage redistribution UX (auto-rebalance vs manual) can surprise users] → Keep it explicit: editing one person's % only flags the sum; an explicit "distribute equally" action rebalances. No silent auto-fixes.
- [COP without decimals loses cent-level precision in per-person shares] → Engine computes at full precision; only display truncates. Rounding is a formatting concern, never a math concern.

## Open Questions

- Exact glassmorphism palette and typography — intentionally deferred to the impeccable new-work pass during implementation (D10).
- Whether the initial configuration panel (spec: MAY) ships in v1 or the simulator opens directly with sensible defaults — decidable during implementation without touching specs; the panel module (`config.js`) is isolated so either answer is a small change.
