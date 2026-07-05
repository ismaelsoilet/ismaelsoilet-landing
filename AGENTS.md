# Agent Guidelines for Template Landing (v2.1.1)

You are an expert web developer AI assisting with this high-performance, premium landing page **template** (the canonical base used to spin up client sites). Your goal is to maintain the highest standards of code quality, design aesthetics, user experience, and SEO/AIO compliance — while following strict behavioral guidelines.

---

## 🧠 Karpathy's Behavioral Principles for AI Agents

These guidelines prioritize **caution over speed**. Based on Andrej Karpathy's principles on common LLM coding errors, you must adhere to the following rules:

### 1. Think Before Coding
**Do not assume. Do not hide confusion. Expose trade-offs.**
- State your assumptions explicitly before implementing. If uncertain, **ask**.
- If there are multiple possible interpretations, present them to the user — do not choose one silently.
- If there is a simpler approach, suggest it.
- If something is unclear, **stop** and ask for clarification.

### 2. Simplicity First
**Write the minimum amount of code required to solve the problem. Nothing speculative.**
- Do not create features beyond what was explicitly requested.
- Do not add unrequested "flexibility" or over-engineer solutions.
- If 200 lines could be 50, rewrite it.

### 3. Surgical Changes
**Touch only what is strictly necessary. Clean only your mess.**
- **Do not "improve"** adjacent code, comments, or formatting outside the scope of the request.
- **Do not refactor** things that are not broken.
- **Follow the existing style** strictly, even if you would do it differently.
- If your changes make some existing code orphan, remove only what YOUR changes made useless.

### 4. Goal-Driven Execution
**Define success criteria. Iterate until verified.**
- Transform imperative tasks into verifiable goals (e.g., instead of "fix the bug", use "write a test that reproduces the bug, then make it pass").
- For multi-step tasks, declare a verification plan.

### 5. Do Not Mask Uncertainty
- If you do not know an answer, say so. Do not fill in plausible-sounding false content.

### 6. Tone
- Be direct. Be honest. Stop flattering and don't fake confidence.
- Avoid boilerplate ("Sure, I'd be happy to help", "Great question").

---

## 🏗️ Project Architecture

