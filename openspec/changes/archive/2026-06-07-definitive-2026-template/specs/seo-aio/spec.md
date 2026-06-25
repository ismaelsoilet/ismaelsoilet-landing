## ADDED Requirements

### Requirement: Organization Schema on Every Page
The template MUST inject the `Organization` JSON-LD block (with `@id`, `name`, `url`, `logo`, `sameAs`) into the `<head>` of every rendered page via `BaseHead.astro`. Organization data MUST be sourced exclusively from `src/content/site.ts`.

#### Scenario: Organization JSON-LD is present
- **WHEN** any page renders
- **THEN** the rendered HTML contains exactly one `<script type="application/ld+json">` with `"@type": "Organization"`

#### Scenario: Organization reflects site config
- **WHEN** `site.org.name` is changed in `src/content/site.ts` and the site is rebuilt
- **THEN** every Organization JSON-LD block across all pages reflects the new name

### Requirement: WebSite and WebPage Schema on Home and All Pages
The template MUST inject `WebSite` + `WebPage` JSON-LD on the home route and `WebPage` JSON-LD on every other route. The `WebPage` MUST reference the `Organization` via `isPartOf` and MUST set `inLanguage` to the page locale.

#### Scenario: Home includes WebSite and WebPage
- **WHEN** the home route renders
- **THEN** the rendered HTML contains a `WebSite` JSON-LD and a `WebPage` JSON-LD that references it via `isPartOf`

### Requirement: FAQPage Schema for Pages with FAQs
Any page that has a FAQ section MUST have a `FAQPage` JSON-LD block in its `<head>` whose `mainEntity` is the exact list of questions and answers displayed on the page. The schema MUST be generated from the typed FAQ content collection, not from inline HTML scraping.

#### Scenario: FAQ page renders matching schema
- **WHEN** a page with 5 FAQ entries renders
- **THEN** the rendered HTML contains a `FAQPage` JSON-LD with exactly 5 `Question` entries matching the visible FAQ section

#### Scenario: FAQ from <details> elements is auto-extracted
- **WHEN** FAQ content is authored as native `<details>`/`<summary>` blocks in MDX
- **THEN** the build extracts them and generates a `FAQPage` JSON-LD whose content matches the visible markup

### Requirement: BlogPosting Schema with Conditional HowTo
The template MUST inject `BlogPosting` JSON-LD on every blog post route. Posts whose slug starts with `como-` MUST additionally inject a `HowTo` JSON-LD block whose steps are derived from numbered headings or step markers in the post body.

#### Scenario: Blog post has BlogPosting schema
- **WHEN** a blog post route renders
- **THEN** the rendered HTML contains a `BlogPosting` JSON-LD with `headline`, `datePublished`, `author`, and `publisher` populated from frontmatter

#### Scenario: "como-" slug adds HowTo schema
- **WHEN** a blog post with slug beginning with `como-` renders
- **THEN** the rendered HTML additionally contains a `HowTo` JSON-LD with at least one step

### Requirement: Service Schema on Service Pages
The template MUST inject `Service` JSON-LD on `/pages/servicos` (and any future service route) populated from the typed services content collection.

#### Scenario: Service page has Service schema
- **WHEN** `/pages/servicos` renders
- **THEN** the rendered HTML contains a `Service` JSON-LD with `name`, `description`, and `provider` (referencing the Organization) populated from the typed content

### Requirement: BreadcrumbList Schema for Sub-Routes
The template MUST inject `BreadcrumbList` JSON-LD on every page that is not the home route, with `itemListElement` reflecting the navigation path from home to the current page.

#### Scenario: Sub-route has breadcrumb schema
- **WHEN** `/pages/contato` renders
- **THEN** the rendered HTML contains a `BreadcrumbList` JSON-LD with two items: Home → Contato

### Requirement: llms.txt Endpoint
The template MUST expose a `/llms.txt` route that returns text/plain content following the `llms.txt` v1 specification. The content MUST be generated from typed content (site config + page list + blog index) at build time. The endpoint MUST be reachable from `robots.txt` and from a `Llms-Txt` HTTP header.

