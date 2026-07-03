## ADDED Requirements

### Requirement: Case Study Cards
The home page MUST include a projects section displaying at least 4 case study cards. Each card MUST follow the Challenge → Solution → Result storytelling format with: a title, a hero visual area (icon or illustration), challenge text (1-2 sentences), solution text (1-2 sentences), result text with a highlighted impact number, and tech stack badges.

#### Scenario: Four case studies present
- **WHEN** the case studies section renders
- **THEN** at least 4 case study cards are visible: FiscalizaPlus, Paperless Transformation, IPTU/ISS Digital, E-SUS Health System

#### Scenario: Each card has storytelling structure
- **WHEN** a case study card renders
- **THEN** it contains visually distinct Challenge, Solution, and Result sections with the result section featuring a highlighted impact metric

#### Scenario: Tech badges present
- **WHEN** a case study card renders
- **THEN** it displays at least 2 tech stack badges (e.g., NestJS, Vue, Oracle, PostgreSQL) as small pill-shaped elements

### Requirement: Card Hover Interaction
Each case study card MUST have a hover interaction: subtle scale transform (`1.02`), border glow intensification, and elevated shadow. The transition MUST be smooth (300ms ease).

#### Scenario: Hover effect activates
- **WHEN** the user hovers over a case study card on desktop
- **THEN** the card scales to 1.02, its border glow brightens, and its shadow deepens

#### Scenario: Active press feedback
- **WHEN** the user clicks/presses a case study card
- **THEN** the card scales down to 0.98 providing tactile feedback

### Requirement: Scroll-Reveal Entrance
Case study cards MUST animate into view using CSS scroll-driven animations (`animation-timeline: view()`). Cards MUST stagger their entrance with increasing `animation-delay`.

#### Scenario: Cards reveal on scroll
- **WHEN** a case study card enters the viewport
- **THEN** it transitions from opacity 0 and translateY(2rem) to fully visible

#### Scenario: Staggered entrance
- **WHEN** multiple cards enter the viewport simultaneously
- **THEN** each successive card has a 100ms longer animation delay than the previous

#### Scenario: No animation for reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** all cards are immediately visible without entrance animation