```
template-landing/
├── AGENTS.md               # ← you are here
├── package.json            # version, dependencies, scripts
├── pnpm-workspace.yaml     # local PNPM overrides (block security allowance)
├── tsconfig.json           # strict TypeScript rules
├── astro.config.mjs        # Astro config (Tailwind v4 integration, MDX, i18n, Sitemap)
├── vercel.json             # Vercel deploy configuration (cleanUrls, rewrites, CSP)
├── nginx.conf              # Production Nginx server (security headers, API proxies, gzip)
├── Dockerfile              # Multi-stage image build (builder Node.js -> runtime Nginx)
├── .dockerignore           # Excludes local node_modules, source, and CI configs
├── .cursorrules            # Cursor rules file (synchronized with AGENTS.md)
├── .windsurfrules          # Windsurf rules file (synchronized with AGENTS.md)
├── .github/
│   └── workflows/
│       └── ci.yml          # CI pipeline (typecheck, build, size, SEO, links, a11y, LHCI)
├── public/                 # ── Root static assets (favicons, manifestos, icons) ──
│   ├── logo.svg            # brand logo (SVG vector)
│   ├── favicon.ico         # favicon link
│   ├── apple-touch-icon.png# iOS touch icon
│   ├── _headers            # Cloudflare Pages custom headers (security, CSP, AIO)
│   ├── _redirects          # Cloudflare Pages proxies
│   ├── icons/
│   │   └── sprite.svg      # Unified Phosphor SVG Icon Sprite (34 icons)
│   └── js/
│       └── web-vitals.iife.js # Self-hosted web-vitals bundle for Partytown
├── scripts/                # ── Verification & QA utilities ──
│   ├── check-icons.mjs     # asserts sprite.svg has all referenced <use> symbols
│   ├── smoke-test.mjs      # checks FOUC prevention inline script in HTML
│   ├── qa-seo.mjs          # parses HTML to assert JSON-LD schemas and check placeholders
│   ├── broken-links.mjs    # crawls dist/ HTML files asserting valid internal links
│   └── check-a11y.mjs      # runs axe-core CLI checks on all compiled pages
├── src/                    # ── Application source code ──
│   ├── assets/             # optimized image targets (e.g. og-image.png)
│   ├── content.config.ts   # Astro 6 Content Layer (Zod collections schema & glob loaders)
│   ├── styles/
│   │   └── global.css      # CSS styles (Tailwind v4 theme configurations)
│   ├── content/            # ── Markdown/JSON Collection Content ──
│   │   ├── blog/           # MDX posts
│   │   ├── services/       # price tiers and plan specifications
│   │   ├── team/           # company members
│   │   ├── testimonials/   # customer quotes
│   │   ├── faqs/           # FAQ database
│   │   ├── legal/          # terms of use & privacy policy
│   │   └── site.ts         # Centralized site configurations (organization metadata)
│   ├── lib/
│   │   ├── seo.ts          # Type-safe JSON-LD builders (Org, WebPage, FAQ, Service)
│   │   └── theme.ts        # Theme toggler logic & FOUC-prevention script snippet
│   ├── layouts/            # ── Layout templates ──
│   │   ├── BaseLayout.astro     # root HTML layout, handles view-transitions & partytown
│   │   ├── PageLayout.astro     # standard pages with breadcrumbs
│   │   └── BlogPostLayout.astro # blog post wrapper with JSON-LD schema
│   ├── components/         # ── Modular Astro components ──
│   │   ├── ui/             # Button, Card, GlassCard, Section, Accordion, Badge, Tabs
│   │   ├── seo/            # JsonLd, Breadcrumb
│   │   ├── layout/         # Header, Footer, MobileMenu, WhatsAppFloat
│   │   └── integrations/   # ConsentBanner, PartytownScripts, WebVitalsReporter
│   └── pages/              # ── Page routing paths ──
│       ├── index.astro     # Home page (composes 9 sections)
│       ├── index-exemplo.astro # Demo home variant (noindex, excluded from sitemap)
│       ├── contato.astro   # Contact form page
│       ├── privacidade.astro# Privacy Policy (noindex, excluded from sitemap)
│       ├── termos.astro     # Terms of Use (noindex, excluded from sitemap)
│       ├── components.astro # Living UI catalog (noindex, excluded from sitemap)
│       ├── quickstart.astro # Rebranding walkthrough (noindex, excluded from sitemap)
│       ├── 404.astro       # Friendly 404 error page
│       ├── robots.txt.ts   # Dynamic robots.txt output (points to /sitemap-index.xml)
│       ├── image-sitemap.xml.ts # Custom image sitemap generator
│       ├── feed.xml.ts     # RSS Feed generator
│       ├── llms.txt.ts     # AI crawler summary (AIO)
│       ├── llms-full.txt.ts# AI crawler full content (AIO)
│       ├── version.json.ts # Build version endpoint
│       └── blog/           # Blog listing and dynamic MDX post endpoints
```

---

## 🛠️ Tech Stack

- **Astro 6 (Static Mode)**: 100% static HTML output, zero-JS-by-default on the main thread.
- **Tailwind CSS v4**: CSS-First theme configurations declared inside `src/styles/global.css` (no legacy `tailwind.config.js`).
- **MDX / Content Collections**: Strongly typed JSON/Markdown schemas and automated loaders.
- **View Transitions**: Built-in `<ClientRouter />` for smooth routing.
- **Partytown**: Third-party tracking scripts offloaded to background Web Workers.
- **axe-core & Lighthouse CI**: Embedded accessibility and performance gates.

---

## 🎨 Design & Aesthetics (CRITICAL)

- **Rich Visuals**: curating vibrant colors, smooth gradients, and glassmorphism fallbacks.
- **Micro-animations**: interactive elements must react with hover transitions and click active scale transformations (`active:scale-95`).
- **Dark Mode**: blocking inline script inside head prevents Flash of Unstyled Content (FOUC).
- **A11y Landscaping**: supports `prefers-reduced-motion` and `prefers-reduced-transparency` rules.

---

## 🧩 Core Patterns & Implementations

