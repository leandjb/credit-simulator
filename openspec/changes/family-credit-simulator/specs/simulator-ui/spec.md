## Purpose

Defines the interactive single-page simulator interface: the parameter panel with sliders, the dynamic SVG chart with equilibrium marker, the KPI summary, per-person cards, the currency switcher, and the glassmorphism responsive layout for shared-screen family use.

## ADDED Requirements

### Requirement: Parameter panel with synced sliders and inputs
The UI SHALL provide a parameter panel with a slider and a numeric input for each continuous parameter (loan amount, term in months, monthly interest rate, annual interest rate), synchronized so that editing either control updates the other and the simulation. Discrete parameters (number of persons) SHALL use a stepper or dropdown.

#### Scenario: Slider edits amount
- **WHEN** the user drags the amount slider to 250,000
- **THEN** the amount input shows 250,000 and the chart and summary update

#### Scenario: Typing an annual rate
- **WHEN** the user types 24% in the annual rate input
- **THEN** the monthly rate input and slider update to the effective-convention equivalent and the simulation recalculates

#### Scenario: Out-of-range typed value
- **WHEN** the user types a value outside the parameter's valid range into a numeric input
- **THEN** the input is visually flagged, a toast explains the valid range, and the last valid value remains in effect

### Requirement: Per-person configuration cards
The UI SHALL render one card per person with an editable name, a percentage control, and an extra-monthly-payment input. Percentages SHALL be visually reconciled: the UI SHALL display the running sum and indicate when it deviates from 100%, blocking the simulation update with a warning banner until corrected. Adding or removing persons SHALL be supported within the 1–6 range.

#### Scenario: Add a person
- **WHEN** the user increases persons from 2 to 3
- **THEN** a third card appears with a default name and an equal-share percentage, and percentages are redistributed to sum to 100%

#### Scenario: Broken percentage sum
- **WHEN** the user edits percentages so they sum to 95%
- **THEN** a warning banner shows the current sum and the chart stops updating until the sum returns to 100%

### Requirement: Dynamic chart redraw
The UI SHALL render a large SVG chart that redraws whenever any parameter changes. The chart SHALL show the declining balance curve, the cumulative-paid curve, and stacked per-person contribution bands in distinct colors, with labeled axes (months, currency) and a legend.

#### Scenario: Parameter change redraws
- **WHEN** any slider, input, or per-person value changes
- **THEN** the chart redraws within the same interaction frame with no full-page reload

#### Scenario: Per-person bands
- **WHEN** 3 persons are configured at 50/30/20
- **THEN** the contribution area shows three visually distinct bands whose widths match each person's share, and the legend names each person with their color

### Requirement: Equilibrium point marker
The chart SHALL project the equilibrium point (cumulative paid equals remaining balance) as a labeled marker at the intersection of the two curves, and the summary SHALL state how many months the family needs to pay off the total amount.

#### Scenario: Equilibrium displayed
- **WHEN** a schedule with a valid equilibrium point is rendered
- **THEN** a marker appears at the intersection with a tooltip or label showing the month number

#### Scenario: No equilibrium
- **WHEN** the engine reports no equilibrium point
- **THEN** no marker is drawn and the summary explains why

### Requirement: KPI summary cards
The UI SHALL display summary cards for monthly installment, real payoff month (with months saved versus nominal term), equilibrium month, and total interest, each formatted in the active currency.

#### Scenario: Months saved shown
- **WHEN** extras shorten a 60-month loan to 47 months
- **THEN** the payoff card reads "47 of 60 months — 13 saved"

### Requirement: Currency switching
The UI SHALL provide a USD/COP switcher. Switching SHALL change number formatting and currency symbols across all displayed values (KPIs, axes, per-person amounts) using locale-aware formatting; it SHALL NOT convert amounts between currencies. COP SHALL display without decimal places; USD SHALL display with two decimals.

#### Scenario: Switch to COP
- **WHEN** the user switches from USD to COP
- **THEN** all monetary values re-render with the COP symbol and no decimals, and underlying values are unchanged

### Requirement: Initial configuration panel
The UI MAY present a configuration panel (names, number of persons, currency) before the main simulation screen. Starting the simulation SHALL apply that configuration to the parameter panel and chart.

#### Scenario: Configure then simulate
- **WHEN** the user sets 4 persons and COP in the configuration panel and starts
- **THEN** the simulator opens with 4 person cards and COP formatting active

### Requirement: Toast and banner feedback
The UI SHALL surface validation problems as inline banners in the offending panel and transient confirmations as toasts; toasts SHALL auto-dismiss without blocking interaction.

#### Scenario: Validation banner
- **WHEN** percentages sum to 110%
- **THEN** a banner appears inside the person panel describing the error and the chart freezes at the last valid state

### Requirement: Responsive shared-screen layout
The UI SHALL be responsive: on wide screens the parameter panel and chart sit side by side; on narrow screens the panel stacks above the chart. Typography and chart elements SHALL remain readable at a distance (family gathered around one screen, including TV/projector use).

#### Scenario: Narrow viewport
- **WHEN** the viewport is under 768px wide
- **THEN** the layout stacks vertically with the chart full-width and all controls remain usable

### Requirement: Glassmorphism visual style
The UI SHALL use a glassmorphism style: frosted translucent panels (backdrop blur) over a layered colored background, soft borders, and depth-consistent shadows. All text SHALL maintain WCAG AA contrast against the blurred background.

#### Scenario: Style application
- **WHEN** the page renders
- **THEN** panels show backdrop-blur translucency over the background layer and text remains readable at AA contrast
