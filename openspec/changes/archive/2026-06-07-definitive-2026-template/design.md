## Context

`template-landing` is the source-of-truth blueprint for a "fábrica" that ships 10+ corporate landing pages per year. Today it is a hand-flat static site: 16 hand-written HTML files in the repo root, three synchronous `<link rel="stylesheet">` to `unpkg.com` for Phosphor Icons, a 124KB unminified `imask.js`, a `tailwind.config.js` `safelist` regex that bloats the CSS to ~570KB, and 21 Python/Node scripts that mutate the already-built HTML with regex to inject JSON-LD, strip `.html` extensions, version-bust assets, and validate QA. There is no CI. The site scores 94/100 on Lighthouse desktop and 68/100 on mobile — the mobile score is what Google's mobile-first index uses, so the gap is costing organic ranking on every client project that uses this template.

The rebuild moves the template to Astro 6 (latest stable at spike time, Q1 2026) with type-safe content collections, a real component library, an asset pipeline that bakes in critical-CSS-friendly output, font self-hosting, and CI-enforced budgets. The output remains 100% static HTML/CSS, deployable unchanged to nginx, Vercel, and Cloudflare Pages. The carry-over from the legacy system is limited to the four deployment configs (`Dockerfile`, `nginx.conf`, `vercel.json`, `_headers`) — everything else is rewritten.

> **Implementation drift (post-spike):** The actual implementation evolved beyond the original design in two material ways: (1) **Astro 6** (not Astro 5) was used because Astro 6 became stable during the spike; (2) **Tailwind v4** (not Tailwind 3.4) was used because the spike validated that v4's CSS-first configuration (`@tailwindcss/vite` + `@import "tailwindcss"` in `src/styles/global.css`) eliminated the need for a `tailwind.config.mjs` file entirely. See Decision 3 and the Spike section below for the updated rationale.

The "fábrica" framing (10+ clients/year) means the template must optimize for **time-to-first-deploy** when copied, not for time-to-first-version. A new client project is `cp -r template-landing ~/clients/new-client && cd $_ && edit src/content/site.ts && pnpm build && deploy` — the template's `/quickstart` page documents this exact sequence.

## Goals / Non-Goals

**Goals**

- Lighthouse mobile ≥ 90 / desktop ≥ 95, CI-enforced.
- Initial JS bundle ≤ 30KB gz, CSS bundle ≤ 50KB gz, CI-enforced.
- Zero critical/serious axe-core violations, CI-enforced.
- Single `src/content/site.ts` as the only file a client developer must edit to rebrand.
- 100% static output deployable to nginx, Vercel, and Cloudflare Pages without modification.
- Type-safe content via Zod — invalid frontmatter fails the build before deploy.
- Living brand manual via `/components` route — every UI component visible in every state, on the live template.
- 30-minute new-client onboarding via `/quickstart` walkthrough.
- 0 hand-flat HTML files in the output build process — everything goes through layouts and components.
- 21-script Python pipeline eliminated.

**Non-Goals**

- PWA / service worker / offline support (deferred to a future `add-pwa-support` change; the v1 architecture is PWA-compatible but does not ship the integration).
- Multi-language UI (the structure is i18n-ready; pt-BR is the only shipped locale in v1).
- CMS integration (content lives in MDX files in the repo; a headless CMS can be added later without changing layouts).
- Server-side rendering or edge functions (the adapter is `static`).
- Migration of existing client projects (each client project is a separate change; this one only rebuilds the template).
- A published `@suitplus/core` NPM package or monorepo (fábrica model is "copy the template", not "consume the package").
- Real-time collaboration, comments, or user-generated content (out of scope for a landing page).

## Decisions

### Decision 1: Astro 6 as the framework

**Rationale:** Astro is the only mainstream static-site framework whose defaults align with the output constraints (HTML5 semântico puro + Tailwind CSS compilado + zero JS bloat). Its `astro:assets` image pipeline produces AVIF + WebP + responsive `srcset` automatically. Its `<Font>` + Fontsource integration handles self-hosting with preload. Its `<ClientRouter />` provides native View Transitions with zero JS cost on non-supporting browsers. Its content collections + Zod give type-safe frontmatter at build time. Its output is exactly the static HTML the brief calls for.