### 1. Zero-JS Forms & HoneyPot Spam Prevention
- Forms submit asynchronously via `fetch` to `/api/submit-form`.
- Honeypot components use off-screen positioning (`absolute -left-[9999px]`) with `tabindex="-1"` and `autocomplete="off"` (no `display: none`). Fill triggers a silent abort.
- Masks for inputs (like `imask`) are lazy loaded on input focus to keep initial bundles low.

### 2. Local Icons Sprite
- All icons must be loaded from `public/icons/sprite.svg` via `<use href="/icons/sprite.svg#icon-name" />`. No external CDN icons allowed.
- **Dark Theme Visibility**: All paths inside `<symbol>` elements MUST have `fill="currentColor"` (or be wrapped in `<g fill="currentColor">`). Otherwise, icons will inherit the default black fill, rendering them virtually invisible against dark backgrounds in the Dark Theme.
- **CRITICAL**: The root `<svg>` element in `sprite.svg` must NOT have `style="display: none;"`, otherwise external `<use>` references will fail to render in the browser.
- **Preloading**: When preloading the SVG sprite, use `<link rel="preload" href="/icons/sprite.svg" as="fetch" type="image/svg+xml" crossorigin="anonymous" />`. Do not use `as="image"`, as `<use>` fetches the file as a CORS request, leading to unused preload warnings.

### 3. LGPD Gated Partytown Tracking
- Consent banner dispatches `consent-granted` event.
- Tracking scripts (GTM, Pixel, Hotjar, Clarity) are dynamically appended as `type="text/partytown"` script tags only upon consent.
- All tracking scripts are fully absent from compilation if no tracking IDs are configured in `site.ts`.

### 4. Accessibility & Performance (Lighthouse Best Practices)
- **Zero-CDN (Fonts & Scripts)**: Absolutely no third-party CDNs for fonts or scripts. Use auto-hosted `@fontsource-variable/*` packages instead of Google Fonts (`@import` or `<link>`). Never leave unused or legacy scripts (e.g., `vanilla-tilt.min.js`) in the codebase as they block the critical rendering path.
- **Hidden Elements (A11y)**: Always use the `inert` HTML attribute for visually hidden interactive elements (like mobile menus or modals) to completely remove them from the accessibility tree and tab order. Toggle it via JS (`removeAttribute('inert')` and `setAttribute('inert', '')`). Do not rely solely on `aria-hidden`.
- **Heading Hierarchy**: Strictly follow sequential descending heading order (e.g., `h1` → `h2` → `h3`). Do not skip heading levels (e.g., jumping from `h3` directly to `h5`), as it creates critical accessibility violations.

---

## 🤖 SEO & AIO Standards (CRITICAL)

### Schemas
- Every page has Organization + WebPage JSON-LD.
- Blog articles have BlogPosting schema; `como-` guides additionally build a HowTo schema.
- FAQ sections generate a matching FAQPage schema (built ad hoc via `buildFaqSchema()` in `src/lib/seo.ts`; no `FaqSchema.astro` wrapper component exists).
- The home page emits a `ProfilePage` JSON-LD when `site.person` is configured (personal-portfolio fork).

### Sitemaps (Canonical)
- **Sitemap is generated automatically by `@astrojs/sitemap`** (configured in `astro.config.mjs`). It emits `/sitemap-index.xml` + `/sitemap-0.xml` at build time. **Do NOT create a manual `src/pages/sitemap.xml.ts`** — that would shadow the integration's output.
- **`robots.txt`** (in `src/pages/robots.txt.ts`) points to `/sitemap-index.xml` (not `/sitemap.xml`).
- **Sitemap exclusions**: the `filter` option in `astro.config.mjs` excludes `noindex` pages using `new URL(page).pathname` matching against an `excludedPaths` constant (`/privacidade`, `/termos`, `/components`, `/quickstart`, `/index-exemplo`). Use `URL.pathname` (not `page.includes(...)`) to avoid matching path segments in the domain or query string.
- **Image sitemap**: `/image-sitemap.xml` is a custom endpoint (`src/pages/image-sitemap.xml.ts`) that declares all images with absolute URLs. It is referenced from `robots.txt` alongside the main sitemap index.
- When forking this template into a client site, update `site` in `astro.config.mjs` to the client's domain — it is the single source of truth for the sitemap and must match `url` in `src/content/site.ts`.

