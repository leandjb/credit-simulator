# Design System — Family Credit Simulator

## Color Strategy

Dark ground (`#0f172a`, slate-900) with frosted translucent panels. Accent is sky-400 (`#38bdf8`) for interactive elements and KPI values. Semantic colors: warning amber (`#fbbf24`), error red (`#f87171`), success green (`#34d399`). Text is slate-100 (`#f1f5f9`) with muted slate-400 (`#94a3b8`) for secondary labels.

## Typography

- **Display/UI:** Inter (system-ui fallback) — clean, neutral, high legibility at small sizes
- **Data/Values:** JetBrains Mono (ui-monospace fallback) — tabular figures for currency amounts and percentages
- Scale: hero title `clamp(1.75rem, 4vw, 3rem)`, section headings 1.25rem, panel headings 0.85rem uppercase tracked, body 0.95rem, labels 0.75–0.85rem

## Glassmorphism

Frosted panels (`.glass-panel`) with `backdrop-filter: blur(16px)` over the dark ground. Surface color is `rgba(255,255,255,0.06)` with `rgba(255,255,255,0.12)` border. Fallback for browsers without backdrop-filter: solid `rgba(15,23,42,0.85)`. Border radius 20px (large), 12px (medium), 6px (small).

## Layout

CSS Grid. Desktop: sidebar (320px) + chart area (1fr), two rows. Mobile (<768px): single column, stacked. Max width 1400px, centered. Chart area minimum height 400px (300px mobile). Summary KPIs flex-wrap below chart.

## Components

| Component | Purpose | Key tokens |
|---|---|---|
| `.glass-panel` | All major sections | surface, border, blur, radius-lg |
| `.person-card` | Per-person config | surface-3, border, radius-md |
| `.kpi-card` | Summary metrics | accent color, mono font |
| `.currency-btn` | USD/COP toggle | accent active state |
| `.warning-banner` | Validation feedback | warning color, 15% opacity bg |
| `.toast` | Transient notifications | fixed bottom-right, slide-in animation |
| `.param-group` | Slider + input pair | accent range thumb, mono number input |

## Spacing

4px base unit. Scale: xs=4, sm=8, md=16, lg=24, xl=32, 2xl=48.

## Motion

Toasts slide in from bottom (0.3s ease). Currency buttons transition background/color (0.15s ease). No other animation — chart redraws are instant (rAF-coalesced).
