## 1. Site Configuration & Identity

- [x] 1.1 Add `person` optional field to `SiteConfig` interface in `src/content/site.ts` with typed properties: `name`, `jobTitle`, `description`, `image`, `url`, `sameAs`, `credentials`
- [x] 1.2 Populate `site.person` with Ismael's real data (name, jobTitle, LinkedIn/GitHub sameAs, CRA-SP credential)
- [x] 1.3 Update `site.org` from Suitplus placeholder to Ismael's personal brand (name, url, description)
- [x] 1.4 Update `site.contact` with real email, phone, WhatsApp
- [x] 1.5 Update `site.social` with real LinkedIn, GitHub URLs (remove placeholder Suitplus links)
- [x] 1.6 Update `src/content.config.ts`: remove services, team, testimonials, faqs collection definitions; keep legal and blog

## 2. SEO Schema Builders

- [x] 2.1 Add `buildPersonSchema()` function to `src/lib/seo.ts` — returns Person JSON-LD sourced from `site.person`
- [x] 2.2 Add `buildProfilePageSchema()` function to `src/lib/seo.ts` — returns ProfilePage JSON-LD with `mainEntity` referencing Person `@id`
- [x] 2.3 Add `hasCredential` entries within Person schema for CRA-SP registration (EducationalOccupationalCredential type)
- [x] 2.4 Verify existing `buildOrgSchema` and `buildWebPageSchema` continue to work alongside new Person schema

## 3. Home Page Redesign (index.astro)

- [x] 3.1 Update page `<title>` and `description` meta to reflect personal profile (not corporate template)
- [x] 3.2 Add Person + ProfilePage JSON-LD imports and injection in frontmatter
- [x] 3.3 Add `og:type=profile`, `profile:first_name`, `profile:last_name` meta tags
- [x] 3.4 **Hero Section**: Implement full-screen (100vh) hero with `<h1>` name, animated role text cycling (CSS `@keyframes`), gradient background, and scroll-down CTA with `id="hero"`
- [x] 3.5 **Bio Section**: Write narrative about section covering IT, Data Science, Strategic Management expertise with `id="about"`
- [x] 3.6 **Impact Metrics Section**: Build 4-card animated counter grid (350.000+ processes, R$300k/year, R$25k/month, 78% capacity increase) with Intersection Observer trigger and `id="impact"`
- [x] 3.7 **Career Timeline Section**: Vertical timeline with alternating left/right cards, year badges, at least 5 milestones (E-SUS 2016, Paperless, IPTU/ISS Digital, PeruíbePrev, FiscalizaPlus 2025) with `id="timeline"`
- [x] 3.8 **Skills Section**: Categorized grid of competencies (AI Orchestration, Backend, Cloud/OCI, Project Management, Public Admin) with `id="skills"`
- [x] 3.9 **Authority & Governance Section**: Board memberships, council roles, CRA-SP, Sebrae affiliation with `id="authority"`
- [x] 3.10 **Projects Section**: Highlight cards for FiscalizaPlus, Paperless initiative, IPTU/ISS Digital, E-SUS with `id="projects"`
- [x] 3.11 **Qualifications Section**: Structured placeholder for graduações, pós-graduações, capacitações (user fills in specific credentials later) with `id="qualifications"`
- [x] 3.12 **Contact Section**: Professional contact form with WhatsApp CTA, reusing existing honeypot pattern and webhook with `id="contact"`
- [x] 3.13 **Scoped CSS**: Write all section styles in the `<style>` block — CSS variables for colors, grid layouts, timeline geometry, counter animations, responsive breakpoints

## 4. Layout & Branding Updates

- [x] 4.1 Update `Header.astro` navigation links to match new sections (anchor links to #hero, #about, #impact, etc.)
- [x] 4.2 Update `Footer.astro` to reflect personal brand (name, social links, copyright)
- [x] 4.3 Update `BaseLayout.astro` meta tags to support conditional Person/Organization based on `site.person` presence

## 5. Blog & Insights Infrastructure

- [x] 5.1 Update `src/pages/blog/index.astro` to match the new dark-first aesthetic
- [x] 5.2 Update `src/layouts/BlogPostLayout.astro` to match the new dark-first aesthetic
- [x] 5.3 Verify `src/pages/feed.xml.ts` generates correctly with no generic posts

## 6. Content Cleanup & Deletions

- [x] 6.1 Delete all 7 generic MDX posts inside `src/content/blog/`
- [x] 6.2 Delete `src/pages/sobre.astro`
- [x] 6.3 Delete `src/pages/servicos.astro`
- [x] 6.4 Delete `src/content/services/` directory
- [x] 6.5 Delete `src/content/team/` directory
- [x] 6.6 Delete `src/content/testimonials/` directory
- [x] 6.7 Delete `src/content/faqs/` directory

## 7. Accessibility & Motion

- [x] 7.1 Add `prefers-reduced-motion` media queries to disable hero role text animation, counter animations, and timeline entrance animations
- [x] 7.2 Ensure heading hierarchy is strictly sequential (h1 in hero → h2 per section → h3 for sub-items)
- [x] 7.3 Ensure all interactive elements have visible focus indicators
- [x] 7.4 Verify `inert` attribute usage on hidden elements (mobile menu)

## 8. Static Assets

- [x] 8.1 Replace `public/logo.svg` with personal brand logo (or initials-based SVG)
- [x] 8.2 Generate and replace `public/og-image.png` with personal profile OG image
- [x] 8.3 Update `public/apple-touch-icon.png` to match new branding

## 9. Verification & Quality Gates

- [x] 9.1 Run `pnpm typecheck` — ensure zero TypeScript errors with new `person` field
- [x] 9.2 Run `pnpm build` — static output generates with no service/about routes
- [x] 9.3 Run `pnpm qa-seo` — Person + ProfilePage JSON-LD pass, no placeholders, no FAQPage schemas in output
- [x] 9.4 Run `pnpm check-a11y` — zero accessibility violations
- [x] 9.5 Run `pnpm broken-links` — all internal links resolve
- [x] 9.6 Run `pnpm size-limit` — JS budget ≤ 30KB gzipped
- [x] 9.7 Visual review in `pnpm dev` — light mode, dark mode, mobile viewport, reduced motion
