## ADDED Requirements

### Requirement: Person JSON-LD Schema
The home page MUST inject a `Person` JSON-LD block in the `<head>` with `@type: Person`, `name`, `jobTitle`, `description`, `url`, `image`, and `sameAs` (array of social profile URLs). All values MUST be sourced from `site.person` in `src/content/site.ts`. The `seo.ts` module MUST export a `buildPersonSchema()` function.

#### Scenario: Person schema present on home
- **WHEN** the home page renders
- **THEN** the rendered HTML contains a `<script type="application/ld+json">` with `"@type": "Person"` including name, jobTitle, and sameAs fields

#### Scenario: Person schema sources from site config
- **WHEN** `site.person.name` is changed in `src/content/site.ts` and the site is rebuilt
- **THEN** the Person JSON-LD reflects the new name

### Requirement: ProfilePage JSON-LD Schema
The home page MUST inject a `ProfilePage` JSON-LD block (or combine with WebPage as `@type: ["WebPage", "ProfilePage"]`) that references the `Person` via `mainEntity`. The `seo.ts` module MUST export a `buildProfilePageSchema()` function.

#### Scenario: ProfilePage schema references Person
- **WHEN** the home page renders
- **THEN** the rendered HTML contains a JSON-LD with `"@type"` including `"ProfilePage"` and a `"mainEntity"` referencing the Person schema by `@id`

### Requirement: Open Graph Personal Metadata
The home page MUST include `og:type` set to `profile`, `profile:first_name`, and `profile:last_name` meta tags populated from `site.person.name`.

#### Scenario: OG profile tags present
- **WHEN** the home page renders
- **THEN** the `<head>` contains `<meta property="og:type" content="profile">`, `<meta property="profile:first_name" content="Ismael">`, and `<meta property="profile:last_name" content="Lima">`

### Requirement: Credential Schema
The home page MUST include `hasCredential` entries within the Person JSON-LD for professional registrations (e.g., CRA-SP 6-2962). Each credential MUST have `@type: EducationalOccupationalCredential` with `credentialCategory` and `recognizedBy`.

#### Scenario: CRA-SP credential in Person schema
- **WHEN** the home page renders
- **THEN** the Person JSON-LD includes a `hasCredential` entry with `credentialCategory: "Professional Registration"` and name containing "CRA-SP"
