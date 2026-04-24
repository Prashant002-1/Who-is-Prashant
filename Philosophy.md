# Portfolio Website — Content Plan

**Stack:** Astro + React islands (only when needed) + Tailwind CSS + View Transitions API  
**Deploy:** Vercel (free tier, instant deploys, analytics)  
**Domain:** TBD  
**Routes:** **`/` only.** One scroll, one URL, enough craft that it does not need a maze of pages.

---

## Design Philosophy

### The Portfolio Is the Frame, Not the Painting

The work is the impressive part. The site is the delivery mechanism. A clean, fast, well-typeset page that loads instantly and communicates clearly IS the engineering statement. It says: "I made a hundred small decisions here and every one of them was intentional." That is taste. That is what good engineers actually notice.

Creative and engineering energy goes into what is **on the page**, not into routing:

1. **Research, projects, and experience** told in real prose on the same scroll. Depth lives in clarity, not in separate URLs.
2. **Optional later:** a React island (for example a knowledge graph) embedded in-page if it is truly the content and not decoration. Until then, static explanation is enough.
3. **Long-form writing** (essays, explainers) is **not** a `/thinking` route. If you publish that kind of work, use PDF, a personal note, Medium, GitHub, or another channel. The portfolio stays one page so it stays fast and honest.

Everything else stays quiet, fast, and precise.

### The Three Speeds

The single page still works for three audiences at three speeds:

1. **30 seconds (recruiter scan):** Name, one-liner, strongest signals, resume download. No friction.
2. **2 minutes (engineer browse):** Experience, projects, research summary. Every link that exists should go somewhere real (repo, press, email).
3. **10 minutes (deep dive):** They keep scrolling. The "Now" block shows the site is alive. The quote and personal sections make you memorable.

### Visual Direction

- **Type-forward.** Headings and body chosen for readability and character, not default sans.
- **Warm and precise.** Not cold-minimalist. Not bubbly. Warm neutrals with one accent. The warmth says "person," the precision says "engineer."
- **Generous whitespace.** Dense content is fine as long as the layout gives the eye room to rest.
- **Restrained motion.** View Transitions if the stack adds more later. No scroll-jacking, no particle fields, nothing that loops for show.

### What This Site Is Not

- Not a tech demo disguised as a portfolio
- Not a dark-mode terminal aesthetic
- Not a resume with better CSS
- Not a blog-shaped site with one post
- Not trying to impress with how it was built — trying to impress with what it contains

---

## Site Structure

```
/   → Everything: hero, about, connect, now, experience, projects and research,
           extended about, footer links
```

**Anchor sections** (same page): `#work`, `#projects`, `#about`, `#now`. Nav jumps in-page; no second route for "now."

There is **no** `/thinking`, `/work`, `/research`, `/about`, or `/now` as separate pages. If the spec below still describes "chapters" of content, those chapters are **sections** on `/`, not URLs.

---

## Single-Page Content Map

### Hero (above the fold)

- Name, large and confident
- One line that is not a job title. Honest about what you actually do.
- Status or proof lines: internships, research thread, graduation and search
- Resume and email

### About

Short first-person paragraphs: what you build, background, languages, school, signal moments (CS club, guests, and so on).

### Connect

GitHub, LinkedIn, email, Letterboxd (or whatever links you want kept to a small set).

### Now (`#now`)

Updated regularly. Short blocks: Building, Researching, Learning, Watching, Looking for. **Last updated** date at the top of the block so the page feels current.

### Experience (`#work`)

Curated roles, most impressive first. Prose per role, not resume bullets as the only layer.

### Projects and research (`#projects`)

Featured research narrative plus project cards. Links to repos and press where they exist.

### More about me (`#about`)

Range, education, awards, art strip if you keep it. Optional photo in `public/` when you have one you like.

### Closing

One line or quote that ties the work to how you think.

### Footer

GitHub, LinkedIn, email. Nothing else.

---

## Reference: What Each "Chapter" Should Say

The older multi-page outline is still useful as **writing guidance**. Fold this material into sections on `/` rather than splitting routes.

### Work and projects (combined on the page)

Order by impact, not only chronology. Each entry: problem, what you built, what is interesting, stack. Prefer prose over bullet stacks.

Entries to cover (adjust as needed):

1. **Canvas Agent** — LMS agent, tools, SQL discipline, memory, HackRamapo.
2. **Trimble** — config platform, distributed systems, auth story.
3. **Novartis** — proposal workflow, Azure, stakeholder iteration.
4. **Center for Food Action** — pantry system, touch-first, real users.
5. **EmotionFlix** — on-device emotion, tests, stack.

### Research (section on the same page)

**Title angle:** Resolving intent-content conflict in retrieval.

Plain-language problem, how the approach works at a high level, what you measured, advisor credit, link to code or paper when ready.

**Optional later:** an in-page interactive graph (D3) only if it is the research made tangible, not chrome. Ships as a React island; the rest of the page stays light.

### Thinking (not on this site)

Short essays are valuable, but **not** as `/thinking` routes. Write them where long reading fits (PDF, blog, newsletter). Link from the single page only if you want a pointer to one piece.

---

## Technical Notes

### Why Astro

- Zero JS by default for static blocks.
- One document can still host an island where interactivity earns it.
- View Transitions stay available if you ever add a second route; for a single page they are optional polish.
- Deploys to Vercel quickly.

### Content management

No CMS. Edit copy in `src/pages/index.astro` or split partials later if it helps. The `Now` block is plain markup you update when life changes.

### Performance targets

- Lighthouse 95+ where it matters for a static page
- First Contentful Paint under 1s on a good connection
- Total weight stays lean: no dependency that exists to look impressive

---

## Build order (practical)

1. Hero and tone
2. Experience and projects sections
3. Now block (fast to refresh)
4. About and closing
5. Optional: embed research viz when the subgraph and story are ready

---

## Open questions

1. **The one-liner under your name.** What is the truest single sentence?
2. **Photo.** Add to the page when you have one that feels like you, not only when you have a headshot.
3. **Domain.** prashantshah.dev, shah.dev, or something else?
4. **Equalizer thread.** Personal belief woven into the about section only, or echoed once in the hero? Your call.