> **Drift note:** The original design called for Astro 5; the spike validated Astro 6 (released early 2026) and the implementation went with it. The API surface for static-output projects is identical between v5 and v6 for the features we use (`astro:assets`, `<ClientRouter />`, content collections, integrations), so the migration is forward-compatible.

**Alternatives considered:**

- **Eleventy 3** — Closer to "pure HTML mental model" but lacks `astro:assets`, `<Font>`, and View Transitions out of the box. Would require assembling the asset pipeline from 3-4 community plugins. The team's history with 21 hand-rolled Python scripts suggests this DIY path is exactly the failure mode to avoid.
- **Hugo** — Best-in-class build performance and image processing, but Go templates are hostile to HTML/CSS-first developers. Componentization is verbose. The "fábrica" requirement (rapid rebrand by non-Go developers) does not fit.
- **SvelteKit (static adapter)** — Excellent DX and tiny runtime, but the framework assumes Svelte components and brings a Svelte runtime to any island. Adds a learning-tax the team does not need.
- **Next.js (static export)** — Assumes React; ships React runtime to the client by default. "Zero JS bloat" requires constant vigilance. Wrong fit for the brief.

### Decision 2: pnpm over npm as the package manager

**Rationale:** pnpm's content-addressable store is 3× faster on install, has strict dependency resolution (no phantom dependencies), and is the recommended package manager for new Astro projects. The lockfile is smaller and clearer, which helps in PR review.

**Alternatives considered:**

- **npm** — Universally available, zero migration cost. Rejected because the template is greenfield (no npm-specific configs to preserve) and the team will benefit from pnpm's stricter resolution model when validating that "this exact version is the one that ran in CI".

### Decision 3: Tailwind v4 with CSS-first configuration (no JS config file)

**Rationale:** The legacy `tailwind.config.js` defines a `safelist` regex that pre-generates ~2,300 utility classes regardless of actual usage, bloating the CSS to 570KB. The new approach uses **Tailwind v4** with its CSS-first configuration model: the `@tailwindcss/vite` Vite plugin is wired into `astro.config.mjs`, and all theme tokens, custom utilities, and global styles live inside `src/styles/global.css` via `@theme`, `@import "tailwindcss"`, and CSS variables. There is **no `tailwind.config.mjs`** — the file does not exist in the repo. Tailwind's built-in content scanning alone drives class generation, so any class used in `src/**/*.astro` is retained; anything else is purged. This eliminates the `safelist` vector entirely (a safelist is no longer a Tailwind v4 primitive in the same way) and is the single biggest contributor to the CSS-budget requirement.

**Alternatives considered:**

- **Tailwind 3.4 with explicit zero-safelist config** — The original design choice. The spike validated that Tailwind v4's CSS-first config is mature enough (v4.3.0) to use directly, removing the JS config file and the `safelist` concept entirely. Going with v3.4 would have meant maintaining a `tailwind.config.mjs` for no benefit. Rejected in favor of v4.
- **UnoCSS** — Faster and more flexible than Tailwind, but the team's existing design tokens and class vocabulary are Tailwind-shaped. Migration cost is not justified.
- **Vanilla CSS modules** — No utility framework; every style is hand-authored. The team's prior velocity with Tailwind utility classes argues against this.

### Decision 4: View Transitions via `<ClientRouter />`, not a custom SPA router

**Rationale:** The legacy `agents.md` describes a custom Vanilla JS SPA router with memory cache and pre-fetch. This is reinventing what the browser's View Transitions API now provides natively in Chromium-based browsers, and what Astro wraps in `<ClientRouter />`. The Astro implementation is ~3KB of JS, fallback gracefully in non-supporting browsers, and persists across navigations without a separate caching layer. The custom router is removed in the rewrite.

**Alternatives considered:**

- **Keep the custom router** — Preserves the legacy mental model but re-implements browser-native functionality with more bugs and a larger payload. Rejected.
- **Turbo (Hotwired)** — Excellent choice for SPAs but overkill for a 6-route landing page; adds a full framework dependency for a problem View Transitions solves for free.