### Demo / Template-Only Pages (noindex)
The following pages are template artifacts kept for reference and must **never** be indexed or appear in the sitemap. They pass `noindex={true}` to their layout and are listed in the sitemap `filter`'s `excludedPaths`:
- `components.astro` — living UI catalog.
- `quickstart.astro` — rebranding walkthrough.
- `index-exemplo.astro` — alternate demo home.

When forking into a client site, either delete these pages or keep them with `noindex` + sitemap exclusion (the default filter already excludes them).

### OG Image & Social Preview (CRITICAL)

OG images are the #1 cause of "funciona local mas não no WhatsApp/LinkedIn" bugs. Follow these rules strictly:

1. **File location**: Place the OG image in `public/`, NOT `src/assets/`. Files in `public/` are served as-is at `/og-image.jpg`; files in `src/assets/` get content-hashed by Astro and the path breaks when social scrapers fetch it.

2. **Default fallback in BaseHead**: Set the default OG image in `BaseHead.astro` props, not in page layouts:
   ```astro
   const { image = '/og-image.jpg' } = Astro.props;
   ```

3. **Absolute URL**: All OG meta tags require absolute URLs. In `BaseHead.astro`, build the URL as:
   ```astro
   const absoluteImageUrl = image.startsWith('http') ? image : `${site.org.url}${image}`;
   ```
   Never use relative paths in `og:image`, `twitter:image`, or JSON-LD image references.

4. **Required meta tags** — always emit all of these:
   - `og:image` — absolute URL
   - `og:image:width` — 1200
   - `og:image:height` — 630
   - `og:image:type` — `image/jpeg` (or `image/png` if using PNG)
   - `og:image:secure_url` — same absolute URL
   - `og:image:alt` — descriptive text (e.g., `"${site.org.name} - Hero"`)
   - `twitter:card` — `summary_large_image`
   - `twitter:image` — same absolute URL
   - `twitter:site` / `twitter:creator` — @handle (if applicable)

5. **Image dimensions**: Always use 1200×630 pixels — the standard OG ratio. Non-standard dimensions (e.g., 1730×909) will be cropped unpredictably by social platforms.

6. **Image sitemap**: Register the OG image in `image-sitemap.xml.ts` with an absolute URL built from `site.org.url`. Blog post cover images must also be registered here.

7. **JSON-LD blog image**: In `buildBlogPostingSchema()`, build the image URL the same way:
   ```ts
   "image": post.cover ? (post.cover.startsWith('http') ? post.cover : `${site.org.url}${post.cover}`) : `${site.org.url}/og-image.jpg`
   ```

8. **One active file only**: Keep exactly one OG image file in `public/`. Delete old versions (e.g., `og-image-v2.jpg`, `og-image.png` if using `og-image-v3.jpg`) to avoid confusion and stale files.

9. **Test before deploying**: Always test with https://opengraph.dev or the WhatsApp/LinkedIn debugger. The most common mistake is a relative URL that works in the browser but fails when a social scraper fetches it.

---

```bash
# Setup
pnpm install

# Local Dev
pnpm dev

# Build Static Output
pnpm build

# Quality Checks
pnpm typecheck      # runs astro check
pnpm check-icons    # asserts icon references in code
pnpm smoke-test     # validates inline theme script inclusion
pnpm size-limit     # checks bundle size budgets (JS <= 30KB gz)
pnpm qa-seo         # asserts schemas and crawls placeholders
pnpm broken-links   # crawls dist/ and flags broken paths
pnpm check-a11y     # audits accessibility errors (axe)
```

---

## ✅ Golden Rules

1. **No direct CDN references** in output.
2. **Never delete `AGENTS.md`** — it is our core architectural compass.
3. **Keep `.cursorrules` and `.windsurfrules` in sync** with this file.
4. **Use `<script is:inline>`** verbatim for FOUC theme injection.
5. **Always compile static pages** before commits and ensure all quality checks pass.

---

## 📋 Implementation Notes (v2.1.1 — June 2026)

