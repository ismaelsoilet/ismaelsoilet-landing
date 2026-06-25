## ADDED Requirements

### Requirement: Third-Party Scripts Routed Through Partytown
The template MUST NOT load any third-party analytics, tracking, or marketing script (Google Tag Manager, Meta Pixel, Hotjar, etc.) directly on the main thread. Such scripts MUST be loaded via Astro's official Partytown integration (`@astrojs/partytown`), which executes them in a Web Worker. The performance spec rule "JS bundle ≤ 30KB gz" applies only to the main-thread payload; Partytown-loaded scripts are exempt because they do not block the main thread.

#### Scenario: GTM loads via Partytown
- **WHEN** `site.tracking.gtmId` is set in `src/content/site.ts`
- **THEN** the GTM `<script>` is rendered with `type="text/partytown"` and is loaded in a Web Worker

#### Scenario: No tracking ID means no script
- **WHEN** `site.tracking.gtmId` (and every other tracking field) is unset or empty
- **THEN** no Partytown script tag, no worker bootstrap, and no GTM/Pixel network request is emitted in the built HTML

#### Scenario: Partytown does not count against JS budget
- **WHEN** `size-limit` measures the main-thread JS bundle for a page that loads GTM via Partytown
- **THEN** the Partytown worker code and the proxied GTM snippet are not counted toward the 30KB gz budget

### Requirement: Typed Tracking Configuration
The `site` object exported from `src/content/site.ts` MUST include a `tracking` sub-object with the following optional fields: `gtmId` (Google Tag Manager container ID, format `GTM-XXXXXXX`), `metaPixelId` (Meta Pixel ID, numeric string), `hotjarId` (Hotjar site ID, numeric string), `clarityId` (Microsoft Clarity project ID), and `webVitalsEndpoint` (URL to receive `web-vitals` beacons). All fields are optional. The `tracking` object MUST be typed (no `any`).

#### Scenario: Tracking config is typed
- **WHEN** a developer assigns a non-string value (e.g., a number) to `site.tracking.gtmId`
- **THEN** TypeScript reports a type error at build time

#### Scenario: No tracking emitted when empty
- **WHEN** the `tracking` object has all fields unset
- **THEN** no Partytown tag and no third-party network request is present in the built site

### Requirement: Contact Form Submits Asynchronously to Configured Webhook
The contact form MUST submit asynchronously via `fetch()` to `site.webhook.contact` (a configurable URL). The payload MUST be JSON with at minimum the fields: `name`, `email`, `phone`, `message`, plus a `submittedAt` ISO timestamp. The submit button MUST be disabled during the in-flight request. On 2xx response, the form MUST clear its fields and display a success message. On non-2xx or network error, the form MUST display an error message and re-enable the submit button.

#### Scenario: Successful submission
- **WHEN** the user submits the form with valid fields
- **THEN** a POST request is made to `site.webhook.contact` with the documented JSON payload
- **AND** the form fields are cleared
- **AND** a success message is announced via an `aria-live="polite"` region

#### Scenario: Submission error
- **WHEN** the webhook responds with a non-2xx status or the network request fails
- **THEN** an error message is announced via an `aria-live="assertive"` region
- **AND** the submit button is re-enabled so the user can retry

### Requirement: Honeypot Anti-Spam Field
Every form in the template MUST include a hidden honeypot field (named `data-trap` or similar non-semantic name) that is not visible to sighted users and is not announced by screen readers. Form submissions where the honeypot field is filled MUST be silently dropped (no webhook call, no user-facing error, no analytics event). The honeypot field MUST be implemented with `aria-hidden="true"` AND `tabindex="-1"` AND `autocomplete="off"` — it MUST NOT be a real `<label>`/`<input>` pair.

#### Scenario: Honeypot catches a bot
- **WHEN** a bot fills the hidden honeypot field
- **THEN** the form submission is aborted before the `fetch()` call
- **AND** no webhook request is made
- **AND** the user-facing UI shows a generic success state (so the bot is not tipped off)

