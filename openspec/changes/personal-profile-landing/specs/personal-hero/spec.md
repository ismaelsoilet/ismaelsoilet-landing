## ADDED Requirements

### Requirement: Cinematic Full-Viewport Hero
The home page MUST render a full-viewport (100dvh) hero section as the first visible content. The hero MUST display the person's name in oversized gradient typography as the `<h1>`, with the text filling the horizontal space. Below the name, an animated role ticker MUST cycle through the person's professional roles. A one-line description and a scroll-down CTA button MUST complete the section.

#### Scenario: Hero occupies full dynamic viewport
- **WHEN** the home page loads on any device
- **THEN** the hero section occupies 100dvh with content vertically centered

#### Scenario: Name displayed as gradient h1
- **WHEN** the home page renders
- **THEN** the `<h1>` contains the person's name with a CSS gradient text effect (`background-clip: text`)

#### Scenario: Scroll CTA smooth-scrolls
- **WHEN** the user clicks the scroll-down CTA
- **THEN** the page smooth-scrolls to the About section (the first section below the hero)

### Requirement: Animated Role Ticker
The hero MUST display an animated text element that cycles through the person's professional roles (sourced from `site.person.roles[]`). The animation MUST use CSS `@keyframes` with `animation-iteration-count: infinite`. Each role MUST be visible for at least 2 seconds before transitioning.

#### Scenario: Roles cycle continuously
- **WHEN** the hero is visible
- **THEN** the role ticker cycles through at least 4 roles: Product Owner, Desenvolvedor, Gestor Público, Data Scientist

#### Scenario: Animation respects reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** the ticker stops and displays the first role statically

### Requirement: Mesh Gradient Background
The hero MUST have a CSS-only mesh gradient background using multiple overlapping `radial-gradient` layers in `oklch` color space. The gradients MUST subtly animate (scale or position shift) using CSS `@keyframes`. Dark mode and light mode MUST use different gradient intensities.

#### Scenario: Hero uses multi-layer gradient
- **WHEN** the hero renders
- **THEN** the background uses at least 3 overlapping `radial-gradient` layers creating a mesh effect

#### Scenario: Gradient animates subtly
- **WHEN** the hero is visible and reduced motion is not active
- **THEN** the gradient orbs shift position via CSS animation over a cycle of at least 10 seconds

#### Scenario: No JavaScript for background
- **WHEN** the page is audited for JS execution
- **THEN** the hero background uses zero JavaScript (no canvas, no WebGL)
