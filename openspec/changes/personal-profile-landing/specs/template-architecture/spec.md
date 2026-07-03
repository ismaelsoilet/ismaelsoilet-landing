## MODIFIED Requirements

### Requirement: Single-Source Site Configuration
The template MUST expose `src/content/site.ts` as the single configuration module containing all identity values. When the `person` field is populated, the home page MUST render as a single-page personal profile landing with sections: Hero, About (bento), Impact Dashboard, Case Studies, Career Timeline, Skills (bento), Authority, Qualifications, Contact, Footer. Corporate pages (sobre, servicos) MUST be removed.

#### Scenario: Person mode renders personal landing
- **WHEN** `site.person` is populated
- **THEN** the home page renders all 10 personal profile sections and no corporate template sections

#### Scenario: Corporate pages are removed
- **WHEN** the site builds
- **THEN** no `/sobre/` or `/servicos/` routes exist in the output

### Requirement: Blog Infrastructure Repurposed
The template MUST retain the blog infrastructure (routes, layouts, feed) but adapt its visual styling to match the premium personal brand aesthetic. The existing generic template articles MUST be deleted.

#### Scenario: Blog routes exist
- **WHEN** `astro build` completes
- **THEN** the `/blog/` directory exists in `dist/`

### Requirement: Header Anchor Navigation
The Header component MUST render anchor links to home page sections (#about, #projects, #timeline, #skills, #contact) and a link to the Blog (/blog). The header MUST highlight the currently visible section using Intersection Observer.

#### Scenario: Anchor links in navigation
- **WHEN** the Header renders
- **THEN** navigation links point to `/#about`, `/#projects`, `/#timeline`, `/#skills`, `/#contact`, and `/blog`

#### Scenario: Active section highlighting
- **WHEN** the user scrolls past the Projects section
- **THEN** the "Projects" navigation link has an active visual indicator (underline or color change)
