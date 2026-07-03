## ADDED Requirements

### Requirement: Metric Counter Cards
The home page MUST include an impact dashboard section displaying exactly 4 metric counters in glassmorphism cards. Each counter MUST show: a large numeric value with suffix, a contextual label, and a 1-line micro-copy explaining the metric's significance.

#### Scenario: Four metrics with real data
- **WHEN** the impact dashboard renders
- **THEN** the 4 metrics display: (1) 350.000+ processos digitalizados, (2) R$ 300.000/ano de economia tributária, (3) R$ 25.000/mês de economia com FiscalizaPlus, (4) 78% de aumento na capacidade de processamento

#### Scenario: Glassmorphism card styling
- **WHEN** the impact dashboard renders
- **THEN** each metric card has `backdrop-filter: blur()`, semi-transparent background, and a subtle border glow in the accent color

### Requirement: Counter Animation
The numeric values MUST animate from 0 to their target value when the section enters the viewport. The animation MUST use Intersection Observer to trigger and MUST complete within 2 seconds. The animation MUST use `requestAnimationFrame` for smooth counting.

#### Scenario: Counters animate on viewport entry
- **WHEN** the user scrolls and the dashboard section crosses 20% viewport visibility
- **THEN** all 4 counters animate from 0 to their target values simultaneously

#### Scenario: Animation runs only once
- **WHEN** the counters have completed their animation
- **THEN** scrolling away and back does not re-trigger the animation

### Requirement: No-JS Fallback
The HTML markup MUST contain the final numeric values as `data-target` attributes AND as visible text content, so that users with JavaScript disabled see correct numbers.

#### Scenario: Disabled JS shows final values
- **WHEN** JavaScript is disabled
- **THEN** all 4 metric values are visible in their final state

### Requirement: Reduced Motion Compliance
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** counters display final values immediately without animation

#### Scenario: Static display for reduced motion
- **WHEN** the user has reduced motion preference
- **THEN** metrics show final values on render without any transition