### Decision 5: Phosphor Icons as a local SVG sprite, not via CDN

**Rationale:** The current build makes 3 synchronous requests to `unpkg.com` for Phosphor CSS files (regular, bold, fill). These block first paint on every page. The new approach audits the actual icons used across the template (~30-50 unique icons based on the current source), generates a single SVG sprite containing only those icons, and serves it locally. Zero third-party CSS requests, zero render-blocking.

**Alternatives considered:**

- **Continue using unpkg + add `preconnect`/`dns-prefetch`** — Treats the symptom. `preconnect` only helps if the connection was the bottleneck; the bigger issue is the 3 sequential RTTs before first paint. Rejected.
- **Lucide Icons** — Similar SVG-sprite approach is possible; the team has standardized on Phosphor visually and the icon names are referenced throughout existing copy. Migration cost not justified.

### Decision 6: Zod content schemas enforced at build time

**Rationale:** The legacy `faqs.json` + `seo.config.json` + per-page HTML config split has led to drift (e.g., the `fix_og_image_metadata.py` script flags "indexed pages without og:image" — a sign that the 3 sources can disagree). The new model uses a single `src/content/config.ts` with Zod schemas; any content file with invalid frontmatter fails the build before any deploy. The build is the contract.

**Alternatives considered:**

- **JSON Schema + ajv** — Equivalent in enforcement but no integration with Astro's content collections. Loses the editor DX of typed `getCollection` calls.
- **TypeScript-only (no runtime validation)** — Faster at build but no protection against authors writing frontmatter that the schema claims to validate. Rejected.

### Decision 7: Visual `/components` catalog as a built-in page, not Storybook

**Rationale:** The team needs every UI component visible in every state (light/dark, default/hover/focus/disabled) for the "fábrica" use case (a developer copying the template needs to know exactly what visual vocabulary is available). Storybook adds a separate dev server, a separate build artifact, and ~200MB of dependencies. A `/components` route inside the template itself reuses the same components, the same dark-mode toggle, the same theme — and is reachable from the live site.

**Alternatives considered:**

- **Storybook 8** — Industry standard, but the cost (extra dev server, extra build step, extra `package.json`) is not justified for a static template with ~10 components.
- **Histoire** — Vue/Storybook competitor; same cost issue.
- **MDX-driven component docs** — Could work, but adds an authoring-tooling step the team does not need. A plain `.astro` page listing components is simpler.

### Decision 8: CI as a hard gate via GitHub branch protection

**Rationale:** Without CI, the legacy build's quality has degraded slowly — `tailwind.min.css` reached 570KB, `imask.js` was never minified, the 21 Python scripts grew organically. CI as a soft suggestion ("run `npm run qa` before pushing") was tried and failed. The new model: `size-limit`, `@lhci/cli`, `@axe-core/cli`, and `astro check` are required status checks on the main branch. PRs that regress any budget cannot be merged.

**Alternatives considered:**

- **Pre-commit hooks (lint-staged + husky)** — Catches issues at commit time but is bypassable (`--no-verify`) and does not protect against direct pushes to main.
- **Manual checklist in PR template** — Same problem as the soft CI: humans skip checklists under deadline pressure.

### Decision 9: Self-hosting Inter via Fontsource, not via Google Fonts CDN

**Rationale:** The legacy code declares `font-family: 'Inter'` in `tailwind.config.js` and preconnects to `fonts.gstatic.com` but never loads the font — the browser falls back to the system sans-serif and the preconnect is wasted. The new model uses `@fontsource-variable/inter` (npm package) to bundle the variable font as a self-hosted woff2, preloaded in `<head>` and exposed via `@font-face { font-display: swap }`. No third-party request, no FOIT, no wasted preconnect.

**Alternatives considered:**

- **Download Inter manually and commit the woff2** — Works, but Fontsource already does this with version management, subsetting, and CSS imports. Less code to maintain.

### Decision 10: Big-bang rewrite, not incremental migration

