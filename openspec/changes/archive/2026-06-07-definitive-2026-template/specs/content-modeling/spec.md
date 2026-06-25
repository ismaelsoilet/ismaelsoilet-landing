## ADDED Requirements

### Requirement: Zod Content Schemas
The template MUST define Zod schemas in `src/content/config.ts` for every content collection: `blog`, `services`, `team`, `testimonials`, `faqs`, and `legal`. Astro's content collections API MUST be configured to use these schemas. The build MUST fail if any content file violates its schema.

#### Scenario: Invalid blog frontmatter fails the build
- **WHEN** a blog post's frontmatter is missing the required `description` field
- **THEN** `astro build` exits non-zero with a Zod validation error identifying the file and missing field

#### Scenario: All collections are registered
- **WHEN** `src/content/config.ts` is read
- **THEN** it contains a `defineCollection` call for each of: blog, services, team, testimonials, faqs, legal

### Requirement: Blog Post Schema Constraints
A blog post's frontmatter MUST include: `title` (≤ 60 chars), `description` (140-160 chars), `pubDate` (coerced Date), `category` (one of `SEO`, `CRO`, `Performance`, `AIO`, `LGPD`), `keywords` (1-8 strings), `author`, and an optional `cover` image path. An optional `updated` Date and `draft` boolean (default `false`) are permitted.

#### Scenario: Title length enforced
- **WHEN** a blog post has a `title` longer than 60 characters
- **THEN** the build fails with a validation error

#### Scenario: Description length enforced
- **WHEN** a blog post has a `description` shorter than 140 or longer than 160 characters
- **THEN** the build fails with a validation error

#### Scenario: Category enum enforced
- **WHEN** a blog post has a `category` value not in the allowed enum
- **THEN** the build fails with a validation error listing the allowed values

#### Scenario: Keywords count enforced
- **WHEN** a blog post has fewer than 1 or more than 8 `keywords`
- **THEN** the build fails with a validation error

### Requirement: Service Schema Constraints
A service entry MUST include: `name`, `description`, `features` (array of strings, ≥ 1), and a `tiers` array (≥ 1) where each tier has `name`, `price` (string, allowing currency formatting), and `features` (array of strings).

#### Scenario: Service with empty features fails
- **WHEN** a service entry has an empty `features` array
- **THEN** the build fails with a validation error

#### Scenario: Tier with missing price fails
- **WHEN** a service tier is missing the `price` field
- **THEN** the build fails with a validation error

### Requirement: FAQ Schema Constraints
A FAQ entry MUST include `question` (string, ≤ 200 chars) and `answer` (string, ≤ 1000 chars).

#### Scenario: FAQ with long question fails
- **WHEN** a FAQ entry has a `question` longer than 200 characters
- **THEN** the build fails with a validation error

### Requirement: Legal Schema Constraints
A legal entry (`privacidade`, `termos`) MUST include `lastUpdated` (Date) and `sections` (array, ≥ 1) where each section has `heading` and `body` strings.

#### Scenario: Legal with no sections fails
- **WHEN** a legal entry has an empty `sections` array
- **THEN** the build fails with a validation error

### Requirement: Site Config Module
The template MUST expose `src/content/site.ts` as the single source for organization-level configuration. The module MUST export a typed object with at minimum: `org.name`, `org.url`, `org.logo`, `org.sameAs`, `contact.email`, `contact.phone`, `contact.whatsapp`, `social` (platform → URL), `webhook.contact`, `theme` (color tokens), and `tracking` (third-party tracking IDs — see `integrations` spec).

#### Scenario: Site config is typed
- **WHEN** a developer imports the `site` object from `src/content/site.ts`
- **THEN** TypeScript provides autocompletion and type checking for all required fields, including the `tracking` sub-object

#### Scenario: Site config drives JSON-LD
- **WHEN** `site.org.name` is changed
- **THEN** the Organization JSON-LD across every page reflects the new name on rebuild

#### Scenario: Tracking config gates script emission
- **WHEN** `site.tracking` has no IDs set
- **THEN** the built site emits no Partytown script tags and no third-party network requests

### Requirement: Blog Authored in MDX
Blog posts MUST be authored in `.mdx` format. The template MUST configure Astro's MDX integration so that components can be imported and used inside post bodies.

#### Scenario: MDX post renders
- **WHEN** a blog post `.mdx` file imports a component and uses it in the body
- **THEN** the rendered HTML output includes the component's markup

### Requirement: Draft Posts Excluded from Production
The template MUST exclude any blog post with `draft: true` from the production build output (`pnpm build`) while still including them in development mode.

#### Scenario: Draft post hidden in production
- **WHEN** `pnpm build` is run with a `draft: true` post present
- **THEN** the rendered `dist/` does not include the draft post's HTML and `/sitemap.xml` does not list its URL

#### Scenario: Draft post visible in development
- **WHEN** `pnpm dev` is running
- **THEN** the draft post is accessible at its expected URL

### Requirement: Dynamic Blog Route
The template MUST include a dynamic route at `src/pages/blog/[...slug].astro` that resolves every published (non-draft) blog post. The route MUST call `getStaticPaths()` returning one path per published post and MUST render the post via `BlogPostLayout`.

#### Scenario: Every published post has a route
- **WHEN** `astro build` completes
- **THEN** the `dist/blog/<slug>/index.html` file exists for every published post in the content collection

#### Scenario: Dynamic route does not include drafts
- **WHEN** `getStaticPaths()` runs during `astro build`
- **THEN** the returned list excludes any post with `draft: true`