#### Scenario: llms.txt endpoint exists
- **WHEN** a GET request is made to `/llms.txt`
- **THEN** the response is 200, content-type is `text/plain`, and the body begins with an H1 heading naming the organization

#### Scenario: llms.txt has no placeholder content
- **WHEN** the build completes
- **THEN** the `dist/llms.txt` file contains no occurrences of `Lorem`, `TODO`, `FIXME`, `[CLIENTE]`, or `[PLACEHOLDER]`

### Requirement: llms-full.txt Endpoint
The template MUST expose a `/llms-full.txt` route that returns the long-form v2 specification content. Like `llms.txt`, it MUST be generated at build time from typed content.

#### Scenario: llms-full.txt endpoint exists
- **WHEN** a GET request is made to `/llms-full.txt`
- **THEN** the response is 200, content-type is `text/plain`, and the body includes a site map section and a machine-readable resources section

### Requirement: Sitemap XML Endpoint
The template MUST expose a `/sitemap.xml` route whose URL list excludes any page marked `noindex`. The endpoint MUST be referenced from `robots.txt`.

#### Scenario: Sitemap excludes noindex pages
- **WHEN** `/sitemap.xml` is generated
- **THEN** the response body does not contain any URL whose corresponding HTML page has `<meta name="robots" content="noindex">`

#### Scenario: Sitemap is referenced from robots.txt
- **WHEN** `/robots.txt` is requested
- **THEN** the response body contains `Sitemap: <absolute URL to /sitemap.xml>`

### Requirement: Image Sitemap Endpoint
The template MUST expose a `/image-sitemap.xml` route listing every image referenced by `<Image>` components across all rendered pages, with `<image:loc>`, `<image:caption>` (or `title`), and `<image:loc>` deduped per URL.

#### Scenario: Image sitemap lists every image
- **WHEN** `/image-sitemap.xml` is generated
- **THEN** every `<image:loc>` value is an absolute URL and every image referenced via `<Image>` in the built site appears at least once

### Requirement: RSS Feed Endpoint
The template MUST expose a `/feed.xml` route (RSS 2.0) listing the 20 most recent published blog posts with `title`, `link`, `pubDate`, `description`, and a `content:encoded` mirror of the post body.

#### Scenario: Feed lists recent posts
- **WHEN** `/feed.xml` is requested
- **THEN** the response is 200, content-type is `application/rss+xml`, and the body contains at most 20 `<item>` elements ordered by `pubDate` descending

### Requirement: Robots.txt with AIO Policy
The template MUST expose a `/robots.txt` route that allows all major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Googlebot) and blocks four known toxic bots (AhrefsBot, SemrushBot, MJ12bot, DotBot). It MUST also reference both sitemap URLs.

#### Scenario: robots.txt allows AI bots
- **WHEN** `/robots.txt` is requested
- **THEN** the response body contains `Allow: /` for the wildcard `User-agent: *` rule, and no `Disallow: /` is present under any AI-bot user-agent block

#### Scenario: robots.txt blocks toxic bots
- **WHEN** `/robots.txt` is requested
- **THEN** the response body contains `User-agent:` blocks for AhrefsBot, SemrushBot, MJ12bot, and DotBot, each followed by `Disallow: /`

### Requirement: AIO Discovery HTTP Headers
The template MUST serve `Llms-Txt` and `Llms-Full-Txt` HTTP headers pointing to the corresponding endpoints. The headers MUST be set consistently across all three deployment targets (nginx, Vercel, Cloudflare Pages).

#### Scenario: AIO headers present on nginx
- **WHEN** a request hits the nginx-served deployment for any page
- **THEN** the response includes `Llms-Txt: /llms.txt` and `Llms-Full-Txt: /llms-full.txt` headers

#### Scenario: AIO headers present on Vercel
- **WHEN** a request hits the Vercel deployment for any page
- **THEN** the response includes the same `Llms-Txt` and `Llms-Full-Txt` headers via `vercel.json`

#### Scenario: AIO headers present on Cloudflare Pages
- **WHEN** a request hits the Cloudflare Pages deployment for any page
- **THEN** the response includes the same `Llms-Txt` and `Llms-Full-Txt` headers via `_headers`
