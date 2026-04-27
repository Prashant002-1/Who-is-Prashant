---
name: prashant-portfolio
description: Build and maintenance rules for Prashant Shah's single-page portfolio site.
---

# Portfolio Build Rules

## Current Architecture

The live site is a single Astro page at `src/pages/index.astro`. It owns its HTML document, CSS, and browser JavaScript directly.

Do not add a shared layout, route components, React islands, Tailwind, MDX, or content collections unless the product direction changes and the dependency earns its place.

## Design System

- Headings use Sora.
- Body copy uses Source Serif 4.
- Technical labels use JetBrains Mono.
- Use warm dark neutrals and one teal accent.
- Keep the page type-forward, dense, and readable.
- Motion should be subtle and tied to interaction or orientation.

## Content Shape

The page is the whole portfolio:

- `#hero`
- `#work`
- `#research`
- `#about`
- `#now`

Use hash links for internal navigation. Do not link to removed routes such as `/work`, `/research`, `/about`, or `/now`.

## Implementation Guardrails

- Keep dependencies minimal.
- Avoid generic abstractions for one-off page behavior.
- Prefer direct CSS and browser APIs.
- Keep comments sparse.
- No emojis in code.
- No contact form, logo grid, skill bars, or decorative tech demo.
- Verify with `npm run build` before considering cleanup complete.
