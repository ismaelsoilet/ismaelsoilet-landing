## MODIFIED Requirements

### Requirement: Site Config Module
The template MUST expose `src/content/site.ts` as the single source for configuration. The module MUST export a typed object with: `org` (name, url, logo, sameAs, description), `contact` (email, phone, whatsapp), `social` (platform URLs), `webhook`, `theme` (color tokens), `tracking` (third-party IDs), and a new optional `person` field. The `person` field MUST have typed properties: `name` (string), `firstName` (string), `lastName` (string), `jobTitle` (string), `roles` (string[] for animated ticker), `description` (string), `image` (string URL), `url` (string), `sameAs` (string[]), and `credentials` (array of `{name, category, recognizedBy}`). When `person` is populated, the site operates in personal profile mode.

#### Scenario: TypeScript autocompletion for person
- **WHEN** a developer imports `site` from `src/content/site.ts`
- **THEN** TypeScript provides autocompletion for all fields including `person.roles`, `person.credentials`, and `person.firstName`

#### Scenario: Person drives Person JSON-LD
- **WHEN** `site.person` is populated and the site is rebuilt
- **THEN** the home page emits Person + ProfilePage JSON-LD schemas

#### Scenario: Person field is optional
- **WHEN** `site.person` is omitted
- **THEN** the site builds successfully in corporate mode

#### Scenario: Tracking config gates script emission
- **WHEN** `site.tracking` has no IDs set
- **THEN** no Partytown scripts or third-party requests are emitted

### Requirement: Zod Content Schemas
The template MUST define Zod schemas in `src/content.config.ts` for remaining content collections: `legal` and `blog`. Collections `services`, `team`, `testimonials`, and `faqs` MUST be removed from the schema registry since their content directories are deleted.

#### Scenario: Removed collections do not cause build errors
- **WHEN** `astro build` runs after services/team/testimonials/faqs directories are deleted
- **THEN** the build completes successfully with no missing collection errors

#### Scenario: Legal and Blog collections remain functional
- **WHEN** `src/content/legal/` and `src/content/blog/` contain valid files
- **THEN** the Zod schema validates them and the pages render correctly