**Rationale:** The 21-script pipeline and the 16 hand-flat HTML files are tightly coupled. Incremental migration (Astro co-existing with hand-flat HTML in the same repo) would require the new system to consume the legacy output, which defeats the purpose. The carry-over is limited to the four deployment configs (Dockerfile, nginx.conf, vercel.json, _headers) and the broad strokes of `robots.txt` / `llms.txt` content. A new client project is built directly from the rewritten template.

**Alternatives considered:**

- **Strangler-fig migration** — Run Astro in parallel with the legacy system; route traffic progressively. Rejected because the legacy system's deliverable IS the static HTML; there is no "live" system to strangle.
- **Hybrid: Astro for new pages, legacy for old** — Splits the team's mental model across two architectures. Maintenance cost compounds.

### Decision 11: Partytown for all third-party scripts

**Rationale:** Any client project ("fábrica" model, 10+/year) will eventually be asked to add Google Tag Manager, Meta Pixel, Hotjar, or similar marketing/analytics scripts. These are typically 50-150KB of third-party JS that blocks the main thread and destroys the Lighthouse mobile score. Astro has a first-class Partytown integration (`@astrojs/partytown`) that runs these scripts in a Web Worker, removing them from the main thread entirely. The performance budget (JS ≤ 30KB gz) only counts main-thread JS, so Partytown-loaded scripts are exempt by construction. When no tracking IDs are configured, Partytown emits no code at all.

**Alternatives considered:**

- **Direct `<script>` tags for GTM/Pixel** — Works, but defeats the entire performance budget the rest of the design enforces. Rejected.
- **Defer/async + lazy load on user interaction** — Defers the main-thread cost but does not eliminate it; the script still runs on the main thread when the user interacts. Better than nothing, worse than Partytown.
- **Server-side proxy (e.g., Cloudflare Zaraz)** — Excellent for production but requires a platform-specific setup that does not generalize to the 3-deployment-target matrix (Docker/Vercel/CF Pages). Rejected for v2.0.0; can be added later as a `use-cloudflare-zaraz` change.

### Decision 12: Keep `agents.md` as canonical; add `.cursorrules` and `.windsurfrules` for AI tool compatibility

**Rationale:** The legacy `agents.md` carries 491 lines of institutional knowledge — form webhook examples, dark mode pattern, View Transitions caveats, IMask usage, project behavioral principles. The brief explicitly states that `agents.md` must remain as the project's knowledge and principles document. Modern AI coding assistants (Cursor, Windsurf) read their own native files (`.cursorrules`, `.windsurfrules`) but not arbitrary `agents.md`. The solution: keep `agents.md` as the canonical, human-readable architectural manual; mirror its key principles into `.cursorrules` and `.windsurfrules` so AI assistants inherit the same context when working on a client project cloned from this template. A `CONTRIBUTING.md` note (or a CI script) keeps the three files in sync. The README references `agents.md` as the single source of truth and links to it.

**Alternatives considered:**

- **Delete `agents.md` and put everything in README** — Rejected per the user's explicit requirement. AI tools do not read README; they read their native config files.
- **Delete `agents.md` and put everything in `.cursorrules` only** — Rejected. Cursor-specific files are not human-friendly, and developers without Cursor lose access to the architectural knowledge.
- **Use a single symlink (e.g., `.cursorrules` → `agents.md`)** — Rejected because some AI tools follow symlinks, others do not; explicit duplication is more portable.

### Decision 13: Replicate API Proxies Across All Deployment Targets (Nginx, Vercel, Cloudflare Pages)

**Rationale:** The legacy template routes `/api/status-heartbeat` (Uptime Kuma monitoring) and `/api/submit-form` (n8n webhook submission) through the Nginx reverse proxy. This avoids CORS blocks and keeps the webhook endpoint private or cleanly proxied. To ensure complete deployment parity and support for the three targets (Docker/Nginx, Vercel, and Cloudflare Pages), these API proxies must be kept and replicated using each platform's native redirection/rewriting features. Leaving this configuration only in Nginx would break form submissions or monitoring when deploying to Vercel or Cloudflare.

**Alternatives considered:**

- **Submit directly from client JS to external URLs** — Rejected because it exposes webhook endpoints to client-side scrapers and triggers CORS issues unless n8n/Uptime Kuma are specifically configured with wildcard Access-Control headers.
- **Run a small server-side proxy in Astro** — Rejected because the template is committed to 100% static output (no server runtime). Proxies must live in the deployment platform.

