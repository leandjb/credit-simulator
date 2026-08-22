## Context

The project has no README. The chart uses `Math.min(maxMonth, 12)` for x-axis labels — with 3 months, it shows 4 labels (0–3), which is fine. The CSS is functional dark glassmorphism but lacks depth and polish. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- README.md (English) and README.es.md (Spanish) with installation, usage, and financial concepts
- Chart renders clearly with any term (verified for 3, 5, 7 months)
- CSS achieves modern glassmorphism: gradient background, glass depth, typography hierarchy

**Non-Goals:**
- Engine changes (math is correct)
- New features beyond documentation and polish
- Chart legend (per-person colors are shown in the bands and person cards)

## Decisions

### README structure

**Decision:** Both READMEs follow identical structure: project description, installation (pnpm), usage guide (parameters, persons, currency, chart), key concepts (amortization, equilibrium, EA rate, extra payments). Spanish version is natural translation, not machine-translated.

### Chart short-term handling

**Decision:** The chart already handles short terms correctly in code (`Math.min(maxMonth, 12)` for labels). Verification task: test with 3, 5, 7 months and confirm axis labels, curve visibility, and band rendering. If issues found, fix them (e.g., minimum band height, label deduplication).

### CSS polish approach

**Decision:** Refinement, not redesign. Keep the dark glassmorphism identity. Add:
- Background: radial gradient blobs (dark blue, deep purple) for depth
- Glass panels: inner glow via `box-shadow: inset 0 1px 0 rgba(255,255,255,0.1)`
- Typography: bolder headings (700–800), clearer label/value contrast
- KPI cards: larger values, subtle accent glow
- Person cards: hover lift effect
- Hero: gradient text on title

## Risks / Trade-offs

**[Risk] Gradient background may affect readability** → Mitigation: keep gradients subtle, test WCAG contrast.

**[Risk] Chart fixes may introduce regressions** → Mitigation: verify with existing test suite after changes.
