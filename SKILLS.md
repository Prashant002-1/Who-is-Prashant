---
name: prashant-portfolio
description: Design system and build rules for Prashant Shah's portfolio site. Use this skill whenever building, modifying, or adding pages to the portfolio. Covers visual direction, typography, color, layout, Astro patterns, and what to avoid. Read this before writing any code for the site.
---

# Prashant Shah — Portfolio Design System

## Philosophy

The site is a frame, not a painting, but a frame worth looking at. Every detail should feel intentional and elevated: the weight of a border, the rhythm between sections, the way type sits on the page. This is not minimalism by avoidance. It is premium by care. The site should feel like someone thought about every choice, because they did.

The work carries the substance. The site's job is to present it with enough craft that the presentation itself signals competence. Good typography, considered spacing, and polished micro-details (hover states, transitions, rhythm down the scroll) add up to a site that feels professional without trying to impress through spectacle.

## Stack

Astro 5 + React islands + Tailwind CSS + View Transitions API. Deploy to Vercel. Primary copy lives in `index.astro` unless you split partials. Optional markdown/MDX collections later. No CMS.

## Typography

Two fonts max, loaded via Google Fonts variable axes to minimize payload.

- **Headings:** Sora (geometric sans, warm curves, high legibility — not generic like Inter or Poppins). Use weight 600–700 for headings, 500 for subheadings. Slightly tightened letter-spacing at display sizes (-0.02em).
- **Body:** Source Serif 4 (screen-optimized serif, warm and readable at 16–18px). Creates editorial contrast with Sora without feeling stuffy. Line-height 1.6–1.7 for prose.
- **Code/labels:** JetBrains Mono at 14px for inline code and tech stack tags. Use sparingly.

Never use Inter, Roboto, Arial, system-ui, Space Grotesk, or Poppins. These are the defaults of everything that looks AI-generated.

## Color

Warm neutrals with a single accent. Define via CSS custom properties for easy dark mode.

```
--bg:        #FAFAF8      (warm off-white, not pure white)
--surface:   #F4F3F0      (slightly darker for cards, nav, elevated elements)
--text:      #1A1A1A      (soft black, not #000)
--muted:     #6B6B6B      (secondary text)
--border:    #E5E3DF      (warm gray rule)
--accent:    #2B6B5E      (deep teal — warm, serious, not startup-blue)
--accent-hover: #1F4F45
--bg-dark:   #1C1C1A      (warm dark, not pure black)
```

## Layout & Spacing

- Max content width: 680px for prose, 960px for pages with side elements.
- Generous vertical spacing between sections (4–6rem). Let things breathe.
- Single-page site: top nav jumps to in-page anchors (for example Work, Projects, About, Now). No separate routes for those sections.
- Work entries and project cards can use subtle border, light background tints (`--bg` slightly shifted), or fine divider lines to create visual separation. Cards should feel structured, not flat.
- Footer: GitHub, LinkedIn, email. Three links. Nothing else.

## Motion & Micro-Details

Page transitions via Astro `<ClientRouter />` with default fade (optional on a single-page build). Links: accent color with a smooth transition (150ms ease). Hover states should feel responsive and polished, not flashy. Subtle one-shot entrance animations on sections are fine. No scroll-jacking, no particle backgrounds, no looping ambient gimmicks.

## Astro Patterns

- Primary implementation: `src/pages/index.astro` with `src/layouts/Base.astro`.
- React islands only where interactivity earns it (for example a future in-page research graph). Use `client:visible` to defer hydration. The static portfolio ships zero JS by default.
- Images via Astro `<Image />` for automatic optimization. View Transitions optional on a single-page site.

## Taste Guardrails

These are not arbitrary restrictions. They are choices that keep the site feeling considered.

- No technology logo grids, skill bars, or tag clouds. The work demonstrates the skills.
- No hero sections with typing animations or rotating titles. Say it once, clearly.
- No contact form. Email link is enough.
- No "View Live Demo" for things that aren't deployed.
- Prose sections on the single page use paragraphs, not bullets as the only layer.
- No dependency that pushes a non-interactive page past 200KB.
- No em dashes in written content. Ever.

## Performance

Lighthouse 95+ all categories. FCP under 1s. Non-interactive pages under 200KB total. Non-negotiable — achievable with Astro defaults if you don't add unnecessary weight.