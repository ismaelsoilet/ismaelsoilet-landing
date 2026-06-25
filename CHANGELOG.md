# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-06-06

### BREAKING CHANGES
- Complete structural rewrite from manual flat HTML pages to **Astro 6 (Static Mode)**.
- Replaced legacy Tailwind CSS v3 compilation scripts with **Tailwind CSS v4** (CSS-First configurations).
- Migration of content to type-safe **Zod Content Collections** using the Astro 6 Content Layer.

### Added
- Integrated dynamic, accessible UI blocks: `Button`, `Card`, `Section`, `Badge`, `Tabs`, `Accordion`, and `Skeleton`.
- Dynamic and type-safe JSON-LD builders for `Organization`, `WebPage`, `FAQPage`, `Service`, and `HowTo` schemas.
- Offloaded all third-party analytics and performance reporting scripts (Google Tag Manager, Meta Pixel, Hotjar, Clarity, and `web-vitals` beacons) to background Web Workers using **Partytown** and gated them behind a LGPD compliant cookie consent banner.
- Added comprehensive **CI Quality Gates** checking:
  - Typechecking (`astro check`)
  - Icon references in unified sprite (`check-icons.mjs`)
  - Build smoke test for FOUC inline script (`smoke-test.mjs`)
  - Bundle size budgets (`size-limit` JS ≤ 30KB gzipped)
  - SEO structured data validation (`qa-seo.mjs`)
  - Static output broken links checks (`broken-links.mjs`)
  - Accessibility checks (`axe-core`)
- Multi-stage `Dockerfile` and parity deployment setups for **Docker/Nginx**, **Vercel** (`vercel.json`), and **Cloudflare Pages** (`_headers`, `_redirects`).
- Synchronized AI-assistant rules (`.cursorrules` and `.windsurfrules`) with `agents.md`.
