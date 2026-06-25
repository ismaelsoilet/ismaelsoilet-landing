## ADDED Requirements

### Requirement: Zero Critical Axe Violations
The template MUST produce pages with zero `critical` and `serious` axe-core violations across the rendered HTML of every page. CI MUST run `@axe-core/cli` (or equivalent) on the built site and fail the build on any critical or serious violation.

#### Scenario: Axe CI passes on home
- **WHEN** `@axe-core/cli` runs against the rendered home page
- **THEN** the exit code is 0 and the report contains zero `critical` or `serious` violations

#### Scenario: Axe CI passes on blog post
- **WHEN** `@axe-core/cli` runs against any rendered blog post
- **THEN** the exit code is 0 and the report contains zero `critical` or `serious` violations

### Requirement: Skip-to-Content Link
The rendered HTML MUST include a skip link as the first focusable element in the document, allowing keyboard users to bypass the navigation and jump directly to the main content.

#### Scenario: Skip link is first focusable
- **WHEN** a user tabs into the page from the address bar
- **THEN** the first focused element is a link that jumps focus to `<main id="main">` or equivalent

### Requirement: Visible Focus Indicators
Every interactive element (links, buttons, form controls, custom interactive components) MUST display a visible focus indicator when focused via keyboard. The indicator MUST meet WCAG 2.4.7 contrast requirements.

#### Scenario: Button shows focus ring
- **WHEN** a button receives keyboard focus
- **THEN** a visible focus ring (outline, ring, or equivalent) is rendered with sufficient contrast against the surrounding background

### Requirement: Color Contrast Compliance
All text and meaningful UI graphics MUST meet WCAG AA contrast ratios: 4.5:1 for body text, 3:1 for large text (≥ 18pt or 14pt bold) and meaningful UI components.

#### Scenario: Body text contrast on default theme
- **WHEN** a body paragraph is rendered in the default light theme
- **THEN** the computed contrast ratio between text and background is ≥ 4.5:1

#### Scenario: Body text contrast on dark theme
- **WHEN** a body paragraph is rendered in the dark theme
- **THEN** the computed contrast ratio between text and background is ≥ 4.5:1

### Requirement: Reduced Motion Support
The template MUST honor the `prefers-reduced-motion` media feature. When the user has set this preference, all non-essential animations (parallax, scroll-reveal, decorative transitions) MUST be disabled. Essential animations (theme toggle feedback, view transitions) MAY remain.

#### Scenario: Animations disabled
- **WHEN** a user has `(prefers-reduced-motion: reduce)` set
- **THEN** no scroll-reveal, fade-in, or decorative CSS animation runs

### Requirement: Reduced Transparency Support
The template MUST honor the `prefers-reduced-transparency` media feature. When set, all `backdrop-filter` effects MUST be replaced by opaque backgrounds.

#### Scenario: Backdrop removed
- **WHEN** a user has `(prefers-reduced-transparency: reduce)` set
- **THEN** the computed `backdrop-filter` is `none` on all components that would otherwise apply it

### Requirement: ARIA on Interactive Components
Custom interactive components (Tabs, Accordion if not native, dropdowns, modals) MUST expose proper ARIA roles, states, and properties. The Tabs component MUST use `role="tablist"`, `role="tab"`, `aria-selected`, and `aria-controls`. The native `<details>`/`<summary>` Accordion pattern is preferred and exempt from this requirement.

#### Scenario: Tabs are properly labeled
- **WHEN** a Tabs component is rendered
- **THEN** the tablist has an accessible name, each tab has `aria-selected` reflecting its state, and each tab panel has `role="tabpanel"` with `aria-labelledby` referencing its tab

### Requirement: Form Labels
Every form input MUST have an associated `<label>` element (via `for`/`id` pairing or wrapping) or an `aria-label`/`aria-labelledby`. Placeholder text MUST NOT be the only label.

#### Scenario: Contact form inputs are labeled
- **WHEN** the contact form is rendered
- **THEN** every `<input>`, `<select>`, and `<textarea>` has an associated `<label>` element with a `for` attribute matching the input's `id`

### Requirement: Form Success and Error Messaging
The contact form MUST announce submission success and error states via `aria-live` regions. Success messages use `aria-live="polite"`; error messages use `aria-live="assertive"`. The regions MUST be present in the DOM (initially empty) so that the live announcement fires the moment a message is inserted.

#### Scenario: Success is announced politely
- **WHEN** a form submission succeeds
- **THEN** the success message becomes visible inside an `aria-live="polite"` region and is announced by screen readers without interrupting current speech

#### Scenario: Error is announced assertively
- **WHEN** a form submission fails (non-2xx response or network error)
- **THEN** the error message becomes visible inside an `aria-live="assertive"` region and is announced immediately by screen readers

### Requirement: Honeypot Field Is Accessibility-Invisible
Honeypot anti-spam fields MUST be hidden from assistive technology using `aria-hidden="true"`, removed from the tab order using `tabindex="-1"`, and disabled from autofill using `autocomplete="off"`. They MUST NOT use `display: none` (which excludes them from form submission in some browsers) and MUST NOT use a visible `<label>`.

#### Scenario: Honeypot is not announced
- **WHEN** a screen reader user navigates the form
- **THEN** the honeypot field is skipped entirely (not announced, not focusable)

#### Scenario: Honeypot is submitted when filled
- **WHEN** a bot fills the honeypot field and submits the form
- **THEN** the field value IS included in the form data (so the server-side check can detect it)
- **AND** the form's client-side code aborts the submission without calling the webhook

### Requirement: Logical Heading Hierarchy
The rendered HTML MUST use heading levels in logical order (no skipped levels). Each page MUST have exactly one `<h1>`. Heading levels MUST NOT jump (e.g., `<h1>` to `<h3>` without an `<h2>`).

#### Scenario: Home has one h1
- **WHEN** the home page renders
- **THEN** the document contains exactly one `<h1>` element

#### Scenario: Heading levels do not skip
- **WHEN** any page renders
- **THEN** heading levels descend in order without skipping a level

### Requirement: Document Language
The `<html>` element MUST have a `lang` attribute matching the page locale.

#### Scenario: HTML lang is set
- **WHEN** any page renders in pt-BR
- **THEN** the `<html>` element has `lang="pt-BR"`
