# Portfolio Philosophy

This site is a single-page personal portfolio with one companion page. The shipped product is `src/pages/index.astro`, plus `src/pages/freelance.astro` for contract work.

## Product Shape

The page contains the complete visitor path:

- Hero with name, positioning, GitHub contribution activity, contact, and resume link.
- Work section with selected projects and concise expandable detail.
- Research section with the retrieval research summary and key stats.
- About section with personal context and career positioning.
- Now section with current work, learning, search status, and contact.
- Fixed status strip with current signals and social links.

Legacy routes such as `/work`, `/research`, `/about`, and `/now` are intentionally removed. Navigation should use hash links on the home page.

The one intentional route is `/freelance/`: a freelance profile with services, open-source repositories, tools, and an invitation to work together. It shares the home page's tokens, type roles, navigation, and status strip.

## Design Direction

The site should feel deliberate, dark, editorial, and technical without becoming a generic terminal aesthetic. Typography and spacing carry the page. Motion should support orientation and interaction, not become the point.

Current core choices:

- Headings: Sora.
- Body: Source Serif 4.
- Labels and compact metadata: JetBrains Mono.
- Palette: warm near-black, muted gray text, deep teal accent.
- Structure: two pages sharing `src/styles/portfolio.css`, with the navigation and status strip as small components.

## Engineering Direction

Keep the implementation small. The current page does not need React, MDX, Tailwind, content collections, shared layouts, or route-level components. Add dependencies only when the page cannot reasonably do the job without them.

Prefer direct Astro, HTML, CSS, and browser APIs. If the site grows again, make that decision explicitly instead of reintroducing the old architecture by accident.

## Guardrails

- No route files beyond `/freelance/` unless the product intentionally grows again.
- No stale navigation to deleted routes.
- No framework or build dependency without a live use in the shipped page.
- No fallback content that hides broken data. Fail clearly, fix the issue.
- No generic portfolio filler such as logo grids, skill bars, contact forms, or decorative tech demos.
- Keep comments rare and useful.
