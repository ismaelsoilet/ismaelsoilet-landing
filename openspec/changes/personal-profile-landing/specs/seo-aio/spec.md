## MODIFIED Requirements

### Requirement: Organization Schema on Every Page
The template MUST inject Organization JSON-LD into every page via BaseLayout. When `site.person` is set, the home page MUST additionally inject Person JSON-LD alongside the Organization schema.

#### Scenario: Organization JSON-LD present
- **WHEN** any page renders
- **THEN** exactly one `<script type="application/ld+json">` with `"@type": "Organization"` is present

#### Scenario: Person and Organization coexist on home
- **WHEN** `site.person` is set and the home page renders
- **THEN** both Organization and Person JSON-LD blocks are present

### Requirement: WebSite and WebPage Schema
The home page MUST inject WebSite + WebPage JSON-LD. When `site.person` is set, the WebPage MUST use `@type: ["WebPage", "ProfilePage"]` with `mainEntity` referencing the Person `@id`.

#### Scenario: ProfilePage type on home
- **WHEN** `site.person` is set and the home renders
- **THEN** the WebPage JSON-LD includes `"ProfilePage"` in its `@type` and `mainEntity` references the Person

### Requirement: FAQPage Schema Removed
FAQPage JSON-LD MUST NOT be generated since the FAQ section is removed from the personal landing.

#### Scenario: No FAQPage in output
- **WHEN** `astro build` completes
- **THEN** no page in `dist/` contains a `"@type": "FAQPage"` JSON-LD block

### Requirement: llms.txt Updated for Personal Profile
The `/llms.txt` and `/llms-full.txt` endpoints MUST reflect the personal profile content instead of corporate template content. The organization name MUST be replaced with the person's name.

#### Scenario: llms.txt uses person name
- **WHEN** `/llms.txt` is requested
- **THEN** the H1 heading contains the person's name, not the organization name