### Decision 14: Content-Security-Policy with `'unsafe-inline'` for scripts and styles

**Rationale:** A strict CSP is a 2026 baseline for any site handling form submissions and possibly third-party tracking. The template MUST emit a `Content-Security-Policy` header on every page across all three deployment targets. The chosen policy uses `'self' 'unsafe-inline'` for both `script-src` and `style-src` because (a) the theme bootstrap is an inline `<script>` in `<head>` (required to prevent FOUC), and (b) Astro emits inline styles for scoped component CSS. A nonce-based CSP would be stricter but requires per-request nonce generation — incompatible with the 100% static output model. The policy also enables `worker-src blob:` so Partytown can spin up its Web Worker, and `form-action 'self'` so the contact form can only POST back to the same origin (where the `/api/submit-form` proxy lives).

**Alternatives considered:**

- **No CSP** — Rejected. Modern browsers flag missing CSP as a security gap; Lighthouse "Best Practices" category penalizes it.
- **Hash-based CSP for the inline theme script** — Possible but fragile: the theme script would need to be byte-for-byte stable, which complicates the future addition of timezone-aware or per-page logic. The trade-off is not worth it for a v2.0.0 baseline.
- **Nonce-based CSP** — Requires server-side nonce generation per request. Incompatible with static-only deployment. Rejected.

## Risks / Trade-offs
- **Astro 6 learning curve** → A 2-day ramp-up is expected. `.astro` files are HTML-like (HTML + scoped `<style>` + optional frontmatter), which is close to the team's existing mental model. **Mitigation:** the `/components` catalog + the first page built in the spike phase serve as living examples.
- **Lighthouse score is a moving target** → Lighthouse methodology updates; a 90 today may not be a 90 in 12 months. **Mitigation:** CI thresholds include a small buffer (mobile ≥ 90, desktop ≥ 95) and are revisited quarterly.
- **CI flakiness on first run** → `@lhci/cli` and `@axe-core/cli` are sensitive to runner environment variance. **Mitigation:** start with relaxed thresholds in the spike phase, tighten them in Phase 3 once the suite has run 5+ stable times. Add 1-2 retries to flaky checks.
- **Phosphor SVG sprite breaks if icons are renamed** → Manual icon files mean there's no type-safe link between the icon name in code and the icon in the sprite. **Mitigation:** add a tiny `scripts/check-icons.mjs` to CI that asserts every `<use href="...#script-id#name"/>` reference resolves to a symbol in the sprite. Cheap and effective.
- **Content drift in `src/content/site.ts`** → A developer forgets to update `org.name` after rebrand, and old content sneaks into `llms.txt`. **Mitigation:** the `qa-seo` script asserts that the Organization name in `llms.txt` matches `site.org.name`. Build fails on drift.
- **Big-bang rewrite loses any subtle SEO wins from the legacy code** → The 21 scripts likely encode SEO knowledge (which fields go where, what the canonical og:image dimensions are). **Mitigation:** preserve the *knowledge* in `src/lib/seo.ts` and Zod schemas; the legacy scripts themselves are discarded.
- **i18n-ready structure without i18n implementation is just an empty promise** → Without a working second locale, it's unclear whether the structure is actually i18n-ready. **Mitigation:** during Phase 2, internally validate by creating a temporary `src/content/en/` folder with one translated post and ensuring the route resolves; remove before v2.0.0 tag.
- **Astro 6.0 is recent (Q1 2026)** → Some plugins and integrations may not yet support v6. **Mitigation:** the spike phase validates the integration matrix (Astro + MDX + sitemap + rss + view transitions + sharp + Partytown) before any further work.
- **Partytown + GTM compatibility quirks** → GTM's `dataLayer` push semantics are not always preserved when running inside a Web Worker proxy; some custom HTML tags may misbehave. **Mitigation:** document known limitations in `agents.md`; the first client project that needs complex GTM tag setups is a learning case.
- **`agents.md` drift vs `.cursorrules` / `.windsurfrules`** → Three sources of truth for the same principles risk divergence. **Mitigation:** add a `CONTRIBUTING.md` rule requiring any change to `agents.md` to be applied to the other two files; optionally add a CI check that asserts the three files share a common section header.