### What's Shipped vs. What the Plan Said
- **Astro 6.4.4** (not Astro 5 as in the original design). The static-output API surface is identical for our use; v6 became stable during the spike.
- **Tailwind v4.3.0** (not Tailwind 3.4) with **CSS-first configuration**. There is intentionally **no `tailwind.config.mjs`** in the repo — theme tokens live in `src/styles/global.css` via `@import "tailwindcss"` and `@theme {}` blocks. This eliminates the legacy `safelist` concept entirely.
- **10 home sections** (not 12). The merged/dropped sections are documented in the drift section of `openspec/changes/definitive-2026-template/design.md`.
- **7 blog posts** (6 planned + 1 bonus: `arquitetura-css-tailwind-escalavel-para-landing-pages.mdx`).
- **Accessibility Fixes (v2.0.1)**: Remediated 38 accessibility issues across index.astro, Footer.astro, index-exemplo.astro, components.astro (strict heading hierarchy, form labels, keyboard focus indicators, inert hidden menus, and WCAG AA contrast compliance).
- **Sitemap cleanup (v2.1.1)**: Removed the manual `src/pages/sitemap.xml.ts` that shadowed `@astrojs/sitemap`. `robots.txt` now points to the integration's `/sitemap-index.xml`. The `filter` was hardened to use `new URL(page).pathname` with an `excludedPaths` constant, and `index-exemplo.astro` was added to the noindex + exclusion list.
- **Palette & dark-default (personal-portfolio fork)**: `sobre.astro` and `servicos.astro` were removed (about content folded into the home `#about` bento; no services catalog). The palette is the **Hybrid profile (tech + public administration)**: dominant `cyber` cyan (technology) + accent `primary` emerald (humanizing, modern) on a deep-navy `--color-navy` (`#0a0f1e`) base, defined as perceptually-uniform oklch scales in `@theme`. The site is **dark-by-default**: the FOUC script in `src/lib/theme.ts` adds `.dark` to `<html>` unless `localStorage.theme === "light"`. The home page respects the toggle (no longer forces `!important` dark); cards use the `<GlassCard>` component for progressive glassmorphism with `prefers-reduced-transparency` + `@supports` guards.

### Reusable Patterns from the Implementation
1. **CSS-first Tailwind tokens** in `src/styles/global.css`:
   ```css
   @import "tailwindcss";
   @theme {
     --color-primary-500: oklch(0.696 0.17 162.48); /* emerald — humanizing, modern accent */
     --color-cyber-500: oklch(0.715 0.143 194.76);  /* cyan — technology accent */
     --color-navy: #0a0f1e;
     --font-sans: "Inter Variable", system-ui, sans-serif;
   }
   ```
2. **The `index.astro` Monolith (100/100 PageSpeed)**: The `index.astro` home page is intentionally structured as a large monolithic file rather than splitting its 9 sections into separate components. This serves as a pedagogical template showing how a single file can manage layout, scoped CSS, and data. Despite its size, the site achieves a near 100/100 score on Google PageSpeed Insights due to Astro's zero-JS-by-default architecture and static generation, proving that monolithic components are perfectly viable and performant when following Astro best practices (e.g., self-hosting fonts, inlining critical CSS, avoiding unnecessary client-side JavaScript, and using modern image optimization).
3. **The `[...slug].astro` pattern** in `src/pages/blog/` is the canonical way to do dynamic content collection routes.
4. **The `site.tracking` empty-default pattern** in `src/content/site.ts` makes Partytown emit zero code unless a client developer opts in. This is the design's "zero-JS-by-default" invariant in practice.

### When You Touch a File
- **`AGENTS.md`** changes MUST be mirrored to `.cursorrules` and `.windsurfrules` in the same PR.
- **Any new section on the home** MUST add a corresponding `id="..."` for anchor links and a `<Section>` wrapper.
- **Any new content collection** MUST register its Zod schema in `src/content.config.ts`.
- **Any new tracking script** MUST go through Partytown; do not add direct `<script>` tags for third-party tools.

---
## Git Configuration
**IMPORTANT**: Always ensure the Git author is correctly configured to avoid deployment blockers (like Vercel blocking bot@suitplus.com.br).
- **Name**: Ismael Soilet
- **Email**: ismael.soilet@hotmail.com

