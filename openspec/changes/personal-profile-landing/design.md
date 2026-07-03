## Context

This project is a fork of the Suitplus template landing page — an Astro 6 static site with Tailwind v4, zero-JS-by-default architecture, and production-grade SEO/A11y/Performance CI gates. The template currently renders a generic- Eliminate irrelevant template content (corporate pages, unused collections) but retain and re-style the blog for thought leadership., team grid, testimonials).

The goal is to transform it into a **personal professional landing page** for Ismael Hosni Soilet de Lima — a multidisciplinary professional combining Public Administration, Software Development, Data Science, and Digital Transformation leadership in Brazilian municipal government.

**Current state**: Generic template with 10 home sections (Hero, About, Services, Results, Portfolio, Process, Testimonials, Blog, FAQ, CTA), corporate content collections, and Suitplus branding.

**Target state**: Personal profile landing with 10 sections (Hero, Bio, Impact Metrics, Career Timeline, Skills, Authority & Governance, Projects, Qualifications, Contact, Footer) with Person-centric SEO schemas.

## Goals / Non-Goals

**Goals:**
- Rewrite `index.astro` home page with all 10 personal profile sections.
- Replace `site.ts` identity from Organization to Person model.
- Implement Person + ProfilePage JSON-LD schemas in `seo.ts`.
- Animated impact metrics counters (Intersection Observer, CSS-only counters preferred; JS fallback acceptable).
- Interactive career timeline with milestone markers.
- Maintain 100/100 PageSpeed, zero accessibility violations, and all CI gates passing.
- Keep the monolithic `index.astro` pattern (per AGENTS.md: pedagogical template, proven performant).

**Non-Goals:**
- No CMS or dynamic content — this remains a static Astro site.
- No deletion of dormant corporate collections (services, team, testimonials) — they remain as template artifacts.
- No blog content changes — existing blog posts are template examples and stay as-is.
- No new Astro components — all sections live inline in `index.astro` (monolith pattern).
- No new npm dependencies for animations — use CSS `@keyframes`, Intersection Observer API, or Astro `<script>` blocks.
- No changes to the build pipeline, Docker, Nginx, or Vercel configurations.

## Decisions

### 1. Keep Monolithic `index.astro` (Not Component-Split)

**Decision**: All 10 sections remain inline in `index.astro` with scoped `<style>` blocks.

**Rationale**: AGENTS.md explicitly docum**[Blog commitment]** → Keeping the blog requires Ismael to write at least 1-2 solid articles to avoid an "abandoned" look. Mitigation: The markdown authoring experience is simple and the design will look premium even with a few high-quality posts.ign philosophy without measurable benefit for a single-page personal landing.

**Alternatives considered**: Splitting into `<HeroSection />`, `<TimelineSection />`, etc. — rejected per AGENTS.md guidance.

### 2. Person JSON-LD Instead of Organization

**Decision**: Add `buildPersonSchema()` and `buildProfilePageSchema()` to `src/lib/seo.ts`. The home page will emit Person + ProfilePage schemas. Organization schema remains available for other template consumers.

**Rationale**: Google's structured data guidelines recommend Person schema for personal websites and ProfilePage for author/profile pages. This improves rich snippet eligibility for knowledge panels.

**Alternatives considered**: Keeping Organization and adding `employee` relation — rejected because this is a personal site, not a company site.

### 3. CSS Counter Animations via `@property` + Intersection Observer

**Decision**: Use CSS `@property` for animating numeric values (counter-up effect) combined with a lightweight Intersection Observer `<script>` block to trigger on viewport entry.

**Rationale**: `@property` allows CSS-native number interpolation (Chrome 85+, Safari 15.4+, Firefox 128+). This avoids JS animation libraries. For unsupported browsers, the final values display immediately (graceful degradation).

**Alternatives considered**:
- JS `requestAnimationFrame` counter — heavier, adds main-thread JS.
- Pure CSS with `counter()` — doesn't support arbitrary numeric formatting (e.g., "350.000+").

### 4. Repurpose Blog into Insights/Articles

**Decision**: Retain the blog infrastructure but delete the generic template articles. Re-style the blog index and post layout to match the premium personal brand.

**Rationale**: Writing about the intersection of Public Administration, Tech, and Data Science establishes immense thought leadership. Keeping the blog allows Ismael to publish these articles, attracting opportunities and driving SEO. It also provides a destination for LinkedIn posts.

### 5. `site.ts` — Extend Interface, Don't Replace

**Decision**: Add optional `person` field to `SiteConfig` interface alongside existing `org`. The home page reads `site.person` for the profile. `site.org` remains for backward compatibility.

**Rationale**: This preserves the template's ability to serve both corporate and personal sites without breaking changes. The `person` field is optional — when absent, the template behaves as a corporate site.

```typescript
person?: {
  name: string;
  jobTitle: string;
  description: string;
  image: string;
  url: string;
  sameAs: string[];
  credentials: string[];
};
```

### 6. Color Palette — Deep Navy

### 8. Header as Anchor Navigation + Blog Link

**Decision**: Replace corporate page-based navigation with anchor links to home page sections: About, Projects, Timeline, Skills, Contact, plus a link to the Blog.

**Rationale**: Navy communicates authority and professionalism (government, administration). Teal accent provides energy contrast for CTAs and interactive elements. The palette works well for both light and dark modes.

## Risks / Trade-offs

**[Browser Support for `@property` counters]** → Graceful degradation: final numeric values shown immediately on unsupported browsers. No layout breakage.

**[Content Placeholders]** → Some sections (Qualifications, detailed credentials) will use structured placeholder content that Ismael fills in later. This is intentional — we don't have his full CV data.

**[Monolithic file size]** → `index.astro` will grow to ~2000+ lines. This is acceptable per AGENTS.md rationale. Build output remains static HTML with zero client JS.

**[SEO Schema Transition]** → Switching from Organization to Person may temporarily affect search appearance. Mitigation: keep `<meta>` tags consistent and let Google re-crawl. No existing indexed content depends on Organization schema since this is a fresh deployment.
