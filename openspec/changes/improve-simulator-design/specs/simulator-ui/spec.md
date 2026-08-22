## MODIFIED Requirements

### Requirement: Parameter panel with synced sliders and inputs
The UI SHALL provide a parameter panel with a slider and a numeric input for each continuous parameter (loan amount, term in months, monthly interest rate, annual interest rate), synchronized so that editing either control updates the other and the simulation. Discrete parameters (number of persons) SHALL use a stepper or dropdown. Rate controls SHALL display and accept values in percent units (e.g. 25 for 25% EA, 1.87 for 1.87% monthly); the internal state SHALL remain decimal. Amount ranges SHALL be currency-aware: USD min 5,000 max 2,000,000 step 1,000; COP min 1,000,000 max 2,000,000,000 step 1,000,000. When the user switches currency and the current amount falls outside the new range, the amount SHALL be clamped to the nearest bound.

#### Scenario: Slider edits amount
- **WHEN** the user drags the amount slider to 250,000
- **THEN** the amount input shows 250,000 and the chart and summary update

#### Scenario: Typing an annual rate in percent
- **WHEN** the user types 25 in the annual rate input
- **THEN** the monthly rate input and slider update to ~1.87 (the effective-convention equivalent in percent) and the simulation recalculates

#### Scenario: Out-of-range typed value
- **WHEN** the user types a value outside the parameter's valid range into a numeric input
- **THEN** the input is visually flagged, the browser's native validation message explains the valid range, and the last valid value remains in effect

#### Scenario: Currency switch clamps amount
- **WHEN** the user switches from USD to COP while the amount is 100,000
- **THEN** the amount is clamped to 1,000,000 (COP minimum) and the slider and input reflect the new value

#### Scenario: COP amount range
- **WHEN** the currency is COP
- **THEN** the amount slider ranges from 1,000,000 to 2,000,000,000 with step 1,000,000

### Requirement: Per-person configuration cards
The UI SHALL render one card per person in a full-width section below the chart and summary. Each card SHALL display an editable name, a percentage control, an extra-monthly-payment input, and a live computed monthly contribution (installment × percentage / 100 + extra) formatted in the active currency. Percentages SHALL be visually reconciled: the UI SHALL display the running sum and indicate when it deviates from 100%, blocking the simulation update with a warning banner until corrected. Adding or removing persons SHALL be supported within the 1–6 range. All person-management action buttons (+ Add Person, Distribute Equally, remove) SHALL be visually consistent with the glassmorphism design system.

#### Scenario: Add a person
- **WHEN** the user increases persons from 2 to 3
- **THEN** a third card appears with a default name and an equal-share percentage, and percentages are redistributed to sum to 100%

#### Scenario: Broken percentage sum
- **WHEN** the user edits percentages so they sum to 95%
- **THEN** a warning banner shows the current sum and the chart stops updating until the sum returns to 100%

#### Scenario: Live per-person contribution
- **WHEN** the simulation produces a monthly installment of 2,000,000 COP and a person has 50% share with 0 extra
- **THEN** that person's card displays a live contribution of 1,000,000 COP/month

#### Scenario: Styled action buttons
- **WHEN** the person cards section renders
- **THEN** the + Add Person button uses a dashed-border ghost style, Distribute Equally uses a solid ghost style, and the remove × uses a compact icon style — all matching the design system tokens

### Requirement: Responsive shared-screen layout
The UI SHALL be responsive: on wide screens the parameter panel and chart sit side by side; on narrow screens the panel stacks above the chart. The person cards section SHALL appear in a full-width band below the chart and summary on all viewports. Typography and chart elements SHALL remain readable at a distance (family gathered around one screen, including TV/projector use).

#### Scenario: Wide viewport
- **WHEN** the viewport is wider than 768px
- **THEN** the parameter panel sits in a 320px sidebar, the chart and summary fill the remaining width, and the person cards span the full width below

#### Scenario: Narrow viewport
- **WHEN** the viewport is under 768px wide
- **THEN** the layout stacks vertically: params, chart, summary, persons — and all controls remain usable

## ADDED Requirements

### Requirement: Real-time focus-preserving updates
All interactive inputs (person name, percentage, extra, parameter numeric inputs) SHALL update the simulation on every keystroke (`input` event). Re-renders triggered by state changes SHALL preserve the focus position, caret, and selection of the field currently being edited. Intermediate invalid values during typing SHALL be shown with error styling but SHALL NOT trigger validity popups or toasts.

#### Scenario: Typing percentage updates live
- **WHEN** the user types "5" then "0" in a percentage field
- **THEN** the simulation recalculates after each keystroke and the caret remains in the percentage field

#### Scenario: Focus preserved during re-render
- **WHEN** a state update triggers a re-render while the user is typing in a person's name field
- **THEN** the name field retains focus and the caret position is unchanged

#### Scenario: Intermediate invalid value
- **WHEN** the user clears the amount field to retype and the field is temporarily empty
- **THEN** the field shows error styling but no toast or validity popup appears
