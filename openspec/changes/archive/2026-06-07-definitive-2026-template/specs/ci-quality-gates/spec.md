## ADDED Requirements

### Requirement: CI Runs on Every Push and PR
The template MUST include a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on every push to every branch and on every pull request targeting the main branch. The workflow MUST execute in under 10 minutes for a typical change.

#### Scenario: CI triggers on push
- **WHEN** a commit is pushed to any branch
- **THEN** the CI workflow starts within 60 seconds

#### Scenario: CI triggers on PR
- **WHEN** a pull request is opened or updated
- **THEN** the CI workflow starts and its status is reported on the PR

### Requirement: Bundle Size Enforcement
The CI pipeline MUST run `size-limit` (or equivalent) and fail the build if the initial JavaScript bundle exceeds 30KB gzipped or the CSS bundle exceeds 50KB gzipped.

#### Scenario: JS bundle regression blocks merge
- **WHEN** a change increases the initial JS bundle to > 30KB gzipped
- **THEN** the CI workflow exits non-zero and the PR check is marked failed

#### Scenario: CSS bundle regression blocks merge
- **WHEN** a change increases the CSS bundle to > 50KB gzipped
- **THEN** the CI workflow exits non-zero and the PR check is marked failed

### Requirement: Lighthouse CI Enforcement
The CI pipeline MUST run `@lhci/cli` (or equivalent) against the built site on a mobile and a desktop profile, and fail the build if any page's performance score falls below 90 (mobile) or 95 (desktop).

#### Scenario: Mobile Lighthouse regression blocks merge
- **WHEN** a change causes a page's mobile Lighthouse performance score to drop below 90
- **THEN** the CI workflow exits non-zero

#### Scenario: Desktop Lighthouse regression blocks merge
- **WHEN** a change causes a page's desktop Lighthouse performance score to drop below 95
- **THEN** the CI workflow exits non-zero

### Requirement: Accessibility CI Enforcement
The CI pipeline MUST run `@axe-core/cli` (or equivalent) against every rendered page of the built site and fail the build on any `critical` or `serious` violation.

#### Scenario: Axe regression blocks merge
- **WHEN** a change introduces a critical or serious axe violation on any page
- **THEN** the CI workflow exits non-zero

### Requirement: SEO QA Script
The CI pipeline MUST execute a `qa-seo` script (in-repo) that validates: every page has an Organization JSON-LD, every blog post has BlogPosting JSON-LD, FAQ pages have FAQPage JSON-LD, `llms.txt` and `llms-full.txt` exist and contain no placeholders, and `sitemap.xml` is valid XML referencing no noindex URLs.

#### Scenario: Missing JSON-LD fails QA
- **WHEN** a page is built without the expected JSON-LD block
- **THEN** the `qa-seo` script exits non-zero with a message identifying the page and missing schema

#### Scenario: llms.txt with placeholder fails QA
- **WHEN** `dist/llms.txt` contains `Lorem`, `TODO`, `FIXME`, or `[PLACEHOLDER]`
- **THEN** the `qa-seo` script exits non-zero

### Requirement: Broken Links Audit
The CI pipeline MUST run a `broken-links` script that crawls the built site starting from the home page, follows all internal links, and fails the build if any link returns HTTP 404 or 5xx.

#### Scenario: Internal 404 fails audit
- **WHEN** a page in the build contains an internal link that resolves to a 404
- **THEN** the `broken-links` script exits non-zero with the offending URL

### Requirement: Astro Typecheck
The CI pipeline MUST run `astro check` (TypeScript validation) and fail the build on any type error.

#### Scenario: Type error blocks merge
- **WHEN** a change introduces a TypeScript error
- **THEN** the `astro check` step exits non-zero

### Requirement: Dependabot
The repository MUST include a `.github/dependabot.yml` configuration that opens weekly PRs for npm dependency updates and groups minor/patch updates together.

#### Scenario: Dependabot opens weekly PR
- **WHEN** a new npm dependency version is published
- **THEN** within 7 days a Dependabot PR is opened in the repository

#### Scenario: Minor and patch updates are grouped
- **WHEN** Dependabot opens PRs
- **THEN** minor and patch updates for the same package are grouped into a single PR

### Requirement: Required CI Checks Before Merge
The repository MUST be configured so that the CI workflow is a required status check before any branch can be merged into the main branch. The branch protection rules MUST be documented in the README.

#### Scenario: Branch protection enforced
- **WHEN** a PR is opened against the main branch
- **THEN** the "merge" button is disabled until all required CI checks pass

#### Scenario: Documentation of branch protection
- **WHEN** a developer reads the README "Repository setup" section
- **THEN** the steps to configure the required status checks are listed
