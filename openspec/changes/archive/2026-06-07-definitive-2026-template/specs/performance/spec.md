## ADDED Requirements

### Requirement: Lighthouse Mobile Score Floor
The template MUST achieve a Lighthouse mobile performance score of at least 90 on a throttled 4G profile for every rendered page. The score MUST be measured by CI on every push and PR.

#### Scenario: Home meets mobile score
- **WHEN** Lighthouse CI runs against the built home page on a mobile profile
- **THEN** the performance category score is ≥ 90

#### Scenario: Blog post meets mobile score
- **WHEN** Lighthouse CI runs against any rendered blog post on a mobile profile
- **THEN** the performance category score is ≥ 90

### Requirement: Lighthouse Desktop Score Floor
The template MUST achieve a Lighthouse desktop performance score of at least 95 for every rendered page.

#### Scenario: All pages meet desktop score
- **WHEN** Lighthouse CI runs against every rendered page on a desktop profile
- **THEN** every performance category score is ≥ 95

### Requirement: JavaScript Bundle Budget
The initial main-thread JavaScript payload for any rendered page MUST be at most 30KB gzipped. Bundle size MUST be measured and enforced by `size-limit` in CI. Scripts loaded via Partytown (Web Worker) are exempt from this budget because they do not execute on the main thread (see `integrations` spec).

#### Scenario: Initial JS bundle size
- **WHEN** the build completes
- **THEN** the sum of all main-thread `<script>` files (excluding async/defer JSON-LD and excluding Partytown worker code) loaded by a cold page visit is ≤ 30KB gzipped

#### Scenario: CI fails on bundle regression
- **WHEN** a code change increases the main-thread initial JS bundle to > 30KB gzipped
- **THEN** the `size-limit` CI check exits non-zero and blocks merge

### Requirement: CSS Bundle Budget
The total CSS payload for any rendered page MUST be at most 50KB gzipped.

#### Scenario: CSS bundle size
- **WHEN** the build completes
- **THEN** the sum of all `<link rel="stylesheet">` files loaded by a cold page visit is ≤ 50KB gzipped

### Requirement: No Render-Blocking External CSS
The rendered HTML MUST NOT contain any `<link rel="stylesheet">` that points to a third-party origin (unpkg, jsdelivr, googleapis, gstatic, cdnjs, etc.) and blocks first paint. All third-party CSS MUST be either inlined, self-hosted, or loaded with a non-blocking strategy.

#### Scenario: No third-party stylesheet links
- **WHEN** the build completes
- **THEN** no rendered page contains a `<link rel="stylesheet" href="https://...">` to a non-self origin

### Requirement: No Render-Blocking External JavaScript
All JavaScript in the rendered HTML MUST use `type="module"`, `defer`, or `async`. No parser-blocking `<script src="...">` is permitted except the inline theme bootstrap (which MUST be ≤ 1KB).

#### Scenario: No blocking external scripts
- **WHEN** the build completes
- **THEN** no rendered page contains a `<script src="https://...">` without `defer`, `async`, or `type="module"`

### Requirement: Tailwind Without Safelist
The Tailwind configuration MUST NOT define a `safelist` array or a `safelist` regex. All utility classes used in the template MUST appear in source files so that PurgeCSS (or Tailwind's built-in content scanning) retains them naturally.

#### Scenario: Safelist is absent
- **WHEN** `tailwind.config.mjs` is read
- **THEN** no top-level `safelist` key is present in the configuration

#### Scenario: Unused utilities are purged
- **WHEN** a developer adds a utility class to source and then removes it from all source files
- **THEN** the rebuilt CSS does not contain the removed class

### Requirement: Backdrop-Filter Disabled on Small Viewports
Components that use `backdrop-filter` (GlassCard, sticky header) MUST disable the filter on viewports ≤ 768px. The disable MUST be implemented via `@media (max-width: 768px)` or `@media (prefers-reduced-transparency: reduce)`, not by removing the class.

#### Scenario: GlassCard on mobile
- **WHEN** a GlassCard component is rendered on a 375px viewport
- **THEN** the computed style for `backdrop-filter` is `none`

#### Scenario: GlassCard on desktop
- **WHEN** a GlassCard component is rendered on a 1280px viewport with no reduced-transparency preference
- **THEN** the computed style for `backdrop-filter` is `blur(12px)` (or equivalent)

### Requirement: Reduced Motion Support
All non-essential CSS animations and JS-driven animations MUST be disabled when `(prefers-reduced-motion: reduce)` is set. Essential animations (theme toggle, view transitions) MAY remain.

#### Scenario: Scroll reveal disabled
- **WHEN** a user has `(prefers-reduced-motion: reduce)` set
- **THEN** no `scroll-reveal` or `animate-fade-in-up` animation runs on scroll

### Requirement: Reduced Transparency Support
All `backdrop-filter` declarations MUST be wrapped in `@media (prefers-reduced-transparency: no-preference)` so that users with the reduced-transparency preference see opaque backgrounds.

#### Scenario: Reduced transparency fallback
- **WHEN** a user has `(prefers-reduced-transparency: reduce)` set
- **THEN** no `backdrop-filter` is applied regardless of viewport size

### Requirement: Responsive Image Pipeline
Every image rendered via the `<Image>` component MUST produce AVIF and WebP outputs, a responsive `srcset` covering at least 3 widths (e.g., 400w, 800w, 1600w), and `loading="lazy"` by default. The LCP image MAY override to `loading="eager"` with `fetchpriority="high"`.

#### Scenario: Image has AVIF and WebP
- **WHEN** an `<Image>` component is rendered
- **THEN** the output HTML contains a `<picture>` element with `<source type="image/avif">` and `<source type="image/webp">` followed by a fallback `<img>`

### Requirement: Self-Hosted Fonts With Preload and Swap
Every font used in the template MUST be self-hosted, served with `font-display: swap` in `@font-face`, and the primary font file MUST be preloaded in the document `<head>`.

#### Scenario: Font-display swap is set
- **WHEN** a `@font-face` rule is present in the CSS
- **THEN** it includes `font-display: swap` (or `optional`)

#### Scenario: Primary font preloaded
- **WHEN** any page renders
- **THEN** the `<head>` contains a `<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous">` for the primary font file

### Requirement: LCP Element Preloaded
The LCP element of each page (image, hero text, or background image) MUST be optimized for fast first paint. For image LCPs, the image MUST be eagerly loaded and preloaded. For text LCPs, the font MUST be preloaded (covered by font preload requirement).

#### Scenario: Image LCP is preloaded
- **WHEN** the page's LCP is an image
- **THEN** the rendered HTML contains a `<link rel="preload" as="image">` for that image and the image tag has `fetchpriority="high"`
