## Purpose

Defines the marketing shell that wraps the simulator: hero, value copy, and page structure in English, presenting the simulator as the landing page's centerpiece.

## ADDED Requirements

### Requirement: Landing page structure
The landing page SHALL consist of a hero section whose primary content is the embedded simulator, followed by brief value-proposition sections (how it works, why simulate together). All copy SHALL be in English.

#### Scenario: Page loads
- **WHEN** a visitor opens the page
- **THEN** the hero renders with a headline, a short subheadline, and the live simulator visible without scrolling on desktop viewports

### Requirement: Simulator as hero centerpiece
The hero SHALL embed the interactive simulator directly; no section, link, or flow SHALL gate the visitor's first interaction with it behind a form, signup, or click-through.

#### Scenario: Immediate interaction
- **WHEN** the visitor lands
- **THEN** the simulator's sliders are interactive immediately and moving any slider updates the chart in place

### Requirement: Value copy
The page SHALL include concise sections explaining: shared-screen family analysis, per-person contribution clarity, and the payoff/interest story the chart tells. Copy SHALL make no claims about financial advice, lending services, or rates.

#### Scenario: Value sections render
- **WHEN** the visitor scrolls past the hero
- **THEN** value sections render with headlines and one-to-two sentence explanations, and no fabricated testimonials, customer counts, or rate claims

### Requirement: Visual consistency with the simulator
The landing shell SHALL share the same glassmorphism visual language, typography, and color system as the simulator panels, so the page reads as one continuous surface.

#### Scenario: Consistent styling
- **WHEN** the page renders top to bottom
- **THEN** hero, simulator panels, and value sections use the same glass panel treatment, type scale, and palette
