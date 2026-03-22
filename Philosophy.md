# Portfolio Website — Content Plan & Sitemap

**Stack:** Astro + React islands + Tailwind CSS + View Transitions API  
**Deploy:** Vercel (free tier, instant deploys, analytics)  
**Domain:** TBD

---

## Design Philosophy

### The Portfolio Is the Frame, Not the Painting

The work is the impressive part. The site is the delivery mechanism. A clean, fast, well-typeset site that loads instantly and communicates clearly IS the engineering statement. It says: "I made a hundred small decisions here and every one of them was intentional." That's taste. That's what good engineers actually notice.

A Windows-clone portfolio impresses developers on Twitter for a day. A sub-200KB page with genuinely interesting things to read on it impresses the people who are actually hiring.

Creative and engineering energy goes into exactly two things:

1. **The interactive knowledge graph visualization** on the research page. This is a legitimate technical piece (D3, data modeling, making a complex idea tangible). It's not decoration — it IS the content.
2. **The quality of the writing** in /thinking. This is where you show how you reason, which is the thing that actually separates you from other new grads with similar resumes.

Everything else stays quiet, fast, and precise.

### The Three Speeds

The site works for three audiences at three speeds:

1. **30 seconds (recruiter scan):** Name, one-liner, three strongest signals, resume download. No friction.
2. **2 minutes (engineer browse):** Research depth, real project details, technical taste. Everything clickable leads somewhere worth reading.
3. **10 minutes (deep dive):** Writing on how you think, interactive research visualization, the personal stuff that makes you memorable.

### Visual Direction

- **Type-forward.** A strong geometric sans or humanist sans for headings, a readable body font. Typography does 80% of the design work. Think: well-typeset magazine article, not SaaS landing page.
- **Warm and precise.** Not cold-minimalist. Not bubbly. A palette built on warm neutrals (off-white, warm gray, soft black) with one accent color — something like a deep teal or muted indigo. The warmth says "person," the precision says "engineer."
- **Generous whitespace.** Dense content is fine as long as the layout gives the eye room to rest.
- **No ornamental motion.** Page transitions via Astro's View Transitions API. No parallax, no particle backgrounds, no scroll-jacking. Nothing that loops or pulses. The site should feel like it loads and gets out of the way.

### What This Site Is Not

- Not a tech demo disguised as a portfolio
- Not a dark-mode terminal aesthetic
- Not a resume with better CSS
- Not trying to impress with how it was built — trying to impress with what it contains

---

## Site Structure

```
/                     → Home (the 30-second version of you)
/work                 → What you've built (projects + roles, interwoven)
/research             → Intent-content conflict research (its own page)
/thinking             → How you reason through problems (short writing pieces)
/now                  → What you're doing right now
/about                → The full person
```

Six pages. No blog index with zero posts. No "services" page. Nothing that exists because portfolio sites are "supposed to have" it.

---

## Page-by-Page Content Plan

### 1. Home `/`

The landing page. One scroll. No hero animation.

**Above the fold:**
- Your name, large and confident
- A one-liner that isn't a job title. Not "Full-Stack Developer" or "AI/ML Engineer." Something honest about what you actually do. Examples to riff on:
  - *"I build software that works for the people using it."*
  - *"CS + Data Science at Ramapo. I build tools that close the gap between what systems know and what people need."*
  - Write your own. The best version comes from you.
- Three proof points (small, typographic, no icons):
  - "Built production systems at Trimble and Novartis"
  - "Research: emotion-aware retrieval with knowledge graphs"
  - "Graduating May 2026 — looking for full-time roles"
- Resume download link (PDF, always current)

**Below the fold (one scroll):**
- 2–3 featured pieces of work. Not a grid of cards. Each gets a sentence of context and a link:
  - **The Canvas Agent** — tool-calling AI agent over LMS data, won HackRamapo
  - **Trimble** — production config platform, distributed systems, C#/.NET
  - **The Research** — what happens when user intent contradicts content semantics?
- A "Currently" micro-section: one sentence about what you're working on now (links to /now)
- Footer: GitHub, LinkedIn, email. Nothing else.

