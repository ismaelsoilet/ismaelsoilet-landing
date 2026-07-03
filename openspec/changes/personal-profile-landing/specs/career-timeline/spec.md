## ADDED Requirements

### Requirement: Horizontal Scroll-Snap Timeline (Desktop)
The home page MUST include a career timeline section. On viewports >= 768px, the timeline MUST display as a horizontal scrollable container with `scroll-snap-type: x mandatory`. Each milestone card MUST snap to the center of the viewport. Visible scroll affordances (gradient fade on edges or navigation arrows) MUST indicate scrollability.

#### Scenario: Horizontal layout on desktop
- **WHEN** the timeline renders on viewport >= 768px
- **THEN** milestones are arranged horizontally in a scrollable container with snap behavior

#### Scenario: Scroll indicators visible
- **WHEN** the timeline has content beyond the visible area
- **THEN** gradient fades on the left/right edges indicate additional content

### Requirement: Vertical Timeline (Mobile)
On viewports < 768px, the timeline MUST collapse to a vertical layout with a line on the left and cards aligned to the right. Year badges MUST be positioned on the line.

#### Scenario: Vertical layout on mobile
- **WHEN** the timeline renders on viewport < 768px
- **THEN** milestones stack vertically with a left-aligned line and right-aligned cards

### Requirement: Milestone Content
Each milestone MUST display: a year badge (prominently styled), a title, a 1-2 sentence description, and an optional icon from the SVG sprite. At minimum 5 milestones MUST be present.

#### Scenario: Minimum milestones
- **WHEN** the timeline renders
- **THEN** at least 5 milestones are visible covering: E-SUS (2016), Paperless, IPTU/ISS Digital, PeruíbePrev/Conselhos, FiscalizaPlus (2025)

#### Scenario: Year badge styling
- **WHEN** a milestone renders
- **THEN** the year is displayed in a prominent badge with the accent color

### Requirement: Scroll-Driven Entrance
Timeline milestone cards MUST use CSS `animation-timeline: view()` for entrance animations. Cards MUST fade and slide into view as they enter the viewport.

#### Scenario: Milestones animate on scroll
- **WHEN** a milestone card enters the viewport
- **THEN** it transitions from transparent and offset to fully visible

#### Scenario: Reduced motion disables animation
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** all milestones are immediately visible
