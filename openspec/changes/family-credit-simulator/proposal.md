## Why

Families deciding whether to take a loan together have no simple tool to answer "what does this credit cost us over time, and how does each of us contribute?" Bank calculators show one anonymous monthly payment; spreadsheets require financial literacy the family may not have. A shared-screen simulator with per-person contributions turns an opaque loan decision into a visual, collaborative conversation.

## What Changes

- Build a responsive landing page (single page) whose centerpiece is an interactive credit simulator for families, in vanilla HTML/CSS/JS only (no frameworks, no chart libraries).
- Add a parameter panel (sidebar) with sliders + inputs: loan amount, term in months, monthly/annual interest rate (linked), number of persons, per-person percentage split, and optional per-person extra monthly payment.
- Implement a Price (French) amortization engine that produces the full schedule, per-person shares, and the real payoff month when extra payments shorten the term (or a warning when capacity cannot amortize the loan).
- Render a large dynamic SVG chart that redraws as parameters change: declining balance curve, cumulative-paid curve, the equilibrium point where cumulative paid equals remaining balance, and per-person contribution bands.
- Show a headline summary: monthly payment, equilibrium month, real payoff month ("paid off in M months instead of N"), and total interest.
- Support currency switching between USD and COP (formatting only, no FX conversion) with locale-correct number formatting.
- Apply a glassmorphism visual style (frosted panels over a layered background), designed with the impeccable workflow.
- Cover all engine functions and UI behaviors with Jest tests.

## Capabilities

### New Capabilities

- `credit-simulation`: The amortization engine — Price-system schedule generation, per-person split with extra payments, equilibrium-point and real-payoff computation, interest totals, and input validation (rate conventions, percentages, term limits).
- `simulator-ui`: The interactive single-page interface — parameter panel with sliders/inputs, dynamic SVG chart with equilibrium marker, KPI summary cards, per-person cards, currency switcher, and glassmorphism styling with responsive layout for shared-screen use.
- `landing-page`: The marketing shell around the simulator — hero, value copy, and page structure in English, styled consistently with the simulator.

### Modified Capabilities

(none — greenfield project, no existing specs)

## Impact

- **New code**: Entire project is greenfield; new `index.html`, CSS, and JS modules under the repo root (layout defined in design.md).
- **Dependencies**: Adds `jest` (devDependency) for testing; no runtime dependencies (vanilla JS/CSS/HTML, hand-rolled SVG chart). Existing `standard` linter continues to apply.
- **Tooling**: Jest must run against ES modules (`"type": "module"` is set in package.json) — configuration recorded in design.md.
- **Design system**: A DESIGN.md visual contract will be established during implementation via the impeccable workflow (glassmorphism brief); PRODUCT.md captured during init informs the product context.
