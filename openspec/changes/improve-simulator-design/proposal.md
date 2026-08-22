## Why

The simulator's visual polish and input ergonomics lag its math engine: person-management buttons render as unstyled browser defaults, person cards are cramped in a 320px sidebar limiting real-time analysis, rate parameters are entered as raw decimals (0.0187) instead of the percentages users know (25% EA), and the amount slider caps at 10,000,000 — far below typical Colombian loan amounts (300M+ COP apartments).

## What Changes

- Style person management actions (+ Add Person, Distribute Equally, remove ×) to match the glass design system
- Move person cards from sidebar to full-width section below chart/summary
- Per-person cards show live computed monthly contribution (share + extra) updating in real time
- Rate inputs/sliders operate in percent units (monthly 0–10% step 0.01%; annual EA 0–200% step 0.1%); state remains decimal
- Currency-aware amount ranges: COP supports up to 2,000,000,000 (min 1,000,000, step 1,000,000); USD up to 2,000,000 (min 5,000, step 1,000)
- Real-time updates: inputs fire on `input` events; re-renders preserve focus and caret position

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `simulator-ui`: Parameter panel rate controls display in percent units with currency-aware amount ranges; person cards relocated to full-width section below chart with styled action buttons and live per-person contribution display; real-time focus-preserving updates across all inputs

## Impact

- `src/css/main.css` — new button styles, persons section layout, card grid
- `src/js/ui/panel.js` — percent transforms, currency-aware bounds, real-time events, focus preservation, live contribution
- `src/js/ui/currency.js` — currency-aware range constants, amount clamping on switch
- `index.html` — persons section moved out of sidebar
- `DESIGN.md` — updated component and layout documentation
- Tests in `__tests__/` — updated for new behavior
