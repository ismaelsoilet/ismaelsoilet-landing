## Why

The current `template-landing` is a hand-flat static site stitched together by 21 Python/Node scripts that mutate already-built HTML with regex. It scores 94/100 on Lighthouse desktop but collapses to 68/100 on mobile — Google indexes mobile-first, so this gap is costing organic ranking on every client project. The codebase also has no real componentization (16 hand-duplicated HTMLs with shared `<header>`, `<footer>`, and JSON-LD blocks), no CI guardrails (`.github/workflows/` is empty), and a `tailwind.config.js` safelist regex that silently inflates the CSS bundle to ~570KB.

This change rebuilds the template as a state-of-the-art 2026 reference: Astro 5 + Tailwind + type-safe content + zero-JS-by-default output, with CI-enforced performance, a11y, and SEO budgets. The template is the "fábrica" blueprint — used to ship 10+ landing pages/year — so a single source of truth with predictable quality gates matters more than ever.

## What Changes

- **Replace** the 21-script Python/Node build pipeline with an Astro 5 build that produces 100% static HTML/CSS in `dist/`. All SEO/AIO outputs (JSON-LD, `llms.txt`, sitemaps, `feed.xml`, `robots.txt`) become native Astro endpoints reading from typed content collections.
- **Introduce** a component library: `BaseHead`, `Header`, `Footer`, `MobileMenu`, `WhatsAppFloat`, `Button`, `Card`, `GlassCard` (with `@supports` + `prefers-reduced-transparency` fallbacks), `Section`, `Badge`, `Tabs`, `Accordion` (native `<details>`, zero JS), `Skeleton`. Each has a single source of truth used by every page.
- **Introduce** 3 layouts (`BaseLayout`, `PageLayout`, `BlogPostLayout`) and a `src/content/config.ts` Zod schema that makes frontmatter type-safe (a blog post missing `description` fails the build).
- **Self-host** Inter (variable woff2) via Fontsource + `<Font>` with preload + `font-display: swap`. **Eliminate** the 3 synchronous `unpkg.com` Phosphor requests by shipping a local SVG sprite (subset).
- **Wire** View Transitions via Astro's native `<ClientRouter />`; replace the custom Vanilla JS SPA router. Zero JS shipped unless an island opts in.
- **Add** `/components` (visual catalog — the template's own living brand manual) and `/quickstart` (5-step walkthrough to rebrand and ship a new client in 30 min).
- **Add** `src/content/site.ts` as the single source of client-specific values (name, contact, social, webhook URL, theme tokens). Rebrand = one file.
- **Add** GitHub Actions CI: `size-limit` (JS ≤ 30KB gz, CSS ≤ 50KB gz), `@lhci/cli` (mobile ≥ 90, desktop ≥ 95), `@axe-core/cli` (zero critical a11y violations), `qa-seo` script, `broken-links` audit, Dependabot.
- **Preserve** the four deployment configs (`Dockerfile` nginx-alpine, `nginx.conf`, `vercel.json`, `_headers`) refined to match the new `dist/` output.
- **BREAKING**: the existing `scripts/` directory is deleted. The repo is no longer a flat webroot of pre-built artifacts; `dist/` (or platform-specific outputs) becomes the deploy target. `content/blog/*.md` is migrated; everything else is rewritten.

## Capabilities

### New Capabilities

- `template-architecture`: Core build system, directory structure, layouts, components, asset pipeline (Astro 5, Tailwind, View Transitions, font self-hosting, image opt, SVG icon sprite).
- `seo-aio`: SEO/AIO surface area — JSON-LD schemas (Organization, WebSite, FAQPage, BreadcrumbList, Service, BlogPosting, HowTo), `llms.txt` + `llms-full.txt` endpoints, `sitemap.xml` + `image-sitemap.xml` + `feed.xml` endpoints, `robots.txt`, AIO discovery HTTP headers.
- `performance`: Performance budgets and the mechanisms that enforce them — Lighthouse mobile ≥ 90 / desktop ≥ 95, JS bundle ≤ 30KB gz, CSS bundle ≤ 50KB gz, no render-blocking external CSS/JS, no `backdrop-filter` on small viewports, AVIF/WebP via `<Image>`, `prefers-reduced-motion` respected.
- `accessibility`: A11y baseline — zero critical axe violations, skip-to-content link, visible focus rings, ARIA on interactive components, `prefers-reduced-motion` and `prefers-reduced-transparency` queries honored, color contrast ≥ WCAG AA.
- `ci-quality-gates`: CI pipeline that fails the build when any of the above budgets are violated — `size-limit`, `@lhci/cli`, `@axe-core/cli`, `qa-seo` script, broken-links audit, Dependabot for dependency review.
- `content-modeling`: Type-safe content via Zod schemas in `src/content/config.ts` — blog posts, services/plans, team, testimonials, FAQs, legal pages, and site-wide config. Frontmatter validation runs at build time.
- `integrations`: Third-party scripts and external service integrations — Partytown-based loading for analytics/tracking pixels, typed tracking config in `site.ts` (GTM, Meta Pixel), contact form webhook submission pattern with honeypot, web-vitals reporter beacon, and AI-tool compatibility files (`.cursorrules`, `.windsurfrules`) so AI coding assistants inherit the project's principles.

### Modified Capabilities

None — this is a greenfield restructure of the template. The existing `openspec/specs/` directory is empty.

## Impact

- **Affected code**: every HTML file in repo root, `scripts/` (deleted), `assets/css/style.css` (legacy, removed), `tailwind.config.js` (rewritten without `safelist`), `package.json` (rewritten with pnpm + Astro toolchain), `agents.md` (KEPT and refined — remains the canonical architectural manual for both human devs and AI coding assistants; supplemented with `.cursorrules` and `.windsurfrules` for AI tool compatibility).
- **Affected infrastructure**: `Dockerfile` (multi-stage refinement), `nginx.conf` (updated headers + brotli), `vercel.json` + `_headers` (adjusted for new output structure).
- **Affected developers**: any dev touching the template must learn Astro 5 + `.astro` component syntax + Zod content collections. Learning curve is shallow (Astro files are HTML-like) but real — a 2-day ramp-up is expected.
- **Affected deployments**: deploys now require `pnpm build` step OR pre-built `dist/` committed. Existing 3-platform matrix (Docker/Vercel/CF Pages) preserved; verified at end of Phase 4.
- **No client impact yet**: this is the template rewrite. The first client project cloned from the new template is a separate change (`bootstrap-first-client`) and out of scope here.
- **Carry-over (preserved)**: `Dockerfile`, `nginx.conf`, `vercel.json`, `_headers`, `.dockerignore`, `robots.txt` (refined), `llms.txt` content (rewritten from typed content sources), `agents.md` (refined, NOT deleted), plus new `.cursorrules` and `.windsurfrules` files derived from `agents.md`.
- **Carry-over (deleted)**: all 21 Python/Node scripts in `scripts/`, the 16 hand-flat HTML files, the 570KB pre-built `tailwind.min.css`, the 124KB `imask.js` (replaced by lazy 6KB island), `style.css` (legacy), the `safelist` regex in `tailwind.config.js`, the custom Vanilla JS SPA router.