**What this page does NOT have:**
- A grid of technology logos/icons
- An "about me" paragraph (that's its own page)
- A contact form
- Animated skill bars or tag clouds
- Anything that exists to show off the site rather than show off the work

---

### 2. Work `/work`

This replaces both "Projects" and "Experience." What you built and why matters more than whether it was a personal project or an internship.

**Structure:** A curated list ordered by what's most impressive, not chronological. Each entry is a mini case study: the problem, what you built, what's interesting about it, and the stack. 3–5 short paragraphs per entry. Prose, not bullet points.

**Entries (suggested order):**

1. **Personal Canvas Agent**
   - Problem: Students juggle five Canvas pages to figure out what's due. The LMS has the data but won't surface it usefully.
   - Built: Multi-step tool-calling agent, 9 typed tools, parameterized SQL (no model-generated SQL), persistent memory via pgvector, reactive planner that diffs academic state per request.
   - Interesting decision: Per-session write locks to prevent race conditions. Context compaction via secondary LLM call.
   - Result: Won HackRamapo.
   - Stack: TypeScript, Next.js, PostgreSQL, pgvector, Vercel AI SDK

2. **Trimble: Configuration Management Platform**
   - Problem: Config conflicts across a distributed broker architecture cost engineering teams hours of debugging.
   - Built: Production platform in C#/.NET and Azure that centralized service settings. REST APIs integrating with TMW Suite for customer-specific config across messaging, event handling, and dispatch.
   - Auth: Built an auth proxy using Azure Workload Identity Federation for role-based access control.
   - Stack: C#, .NET, Azure, Blazor, REST APIs

3. **Novartis: Project Proposal Automation**
   - Problem: Proposals took 2 days to process through a manual approval pipeline.
   - Built: React/TypeScript frontend + serverless Azure Functions backend, integrated with SharePoint via SPFx. Real-time tracking dashboards for budget and team allocation.
   - Approach: Gathered requirements directly from stakeholders, iterated from feedback, not from a spec doc.
   - Stack: React, TypeScript, Azure Functions, PostgreSQL, SharePoint/SPFx

4. **Center for Food Action: Pantry Inventory System**
   - Problem: Volunteers manually logged every donated item while physically handling donations — any interface needs to work one-handed on an iPad.
   - Built: Flask + PostgreSQL system with barcode scanning and a touch-first interface designed for the actual context of use.
   - Stack: Python, Flask, PostgreSQL, SQLAlchemy

5. **EmotionFlix**
   - Problem: Movie recommendations ignore how you're feeling right now.
   - Built: On-device facial emotion detection mapped to genre preferences via hybrid scoring. Adaptive learning from user interactions. 69 tests covering auth, SQL injection, and recommendation accuracy.
   - Stack: React, TypeScript, Node.js, Express, PostgreSQL

Each entry links to GitHub where applicable. No "View Live Demo" buttons for things that aren't live.

---

### 3. Research `/research`

Its own page because it's genuinely interesting work that most new grads don't have. Give it room.

**Title:** "Resolving Intent-Content Conflict in Retrieval"

**Structure:**

1. **The problem in plain language** (2–3 sentences)
   What happens when someone asks for "a happy movie about war"? The intent (happy) contradicts the content semantics (war movies are usually dark). Most retrieval systems optimize for one signal or the other. This research asks: can we resolve that conflict?

2. **How the system works** (the technical substance, but accessible)
   - Heterogeneous knowledge graph over MovieLens 25M with User/Movie/Emotion nodes
   - Emotions encoded as first-class entities with weighted EVOKES edges
   - Graph Transformer encoder aligned to SentenceBERT space
   - Hybrid scoring with tunable affective displacement penalty

3. **What we found**
   - 1,600 synthetic queries across aligned and conflicting conditions
   - 0.037 reduction in normalized affective displacement error in conflict scenarios
   - Edge-removal interventions confirmed emotion edges are causally necessary

4. **Interactive visualization** (React island) — **This is where the creative investment goes.**
   A small interactive knowledge graph showing User → Emotion → Movie connections. Visitors toggle emotion edges on/off and see how rankings change. A curated ~30 node subgraph that demonstrates the concept. This isn't a gimmick bolted onto the site — it's the research itself made tangible. It earns its complexity because it IS the content, not decoration around the content.
   Astro's island architecture means the rest of the page stays static HTML while this one component loads React + D3.

5. **Advisor credit and link to paper/presentation when available**

---

### 4. Thinking `/thinking`

Not a blog. A collection of short (500–800 word) pieces on problems you've encountered and how you reasoned through them. **This is the second place creative energy goes.** The writing quality here is what separates you from other new grads with similar resumes. An engineer who can explain hard problems clearly is rare, and these pieces are the proof.

**Format:** Title, date, prose. No tags, categories, or "read time" badges. Just writing.

**Starter pieces (write 2–3 to launch):**

1. **"When Intent Contradicts Content"**
   The plain-language version of the research problem. Why does "happy movie about war" break retrieval? What does it mean to resolve it? The piece you'd send someone who asks "what's your research about?" at a career fair.

2. **"Why I Don't Let the Model Write SQL"**
   From the Canvas Agent: 9 typed tools with parameterized SQL instead of LLM-generated queries. Why? What are the failure modes? This shows engineering judgment.

3. **"Building for Someone Holding a Box of Canned Goods"**
   The pantry system. How do you design a UI for someone physically handling items while using the interface? What changes when you actually watch someone try to use your software in context? This shows product thinking.

These should read like you explaining something to a smart person who's interested. Direct, concrete, no filler.

---

### 5. Now `/now`

A single page, updated regularly, that says what you're currently focused on.

**Sections (1–3 sentences each):**

- **Building:** What you're working on right now
- **Researching:** Where the research stands
- **Learning:** What you're studying or exploring
- **Reading:** A book, paper, article — whatever's on your desk
- **Looking for:** "Full-time SWE/AI roles starting Summer 2026. Open to backend, AI/ML, and distributed systems. I need visa sponsorship (OPT → H-1B)."

**Last updated: [date]** at the top. Signals the site is alive.

---

### 6. About `/about`

The person behind the work. This is where range and personality live.

**Structure:**

1. **A real photo.** Not a corporate headshot. Something that looks like you.

2. **First-person narrative (3–4 paragraphs):**
   - Where you come from and what brought you to CS. The equalizer belief lives here naturally, not as a thesis statement, but as context for why you care about what you build.
   - The three languages you speak and what that means to how you see problems.
   - The range: managed 17 RAs and a residential community of 200+, co-founded the CS club and brought in Bjarne Stroustrup, led the math club, competed in ICPC.
   - What you care about building and why.

3. **The things that don't fit on a resume:**
   - Canstruction (1st place building structures from canned food)
   - Student Employee of the Year
   - Whatever else makes you, you

4. **A closing line** that connects the personal back to the professional. Not a CTA. Just a sentence that ties it together.

---

## Technical Notes

### Why Astro
- Zero JS by default. Your /about page doesn't need React. Your /research page needs one interactive component. Astro lets you be precise.
- View Transitions API built in for smooth page transitions without a SPA.
- MDX support for /thinking pieces — write in markdown, it just works.
- React islands where you need interactivity (knowledge graph viz, future demos).
- Deploys to Vercel in seconds.

### Interactive Knowledge Graph (The One Place to Over-Engineer)
- **D3.js force-directed graph** with a curated ~30 node subgraph.
- Click a user node to highlight emotion connections. Toggle emotion edges to show ranking shifts.
- This is the one piece of the site where complexity is justified because the visualization IS the content. Invest time here. The rest of the site should be fast, static, and simple.

### Content Management
No CMS. Markdown files in the repo. The /now page is a .md file you edit and push. /thinking pieces are .mdx files in Astro content collections with typed frontmatter.

### Performance Targets (This IS the Flex)
- Lighthouse 95+ across the board
- First Contentful Paint < 1s
- Total page weight < 200KB on non-interactive pages
- Achievable with Astro's defaults. A site this fast, this clean, with content this good — that's the statement. Don't compromise it by adding things that don't serve the work.

---

## Build Order

1. Scaffold Astro project with Tailwind + page structure
2. Home page — get the above-the-fold tone right. Everything flows from here.
3. Work page — Canvas Agent and Trimble entries first (strongest two)
4. About page — write the personal narrative
5. Research page — static content first, interactive viz as a second pass
6. Thinking — write 1–2 pieces
7. Now page — takes 10 minutes, do it last

---

## Open Questions

1. **The one-liner.** What do you want to say about yourself in one sentence?
2. **Color accent.** Any instinct, or should we explore options visually?
3. **Photo.** Have one you like, or work around it for now?
4. **Domain.** prashantshah.dev? shah.dev? Something else?
5. **The equalizer belief.** Woven into the /about narrative, or the through-line of the whole site?