If necessary, configure the repository locally before committing:
`git config user.email "ismael.soilet@hotmail.com" && git config user.name "Ismael Soilet"`

## 📌 Diretrizes de SEO e Open Graph (OG)

1. **Limites de Caracteres (Sweet Spots)**:
   - **Title (og:title, twitter:title)**: Mantenha SEMPRE abaixo de 60 caracteres para evitar cortes no Google, X e LinkedIn. Lembre-se que o sufixo do site (` | Nome do Site`) geralmente é adicionado automaticamente no `BaseHead.astro`.
   - **Description (og:description, twitter:description)**: Mantenha entre 120 e 150 caracteres. Textos muito longos serão cortados no preview de dispositivos móveis.

2. **Regras para og:image**:
   - **Dimensões Exatas**: A imagem DEVE ter exatamente **1200 x 630 pixels**. Redes sociais são estritas com a proporção.
   - **Call-to-Action (CTA)**: Sempre adicione um texto chamativo na própria imagem (ex: "Clique e Saiba Mais", "Solicite uma Demo"). Validadores de SEO dão pontuação maior quando identificam texto focado em conversão na imagem.

3. **Como burlar o Cache de Redes Sociais (X, LinkedIn)**:
   - Redes sociais fazem cache agressivo da URL da `og:image`. 
   - Se precisar atualizar a imagem, **NUNCA substitua o arquivo mantendo o mesmo nome**. Renomeie o arquivo (ex: de `og-image-v1.jpg` para `og-image-v2.jpg`), atualize a referência no código e faça o deploy. Isso força os robôs a buscarem a nova imagem imediatamente.


## SEO e Open Graph - Melhores Práticas (2024)

### 1. Limites de Meta Tags
- **Title (`<title>` e `og:title`)**: Manter até **60 caracteres**. Passar disso pode gerar truncamento no Google, X e LinkedIn.
- **Description (`<meta name="description">` e `og:description`)**: Manter entre **150 e 160 caracteres**. Para previews mobile e social, o ideal é focar a mensagem principal nos primeiros 125 caracteres.

### 2. Especificações da OG Image (`og:image`)
- **Dimensão Ideal**: **1200x630 pixels** (proporção de 1.91:1). Isso evita cortes indesejados nas redes sociais.
- **Formato**: Utilizar **JPG** (preferencial para arquivos menores e compatibilidade máxima) ou **PNG**. WebP ainda pode apresentar problemas em scrapers mais antigos.
- **URL Absoluta**: A URL da imagem DEVE ser absoluta (ex: `https://dominio.com.br/imagem.jpg`), começando com `http` ou `https`.
- **Tags Recomendadas**: Para que a imagem renderize logo no primeiro compartilhamento, inclua as dimensões no HTML:
  ```html
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  ```
- **Acessibilidade**: Se aplicável, use a tag `og:image:alt`.

### 3. Problema Frequente em Vercel: "URL did not return an image"
Quando um projeto é publicado na Vercel (ou plataformas com Preview nativo), as URLs de Preview (`VERCEL_URL`) costumam ter proteção **SSO/Senha (Vercel Protection)**. 
- **O erro**: O scraper do Facebook/X tenta baixar a imagem na URL de Preview e recebe um Redirecionamento 302 para uma página de login HTML, resultando no erro de que "a URL não retornou uma imagem".
- **A solução**: No Astro, não utilize a `VERCEL_URL` crua para construir a URL Base das Meta Tags. Dê preferência à variável de ambiente da URL de produção: `VERCEL_PROJECT_PRODUCTION_URL` ou faça um fallback para a URL de produção oficial (configurada no `site.url`).
  ```javascript
  // Exemplo no Astro (BaseHead.astro)
  const baseUrl = import.meta.env.DEV 
    ? 'http://localhost:4321' 
    : (process.env.VERCEL_PROJECT_PRODUCTION_URL 
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
        : (process.env.SITE_URL || site.url));
  ```

### 4. Checklist Rápido de Validação
- Utilize o [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) ou ferramentas de SEO (como o metatags.io) para limpar o cache das plataformas.
- Se o scraper acusar que o tamanho do arquivo é muito grande, mantenha a OG image com **menos de 300 KB**.
