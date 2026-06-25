## ADDED Requirements

### Requirement: Static Build Output
The template build system MUST produce 100% static HTML/CSS output with no server runtime requirement. The build tool MUST be Astro 5 configured with the static output adapter.

#### Scenario: Build produces static files
- **WHEN** `pnpm build` is executed
- **THEN** the `dist/` directory contains only `.html`, `.css`, `.js`, `.xml`, `.txt`, and image files

#### Scenario: Output runs on any static host
- **WHEN** the contents of `dist/` are uploaded to nginx, Vercel, or Cloudflare Pages
- **THEN** every page renders correctly without server-side processing

### Requirement: Reusable Component Library
The template MUST ship a component library under `src/components/` covering layout, UI, SEO, and forms. Every page in the template MUST compose from these components — hand-duplicated HTML is not permitted.

#### Scenario: Header is a single component
- **WHEN** any page renders
- **THEN** the page includes the `Header.astro` component exactly once and no inline copy of the navigation markup exists elsewhere

#### Scenario: Footer is a single component
- **WHEN** any page renders
- **THEN** the page includes the `Footer.astro` component exactly once and no inline copy of the footer markup exists elsewhere

### Requirement: Layout Hierarchy
The template MUST define three layouts (`BaseLayout`, `PageLayout`, `BlogPostLayout`) that enforce shared `<head>`, theme bootstrap, and footer/header injection.

#### Scenario: BaseLayout is the root wrapper
- **WHEN** a page is built
- **THEN** every HTML output is wrapped by `BaseLayout.astro` which provides the `<html lang>`, `<head>` (via `BaseHead.astro`), and footer closure

#### Scenario: BlogPostLayout adds BlogPosting schema
- **WHEN** a blog post route renders
- **THEN** the rendered HTML contains a `BlogPosting` JSON-LD block populated from the post frontmatter

### Requirement: Image Optimization Pipeline
The template MUST use Astro's built-in image optimization (`astro:assets`) so that every image referenced in source code is processed at build time. Output formats MUST include AVIF and WebP with responsive `srcset`. The pipeline MUST support lazy loading and `decoding="async"` by default.

#### Scenario: Image is optimized on build
- **WHEN** a page references an image via the `<Image>` component
- **THEN** the built HTML contains `<picture>` or `<img>` elements with AVIF and WebP `srcset` candidates and `loading="lazy"` (unless `loading="eager"` is set explicitly for the LCP image)

#### Scenario: LCP image is eagerly loaded
- **WHEN** the page's LCP element is an image
- **THEN** that image has `loading="eager"` and `fetchpriority="high"` attributes

### Requirement: Self-Hosted Fonts
The template MUST self-host all fonts. Fonts MUST be loaded with `font-display: swap` and the primary font file MUST be preloaded in the document `<head>`. Google Fonts CDN is prohibited.

#### Scenario: Font is self-hosted
- **WHEN** a page renders
- **THEN** the rendered HTML contains no `<link>` to `fonts.googleapis.com` or `fonts.gstatic.com`

