## ADDED Requirements

### Requirement: Bento Grid About Section
The About section MUST use a CSS Grid bento layout with variable-size cells. The grid MUST contain at minimum: a photo cell (spanning 1 column, 2 rows on desktop), a bio narrative cell (spanning 2 columns on desktop), a key fact cell (years of experience), a philosophy quote cell, and a location cell. Each cell MUST be a glassmorphism card.

#### Scenario: Desktop bento layout
- **WHEN** the About section renders on viewport >= 1024px
- **THEN** cells are arranged in a multi-column grid with the photo cell spanning 2 rows and the bio narrative spanning 2 columns

#### Scenario: Mobile stack layout
- **WHEN** the About section renders on viewport < 768px
- **THEN** all cells stack vertically in a single column

#### Scenario: Glassmorphism styling
- **WHEN** any bento cell renders
- **THEN** it has `backdrop-filter: blur()`, semi-transparent background, rounded corners (var(--radius-lg)), and a subtle border

### Requirement: Bento Grid Skills Section
The Skills section MUST use a CSS Grid bento layout with categorized competency tiles. At minimum 4 categories: (1) AI & Orchestration, (2) Backend & Cloud, (3) Data Science & Analytics, (4) Project Management & Public Admin. Each tile MUST display a category title, an icon, and a list of specific technologies.

#### Scenario: Four skill categories displayed
- **WHEN** the Skills section renders
- **THEN** at least 4 categorized tiles are visible, each with title, icon, and technology list

#### Scenario: Responsive grid
- **WHEN** the Skills section renders on mobile
- **THEN** tiles stack in a single column or 2-column layout

#### Scenario: Hover interaction
- **WHEN** the user hovers over a skill tile
- **THEN** the tile's border glow intensifies and it shifts slightly upward (translateY(-4px))
