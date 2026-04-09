---
name: prashant-portfolio
description: Design system and build rules for Prashant Shah's portfolio. Load whenever building, modifying, or adding pages. Covers visual direction, glassmorphic tokens, typography, color, Astro patterns, and what to avoid. Read this before writing any code for the site.
---

# Prashant Shah — Portfolio Design System

## Philosophy

Ethereal Glassmorphic Dreamcore. Full-bleed atmospheric AI-generated backgrounds per page. Glassmorphic content panels floating over the scene. Deep dark base, luminous glass, dramatic typography. The frame should feel like it belongs to the same world as the content — not a container on top of it.

The work carries the substance. The site's job is to present it with enough craft that the presentation itself signals taste. Every detail intentional: the way type sits on glass, the glow on an active link, the lift when a card is hovered.

## Site Structure

```
/           Home — 30-second version of Prashant
/work       Work experience only — Trimble, Novartis, Center for Food Action (paid/internship roles)
/projects   Personal projects + research — Canvas Agent, EmotionFlix, knowledge graph research (prose, no D3 viz yet)
/thinking   Short essays on how he reasons through problems
/now        What he's doing right now
/about      The full person
```

`/work` and `/projects` are intentionally separate. Work = where he was employed. Projects = what he built.

## Stack

Astro 5 + React islands + Tailwind CSS v4 + View Transitions API. Deploy to Vercel. Content in markdown/MDX via Astro content collections with typed frontmatter (glob loader). No CMS.

## Color Tokens

Defined as CSS custom properties in `src/styles/global.css` via `@theme {}`. Use these everywhere — no hardcoded hex values in components.

```
--color-bg:             #09090f      (near-void dark, warm black-violet)
--color-surface:        rgba(255,255,255,0.08)   (primary glass panel)
--color-surface-hover:  rgba(255,255,255,0.13)
--color-text:           #f0eef8      (near-white, slight violet cast)
--color-muted:          rgba(240,238,248,0.55)
--color-border:         rgba(255,255,255,0.12)   (refractive border)
--color-border-bright:  rgba(255,255,255,0.25)   (hover/focus border)
--color-accent:         #a78bfa      (soft violet)
--color-accent-hover:   #c4b5fd
--color-glow:           rgba(167,139,250,0.2)
```

## Glass Primitives

Two CSS classes defined globally in `src/styles/global.css`. Apply `.glass` to any panel, card, nav, footer.

```css
.glass {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
  transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.glass-hover (or .glass applied to interactive element):hover {
  background: rgba(255,255,255,0.13);
  border-color: rgba(255,255,255,0.25);
  box-shadow: 0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
  transform: translateY(-2px);
}
```

Never animate `backdrop-filter` — severe performance penalty.

## Typography

Two fonts. Loaded via Google Fonts variable axes.

- **Headings:** Sora, weight 600–700. Letter-spacing -0.02em at display sizes. Geometric, warm curves.
- **Body:** Source Serif 4, weight 400. 17px, line-height 1.65. Editorial serif on dark glass is a differentiator — do not swap for Poppins, Raleway, or any generic sans.
- **Code/labels:** JetBrains Mono, 14px. Use sparingly.

Never use: Inter, Roboto, Arial, system-ui, Space Grotesk, Poppins, Montserrat. These are the defaults of everything that looks AI-generated.

Home h1: 72px desktop / 48px mobile. Other page h1: 48px desktop / 36px mobile.

## Background Architecture

Each page passes a `bg` slug to `Base.astro`. `SceneBackground.astro` handles the visual:
- Loads `/backgrounds/{slug}.jpg` as background-image if provided
- Falls back to a per-page CSS gradient (defined inside SceneBackground, keyed by slug)
- Position fixed, z-index: -1, covers full viewport
- `pointer-events: none`

User drops AI-generated images into `public/backgrounds/` as: `home.jpg`, `work.jpg`, `research.jpg`, `thinking.jpg`, `now.jpg`, `about.jpg`.

Gradient fallbacks are intentionally tuned per page so the site looks good before images arrive.

## Layout

- Nav: `position: fixed`, top 0, full-width. Glass treatment. Z-index 10. Height ~64px.
- Main content: `padding-top: 64px` to clear fixed nav.
- Prose pages: max-width 680px, centered.
- Wide pages (research with graph, work grid): max-width 960px.
- Footer: glass panel, centered, 3 links only.

## Astro Patterns

- Pages in `src/pages/`, layout in `src/layouts/Base.astro`.
- Base.astro accepts: `title`, `description`, `bg` (page slug), `wide` (boolean).
- React islands via `client:visible`. Pages without islands ship zero JS.
- `/thinking` entries: `.md` in content collection. Schema: `{ title, date, description }`.
- View Transitions: `<ClientRouter />` in Base. `transition:name` on page title and main content.
- Images via Astro `<Image />` for automatic optimization.

## Motion

- Page transitions: Astro `<ClientRouter />` default fade.
- Glass card entrance: `opacity 0→1` + `translateY(20px→0)`, 0.6s `cubic-bezier(0.25, 0.46, 0.45, 0.94)`, staggered via `animation-delay`. Once per element.
- Hover states: 0.25s ease-out on cards. Links: 150ms ease.
- Never animate: `backdrop-filter`, parallax, scroll-jacking, particle backgrounds, looping animations.

## Taste Guardrails

- No technology logo grids, skill bars, or tag clouds.
- No hero sections with typing animations or rotating titles.
- No contact form. Email link only.
- No "View Live Demo" for things not deployed.
- Prose pages use paragraphs, not bullets.
- No em dashes in written content. Ever.
- Non-interactive pages under 200KB total. Achievable with Astro defaults.
- The hero name on the home page floats directly over the background — no glass panel behind it.
- Text over backgrounds: use `text-shadow` for legibility, not opaque boxes.

## Performance

Lighthouse 95+ all categories. FCP under 1s. Non-interactive pages under 200KB.
