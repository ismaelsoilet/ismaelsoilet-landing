## Why

The current landing page is a generic corporate template (Suitplus placeholder). Ismael Hosni Soilet de Lima needs a personal professional landing page that showcases his unique profile: a multidisciplinary leader combining Public Administration (CRA-SP), Software Development (FiscalizaPlus), Data Science, and Digital Transformation — with quantifiable multi-million-BRL impact across government digitization, health systems, and tax modernization. A personal landing page is the natural evolution to establish authority, attract opportunities, and consolidate his professional narrative in a single premium digital presence.

## What Changes

- **Replace all template/Suitplus branding** with Ismael's personal brand identity across `site.ts`, layouts, and metadata.
- **Repurpose the blog into Articles/Insights**: Keep the blog infrastructure (pages, layouts, RSS feed), but remove the 7 generic template articles. Re-style the blog index and post layout to match the new premium dark-first aesthetic. This will serve as a thought leadership hub.
- **Redesign the home page (`index.astro`)** as a personal profile landing with these sections:
  1. **Hero**: Full-screen cinematic introduction with name, title, and a compelling tagline.
  2. **About / Bio**: Narrative summary of expertise spanning IT, Data Science, and Strategic Management.
  3. **Impact Metrics**: Animated counter section showcasing quantifiable ROI (350k+ processes digitized, R$300k/year savings, R$25k/month economy, 78% capacity increase).
  4. **Career Timeline**: Interactive vertical timeline covering key milestones (Paperless transformation, FiscalizaPlus creation, E-SUS deployment, council memberships).
  5. **Skills & Expertise**: Categorized tech stack and competencies (AI Orchestration, Backend, Cloud, Project Management, Public Administration).
  6. **Authority & Governance**: Board memberships, council roles, CRA-SP registration, Sebrae affiliation.
  7. **Featured Projects**: Highlight cards for FiscalizaPlus, Paperless initiative, IPTU/ISS Digital, E-SUS deployment.
  8. **Qualifications**: Education section (graduações, pós-graduações, capacitações) — placeholder structure for the user to fill with specific credentials.
  9. **Contact / CTA**: Professional contact form with WhatsApp integration.
  10. **Footer**: Minimal footer with social links (LinkedIn, GitHub) and legal references.
- **Update content collections**: Adapt FAQs, remove corporate testimonials/services/team, or repurpose for personal context.
- **Update SEO schemas**: Replace Organization with Person JSON-LD; add professional ProfilePage schema.
- **Update social/contact metadata** in `site.ts` with Ismael's real LinkedIn, GitHub, email, phone.

## Capabilities

### New Capabilities
- `personal-hero`: Full-screen hero section with animated role text, gradient background, and scroll CTA.
- `impact-metrics`: Animated counter section with quantifiable ROI data (processes, savings, economy).
- `career-timeline`: Interactive vertical timeline with milestone cards and year markers.
- `profile-seo`: Person JSON-LD schema, ProfilePage schema, and personal Open Graph metadata.

### Modified Capabilities
- `content-modeling`: Simplify Header navigation to anchor links (#about, #projects, #timeline, #skills, #contact) and a link to the Blog (/blog). Site config (`site.ts`) must switch from Organization to Person model; social links and contact details updated.
- `template-architecture`: Home page restructured to personal profile; corporate pages (sobre, servicos) eliminated; blog infrastructure re-styled for personal brand.
- `seo-aio`: JSON-LD adds Person + ProfilePage; removes Service, FAQPage schemas from active use; updates llms.txt.a descriptions.

## Impact

- **Files significantly rewritten**: `src/pages/index.astro` (full redesign), `src/content/site.ts` (identity swap).
- **Files deleted**: `src/pages/sobre.astro`, `src/pages/servicos.astro`, all 7 MDX files in `src/content/blog/`, all files in `src/content/services/`, `src/content/team/`, `src/content/testimonials/`, `src/content/faqs/`.
- **Files moderately changed**: `src/lib/seo.ts` (Person schema builder), `src/layouts/BaseLayout.astro` (meta tags), `src/components/layout/Header.astro` and `Footer.astro` (branding).
- **Content collections**: FAQs may be removed or repurposed. Services/team/testimonials collections become unused for the personal landing — they can remain dormant in the template without deletion.
- **Static assets**: `public/logo.svg`, `public/og-image.png`, `public/apple-touch-icon.png` need replacement with Ismael's personal brand assets.
- **No breaking changes to the build pipeline** — Astro static output, Tailwind v4, and all CI quality gates remain intact.