#### Scenario: Primary font is preloaded
- **WHEN** a page renders
- **THEN** the `<head>` contains a `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the primary font file

### Requirement: Local Icon System
The template MUST ship icons as a local SVG sprite. No third-party icon CDN requests are permitted in the output HTML.

#### Scenario: No unpkg or jsdelivr in output
- **WHEN** the build completes
- **THEN** no `<link>` or `<script>` in the output references `unpkg.com`, `jsdelivr.net`, or any other public CDN for icons

#### Scenario: Icons render via sprite reference
- **WHEN** a component uses an icon
- **THEN** the rendered HTML references the local icon asset (e.g., `<svg><use href="/icons/sprite.svg#icon-name"/></svg>`)

### Requirement: View Transitions Enabled
The template MUST enable the View Transitions API via Astro's `<ClientRouter />` so that navigations between pages animate without a full page reload. The output MUST NOT ship a separate SPA router script.

#### Scenario: Navigation triggers view transition
- **WHEN** a user clicks an internal link in a Chromium browser
- **THEN** the navigation is intercepted by the View Transitions API and a `view-transition-name` animation runs

#### Scenario: No SPA router script in output
- **WHEN** the build completes
- **THEN** no script implementing client-side routing logic is present in the output JavaScript bundle

### Requirement: Dark Mode Without Flash of Unstyled Content
The template MUST apply the user's saved theme (light or dark) before first paint via a blocking inline script in the document `<head>`. The script MUST be authored using Astro's `<script is:inline>` directive so that it is emitted verbatim in the HTML and is NOT bundled, deferred, or moved to the end of the document. The script MUST be ≤ 1KB and MUST NOT use `localStorage` access that blocks for more than 5ms on cold start.

#### Scenario: Dark mode applies before paint
- **WHEN** a user with `theme=dark` in localStorage loads any page
- **THEN** the page renders with dark theme styles applied on first paint (no flash of light theme)

#### Scenario: Theme script is inline and unprocessed
- **WHEN** the build completes
- **THEN** the rendered `<head>` contains the theme script as a literal `<script>` block (not as a deferred module reference) at the position defined in `BaseHead.astro`

### Requirement: i18n-Ready Directory Structure
The template MUST organize routes and content so that adding a second language is a content-and-routing change, not a refactor. The v1 release ships only `pt-BR`. No language switcher UI is required for v1.

#### Scenario: Routes are namespaced by locale
- **WHEN** a new locale (e.g., `en`) is added
- **THEN** the existing `pt-BR` content is unchanged and new content can be added under the `en` namespace without modifying component code

### Requirement: Multi-Platform Deployment Support
The template MUST build artifacts deployable to Docker/nginx, Vercel, and Cloudflare Pages without modification. The build MUST produce a single `dist/` directory compatible with all three targets.

#### Scenario: Docker build succeeds
- **WHEN** `docker build` is executed from the repo root
- **THEN** the resulting image serves every page with HTTP 200 and all assets at correct paths

#### Scenario: Vercel deployment succeeds
- **WHEN** the repository is imported into Vercel with default Astro detection
- **THEN** the deployment completes and every page resolves with correct trailing-slash URLs

#### Scenario: Cloudflare Pages deployment succeeds
- **WHEN** the repository is connected to Cloudflare Pages with `dist/` as the build output
- **THEN** the deployment completes and HTTP headers from `_headers` are applied

### Requirement: Living Component Catalog
The template MUST include a `/components` route that visually demonstrates every UI component in every state (default, hover, focus, active, disabled, dark mode). The catalog MUST be a page, not a separate Storybook instance.

#### Scenario: Catalog page exists
- **WHEN** a user navigates to `/components`
- **THEN** a page renders showing at least the following components: Button, Card, GlassCard, Section, Badge, Tabs, Accordion, Skeleton, plus the form components

#### Scenario: Catalog demonstrates dark mode
- **WHEN** a user views the catalog in dark mode
- **THEN** every component on the catalog page reflects the dark theme without manual reload

### Requirement: Quickstart Walkthrough
The template MUST include a `/quickstart` route (also accessible from `README.md`) that documents the 5 steps to rebrand and ship a new client landing page in 30 minutes.

#### Scenario: Quickstart page exists
- **WHEN** a user navigates to `/quickstart`
- **THEN** a page renders listing exactly 5 numbered steps: edit site config, swap logo, adjust colors, update copy, deploy

### Requirement: Single-Source Site Configuration
The template MUST expose a single configuration module (`src/content/site.ts`) that contains all client-specific values: organization name, contact details, social URLs, webhook URL, and theme tokens. Rebranding MUST require editing this one file plus swapping the logo asset.

#### Scenario: Site config exports a typed object
- **WHEN** a developer imports `site` from `src/content/site.ts`
- **THEN** TypeScript provides full type information for the organization's name, contact, social, and webhook fields

#### Scenario: Changing the org name updates the site
- **WHEN** a developer changes `site.org.name` in `src/content/site.ts` and rebuilds
- **THEN** every rendered page, JSON-LD block, `llms.txt`, and `sitemap.xml` reflects the new name

### Requirement: Content-Security-Policy Headers
The template MUST serve a `Content-Security-Policy` HTTP response header on every page. The policy MUST include: `default-src 'self'`, `script-src 'self' 'unsafe-inline'` (required by the inline theme script and Astro's island runtime), `style-src 'self' 'unsafe-inline'` (required for scoped Astro styles), `img-src 'self' data: https:` (covers user-uploaded and partner images), `font-src 'self' data:`, `worker-src 'self' blob:` (required by Partytown), `frame-ancestors 'none'`, `form-action 'self'`, and `base-uri 'self'`. The policy MUST be served consistently across all three deployment targets (nginx, Vercel, Cloudflare Pages).

#### Scenario: CSP header present on nginx
- **WHEN** a request hits the nginx-served deployment for any page
- **THEN** the response includes a `Content-Security-Policy` header with the directives above

#### Scenario: CSP header present on Vercel
- **WHEN** a request hits the Vercel deployment for any page
- **THEN** the response includes the same `Content-Security-Policy` header via `vercel.json`

#### Scenario: CSP header present on Cloudflare Pages
- **WHEN** a request hits the Cloudflare Pages deployment for any page
- **THEN** the response includes the same `Content-Security-Policy` header via `_headers`

#### Scenario: CSP allows Partytown worker
- **WHEN** a page is built with `site.tracking.gtmId` set
- **THEN** the rendered HTML's Partytown worker bootstrap can load (CSP's `worker-src` includes `'self' blob:`)

### Requirement: Theme-Color Meta and Mobile Browser Integration
The template MUST include `<meta name="theme-color">` tags for both light and dark color schemes, using the `media` attribute to switch between them based on the user's OS preference. The legacy code emits one tag per scheme; this pattern MUST be preserved in `BaseHead.astro`. The colors MUST be sourced from the theme tokens in `src/content/site.ts` (not hardcoded).

#### Scenario: Theme color matches light scheme
- **WHEN** a user with `(prefers-color-scheme: light)` opens any page
- **THEN** the browser's address bar / status bar uses the light-scheme color from `site.theme.colors.primary`

#### Scenario: Theme color matches dark scheme
- **WHEN** a user with `(prefers-color-scheme: dark)` opens any page
- **THEN** the browser's address bar / status bar uses the dark-scheme color from `site.theme.colors.background`

### Requirement: i18n SEO Completeness (hreflang and og:locale:alternate)
Every rendered page MUST include `hreflang` link tags for every locale the site is configured to support (v1: only `pt-BR`; the tag MUST be self-referential and use the format `<link rel="alternate" hreflang="pt-BR" href="<absolute-url>">`). Every page MUST also include an `og:locale` meta tag with the page's locale, and an `og:locale:alternate` meta tag for every other configured locale. The legacy code emitted only `og:locale`; the new code MUST emit both.

#### Scenario: hreflang self-referential tag present
- **WHEN** any page renders in pt-BR
- **THEN** the rendered HTML contains `<link rel="alternate" hreflang="pt-BR" href="<absolute-url-of-current-page>">` in the `<head>`

#### Scenario: og:locale and og:locale:alternate present
- **WHEN** any page renders in pt-BR
- **THEN** the rendered HTML contains `<meta property="og:locale" content="pt_BR">` and `<meta property="og:locale:alternate" content="en_US">` (the alternate is included even though `en` is not yet shipped, so the site is ready for future locale addition without template changes)
