# Contributing Guidelines

Welcome to the project! To maintain the high standards of performance, security, and SEO, please follow this contribution model.

## Development Workflow

1. **Structured Change Spec (OpenSpec)**: All major changes should be proposed and planned within the `openspec/` folder prior to implementation.
2. **Quality Checks**: Ensure your code satisfies all static checks locally before pushing.
3. **AI Compatibility Rules**: Any change to architectural guidelines in `agents.md` MUST be applied to both `.cursorrules` and `.windsurfrules` in the same PR.

## CI Gate Contracts

Your PR will trigger GitHub Actions running:
- **Typechecking**: `pnpm typecheck` (asserts no TS or Astro template errors).
- **Icons Validation**: `pnpm check-icons` (ensures all Phosphor icons in use are declared in `sprite.svg`).
- **Static Build**: `pnpm build` (ensures Vite compile completes cleanly).
- **Smoke Test**: `pnpm smoke-test` (verifies head FOUC theme inline script remains verbatim).
- **Bundle Budgets**: `pnpm size-limit` (main-thread JS ≤ 30KB gzipped).
- **SEO audits**: `pnpm qa-seo` (validates all JSON-LD schemas and blocks placeholders).
- **Broken Links check**: `pnpm broken-links` (crawls build outputs validating links).
- **Axe Accessibility scans**: `pnpm check-a11y` (asserts zero critical/serious violations).
- **Lighthouse CI**: mobile performance score ≥ 90, desktop score ≥ 95.

Please test these locally to speed up merge cycles!
