## MODIFIED Requirements

### Requirement: Dynamic chart redraw
The UI SHALL render a large SVG chart that redraws whenever any parameter changes. The chart SHALL show the declining balance curve, the cumulative-paid curve, and stacked per-person contribution bands in distinct colors, with labeled axes (months, currency) and a legend. When the term is fewer than 8 months, the chart SHALL still render readable axis labels, visible curves, and visible per-person bands.

#### Scenario: Parameter change redraws
- **WHEN** any slider, input, or per-person value changes
- **THEN** the chart redraws within the same interaction frame with no full-page reload

#### Scenario: Short-term loan renders clearly
- **WHEN** the term is set to 3 months
- **THEN** the x-axis shows all month labels (0–3), the balance and cumulative curves are visible, and per-person bands are rendered

#### Scenario: Per-person bands
- **WHEN** 3 persons are configured at 50/30/20
- **THEN** the contribution area shows three visually distinct bands whose widths match each person's share, and the legend names each person with their color

### Requirement: Glassmorphism visual style
The UI SHALL use a glassmorphism style: frosted translucent panels (backdrop blur) over a layered colored background, soft borders, and depth-consistent shadows. The background SHALL use a gradient mesh or radial gradient for depth. Glass panels SHALL have visible inner glow or layered borders. Typography SHALL use clear hierarchy with bolder headings. All text SHALL maintain WCAG AA contrast against the blurred background.

#### Scenario: Style application
- **WHEN** the page renders
- **THEN** panels show backdrop-blur translucency over a gradient background, headings are visually distinct from labels, and text remains readable at AA contrast