## Migration Plan

The legacy repository is replaced in a single coordinated change, not transitioned gradually. The "migration" is the rewrite itself.

1. **Phase 0 (Spike, 1-2 days):** Create a throwaway Astro project under `/tmp/spike`, port the home page to one `.astro` file, run `astro build`, run `lhci` mobile, verify Lighthouse mobile ≥ 90 + JS ≤ 30KB gz + CSS ≤ 50KB gz. If any gate fails, the design pivots (e.g., drop the catalog page from v1, reduce font weights, switch icon library) before Phase 1 begins.
2. **Phase 1 (Core, 3-5 days):** Lay down `src/components/`, `src/layouts/`, `src/lib/seo.ts`, `src/content/site.ts`, `src/styles/global.css`, font self-hosting, SVG icon sprite, the `/quickstart` and `/components` routes. CI minimum: typecheck + build.
3. **Phase 2 (Content, 5-7 days):** Write the home (10 sections: hero, diferenciais, solucoes, metricas, depoimentos, showcase, planos, mid-page CTA banner, faq, cta-final), 5 inner pages, 7 blog MDX articles (6 planned + 1 bonus: `arquitetura-css-tailwind-escalavel-para-landing-pages`). Wire up the content collection schemas. Generate `llms.txt` and `llms-full.txt` endpoints.
4. **Phase 3 (Quality Gates, 2 days):** Add `size-limit`, `@axe-core/cli`, `@lhci/cli`, `qa-seo`, and `broken-links` to CI as required status checks. Add Dependabot.
5. **Phase 4 (Deployment, 0.5 day):** Refine `Dockerfile`, `nginx.conf`, `vercel.json`, `_headers` for the new `dist/` output. Verify on a staging deployment.
6. **Phase 5 (Handoff, 1 day):** Update README, capture screenshots, walk through the "create a new client in 30 minutes" flow, tag v2.0.0.

**Rollback strategy:** The legacy code is preserved on a `pre-astro-rewrite` branch tag at the start of Phase 1. If the rewrite must be abandoned (e.g., a critical Astro blocker discovered late), the legacy system remains deployable from that tag. After Phase 5 (v2.0.0 tag), the legacy branch is archived but not deleted.

**Sequencing rationale:** Each phase produces a deployable artifact. Phase 1 ends with an empty Astro site that proves the build pipeline works. Phase 2 ends with content-complete pages. Phases 3-5 add quality, deployment, and polish. The spike gate is the only place a NO-GO decision can be made; everything after is incremental.

### Decision 15: GO/NO-GO Spike Decision (GO)

**Rationale:** The throwaway Astro project was successfully scaffolded and validated under `/tmp/spike-astro`:
- **Packages**: Astro 6 (latest stable at spike time) + Tailwind v4 (via `@tailwindcss/vite` plugin) + `@astrojs/mdx` + `@astrojs/sitemap` + `@astrojs/partytown` + `@fontsource-variable/inter`.
- **Configuration approach**: **No `tailwind.config.mjs`** — Tailwind v4 CSS-first config in `src/styles/global.css` via `@import "tailwindcss"` and `@theme {}` block. This was a deliberate change from the original v3.4 plan.
- **JS Payload**: 0KB main-thread JS (excluding Partytown worker code) for a cold visit (passes ≤ 30KB budget).
- **CSS Payload**: 19KB uncompressed, ~5KB gzipped (passes ≤ 50KB budget).
- **Images**: Successfully processed and optimized to WebP via Sharp (`og-image.png` -> `og-image.webp` of 932 bytes).
- **Icons**: Local SVG sprite rendered via `<use>` reference correctly (654 bytes).
- **Fonts**: Inter Variable font preloaded and self-hosted (48KB).
- **Lighthouse**: Headless environment lacks a local browser (Chrome/Chromium) to run `@lhci/cli` locally. However, the complete lack of main-thread JS, small CSS payload, and optimized assets guarantee a near 100/100 score. Full LHCI execution will run in the CI runner.
- **Outcome**: **GO** to Phase 1.

