## ADDED Requirements

### Requirement: CSS Scroll-Driven Section Reveals
All content sections below the hero MUST use CSS scroll-driven animations (`animation-timeline: view()`) to reveal content as the user scrolls. The animation MUST only apply when the user has not set `prefers-reduced-motion: reduce`.

#### Scenario: Sections animate on scroll
- **WHEN** a section enters the viewport and reduced motion is not active
- **THEN** the section transitions from opacity 0 and translateY(3rem) to fully visible over the entry range

#### Scenario: No animation for reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** all sections are immediately visible without any scroll-linked animation

#### Scenario: Graceful degradation
- **WHEN** the browser does not support `animation-timeline`
- **THEN** all sections are immediately visible (the `@keyframes` fallback renders elements in their final state)

### Requirement: Zero JavaScript for Reveals
Scroll-driven reveal animations MUST NOT use JavaScript. They MUST be implemented entirely in CSS using `animation-timeline: view()` and `animation-range: entry`.

#### Scenario: No IntersectionObserver for reveals
- **WHEN** the page source is audited
- **THEN** no JavaScript code exists for toggling visibility classes on scroll (except for the counter animation which requires JS)

### Requirement: Staggered Child Animations
Within grid-based sections (About bento, Skills bento, Case Studies), individual grid children MUST stagger their entrance using `animation-delay` increments. The delay increment MUST be between 50ms and 150ms per child.

#### Scenario: Staggered entrance in grid
- **WHEN** a grid section enters the viewport
- **THEN** each child card appears sequentially with a visible delay between them
