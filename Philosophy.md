# Portfolio Philosophy

This site is now a single-page personal portfolio. The shipped product is `src/pages/index.astro`.

## Product Shape

The page contains the complete visitor path:

- Hero with name, positioning, GitHub contribution activity, contact, and resume link.
- Work section with selected projects and concise expandable detail.
- Research section with the retrieval research summary and key stats.
- About section with personal context and career positioning.
- Now section with current work, learning, search status, and contact.
- Fixed status strip with current signals and social links.

Legacy routes such as `/work`, `/research`, `/about`, and `/now` are intentionally removed. Navigation should use hash links on the home page.

## Design Direction

The site should feel deliberate, dark, editorial, and technical without becoming a generic terminal aesthetic. Typography and spacing carry the page. Motion should support orientation and interaction, not become the point.

Current core choices:

- Headings: Sora.
- Body: Source Serif 4.
- Labels and compact metadata: JetBrains Mono.
- Palette: warm near-black, muted gray text, deep teal accent.
- Structure: single document with inline CSS and small inline JavaScript.

## Engineering Direction

Keep the implementation small. The current page does not need React, MDX, Tailwind, content collections, shared layouts, or route-level components. Add dependencies only when the page cannot reasonably do the job without them.

Prefer direct Astro, HTML, CSS, and browser APIs. If the site grows again, make that decision explicitly instead of reintroducing the old architecture by accident.

## Guardrails

- No route files unless the product intentionally becomes multi-page again.
- No stale navigation to deleted routes.
- No framework or build dependency without a live use in the shipped page.
- No fallback content that hides broken data. Fail clearly, fix the issue.
- No generic portfolio filler such as logo grids, skill bars, contact forms, or decorative tech demos.
- Keep comments rare and useful.