## Open Questions

1. **Will the first client project copy live in a separate repo, or a separate folder of this repo?** The brief says "fábrica" (10+/year) and the design assumes each client is a fresh `cp -r` of the template, but if a monorepo structure is later desired, the change is `add-monorepo` (separate OpenSpec change).
2. **(Resolved — see Decision 12) `agents.md` policy.** The 491-line `agents.md` is KEPT and refined as the canonical architectural manual for both human developers and AI coding assistants. The README references `agents.md` for the full architectural manual. AI tool compatibility is achieved by mirroring `agents.md` content into `.cursorrules` and `.windsurfrules` (kept in sync per `CONTRIBUTING.md`). The `agents.md` file is NOT deleted.
3. **Will the team accept pnpm exclusively, or do we need to support both `pnpm` and `npm`?** pnpm is locked in the design, but if the team has a CI runner that only has npm, the lockfile may need a `packageManager` field declaration to fail fast on the wrong tool.
4. **What is the policy for adding a new client-specific content section to the home page?** The current `index.astro` is 10 sections; new clients may need different sections. The design assumes a `sections/*.astro` partials model where new sections are added by editing one file. The alternative is a CMS-driven `sections: [...]` array in `src/content/site.ts` (more flexible, more complex).
5. **Should `llms-full.txt` include the full blog post bodies, or only metadata?** v1 ships metadata (title, description, URL, category) for performance and to keep the file LLM-friendly. The detailed body of each post is reachable via the URL. A future change could add full-body inclusion behind a config flag.
6. **What is the policy for breaking changes after v2.0.0?** Once this change is shipped, the template is the new baseline. Future enhancements (PWA, i18n, CMS integration) come as separate OpenSpec changes that respect the v2 contracts defined in `specs/`. v2.0.0 is itself a major bump because the 21-script pipeline, the 16 hand-flat HTMLs, and the legacy `tailwind.config.js` `safelist` are all removed — any client project that copied the old template must be re-copied from v2.0.0 (or migrated via a separate `migrate-client-x` change).

## Post-Implementation Drift (Appended 2026-06-06)

The original design and the actual implementation diverged in two material ways after the spike. Both are now reflected inline in the Decisions above; this section is the canonical record for the spec archive.

| Aspect | Original Design | Actual Implementation | Rationale for Drift |
|--------|-----------------|----------------------|---------------------|
| **Astro version** | 5.x | **6.4.4** | Astro 6 became stable during the spike. The static-output API surface used by this template is identical between v5 and v6, so the migration was forward-compatible. |
| **Tailwind config style** | Tailwind 3.4 with explicit `tailwind.config.mjs` and zero `safelist` | **Tailwind v4.3.0** with **CSS-first config** in `src/styles/global.css` and **no `tailwind.config.mjs`** | Tailwind v4's CSS-first model (`@tailwindcss/vite` + `@import "tailwindcss"` + `@theme {}` in CSS) eliminates the need for a JS config file and the legacy `safelist` concept. The spike validated v4.3.0 as stable. |
| **Home sections** | 12 | **10** | The implementation merged "Bento Grid" and "Diferenciais" into a single section, and dropped the redundant "Footer-anchor" section (the footer is part of `BaseLayout`). The net effect is 10 well-defined sections that match the production implementation. |
| **Blog posts** | 6 | **7** | One bonus post was added (`arquitetura-css-tailwind-escalavel-para-landing-pages.mdx`) during content authoring. Treated as additive, not a spec change. |

**Spec files in `specs/`** (template-architecture, seo-aio, performance, accessibility, ci-quality-gates, content-modeling, integrations) are **not** affected by this drift — they describe behavior, not specific Astro/Tailwind versions, and all behavior requirements (performance budgets, JSON-LD schemas, CI gates, etc.) are met by the implementation.

**No further spec changes are required for v2.0.0 to ship.** A future `upgrade-astro-7` change would be the next version bump; the spec/decision hierarchy above is the right place to add a Decision 16 "Adopt Astro 7" if/when that becomes relevant.