#### Scenario: Honeypot is not announced
- **WHEN** a screen reader user navigates the form
- **THEN** the honeypot field is not announced and is not focusable

### Requirement: Web Vitals Reporting (Optional)
When `site.tracking.webVitalsEndpoint` is set, the template MUST load the `web-vitals` library as a Partytown-script (not on the main thread) and report LCP, CLS, INP, FCP, and TTFB metrics to the configured endpoint as a JSON beacon. When unset, no `web-vitals` code is loaded.

#### Scenario: Web vitals reported
- **WHEN** `site.tracking.webVitalsEndpoint` is set to a valid URL
- **THEN** LCP, CLS, INP, FCP, and TTFB are reported to that endpoint on page load
- **AND** the `web-vitals` library is loaded via Partytown

#### Scenario: No web vitals when unset
- **WHEN** `site.tracking.webVitalsEndpoint` is unset
- **THEN** no `web-vitals` code is loaded and no beacon is sent

### Requirement: AI Tool Compatibility Files
The repository root MUST contain `.cursorrules` (for Cursor) and `.windsurfrules` (for Windsurf) files. These files MUST surface the same key principles, conventions, and constraints defined in `agents.md` so that AI coding assistants working on a client project cloned from this template inherit the architectural context automatically. The content of these files MUST be kept in sync with `agents.md` (a CI check MAY verify this; if not, a `CONTRIBUTING.md` note must instruct contributors to keep them in sync).

#### Scenario: Cursor reads .cursorrules
- **WHEN** a developer opens this repository in Cursor
- **THEN** the AI assistant has access to the project's key principles (component structure, asset pipeline, content collection rules, perf budgets, a11y rules) as system context

#### Scenario: Windsurf reads .windsurfrules
- **WHEN** a developer opens this repository in Windsurf
- **THEN** the AI assistant receives the same architectural context as Cursor users

#### Scenario: AI files stay in sync
- **WHEN** `agents.md` is updated to add a new rule or convention
- **THEN** a `CONTRIBUTING.md` note instructs contributors to apply the same change to `.cursorrules` and `.windsurfrules` (or a CI script enforces it)

### Requirement: LGPD Cookie Consent Gate
When `site.tracking` has any ID set (GTM, Meta Pixel, Hotjar, Clarity, or `webVitalsEndpoint`), the template MUST display a cookie consent banner before any tracking script is loaded. The banner MUST appear on first visit, persist the user's choice in `localStorage` or a cookie, and not load any tracking script until the user has accepted. The banner MUST be implemented as a small Astro island (≤ 5KB gz of additional JS) and MUST include accessible controls (a visible "Accept" button, a visible "Reject" button, a link to the privacy policy page). When `site.tracking` is fully empty, no banner is shown and no consent logic is loaded.

#### Scenario: No consent banner without tracking
- **WHEN** `site.tracking` has no IDs set
- **THEN** the built site contains no consent banner markup, no consent JS, and no localStorage reads related to consent

#### Scenario: Consent blocks tracking on first visit
- **WHEN** a user with `site.tracking.gtmId` set visits any page for the first time
- **THEN** the consent banner is visible
- **AND** no Partytown script for GTM fires
- **AND** no GTM network request is made

#### Scenario: Accepted consent enables tracking
- **WHEN** the user clicks "Accept" on the consent banner
- **THEN** the consent choice is persisted to localStorage
- **AND** Partytown scripts for all configured tracking IDs begin loading
- **AND** the banner is removed from the DOM

#### Scenario: Rejected consent keeps tracking off
- **WHEN** the user clicks "Reject" on the consent banner
- **THEN** the rejection is persisted to localStorage
- **AND** no Partytown script for any tracking ID loads during this or future visits
- **AND** the banner is removed from the DOM

#### Scenario: Consent banner is keyboard and screen-reader accessible
- **WHEN** a screen reader user opens the page with the banner visible
- **THEN** the banner has `role="dialog"` and `aria-labelledby` pointing to a heading
- **AND** both the Accept and Reject buttons are focusable and have descriptive labels
- **AND** focus is moved to the banner when it appears and restored to the trigger when it closes
