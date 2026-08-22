## Why

The project has no documentation — new users don't know how to install, use, or understand the simulator. The chart rendering has not been verified with short-term loans (< 8 months), which may produce sparse or unreadable visuals. The CSS design is functional but lacks the polish of a modern glassmorphism aesthetic.

## What Changes

- Create `README.md` (English) and `README.es.md` (Spanish) with installation, usage, and credit/loan concept explanations
- Verify and fix chart rendering with few data points (< 8 months): axis labels, curve visibility, per-person bands, equilibrium marker
- Polish CSS: background depth, glass panel effects, typography hierarchy, KPI card emphasis, person card hover states

## Capabilities

### New Capabilities

- `readme`: English and Spanish documentation covering installation, usage, loan concepts (amortization, equilibrium point, EA rate), and chart interpretation

### Modified Capabilities

- `simulator-ui`: Chart rendering must handle short-term loans gracefully; CSS must achieve modern glassmorphism quality

## Impact

- New files: `README.md`, `README.es.md`
- Modified files: `src/js/ui/chart.js`, `src/css/main.css`, `src/css/tokens.css`, `src/css/glass.css`
- No engine changes, no dependency changes
