# Content Brief

Everything needed to keep the **single-page** portfolio (`/`) sharp. Answer inline under each prompt, or in whatever way is easiest. Where narrative is requested, write freely. Where short answers are requested, keep it tight.

The site is **one URL**: hero, about, connect, now, experience, projects and research, more about, footer. Nav uses in-page anchors (`#work`, `#projects`, `#about`, `#now`). There are no separate routes for those blocks.

---

## Global

### Links

Placeholders in the footer should match your real profiles.

```
GitHub URL:
LinkedIn URL:
Email:
```

### Resume

Drop a `resume.pdf` into `public/` when ready. The home page links to `/resume.pdf`.

### Photo

Want a photo in the **More about me** section? Drop it into `public/` and note the filename. If not yet, the layout works without it.

```
Photo filename (or "skip for now"):
```

### Domain

```
Domain:
```

---

## Hero (top of `/`)

### The one-liner

Under your name. Not a job title. A sentence that says what you actually do or care about.

```
One-liner:
```

### Proof points

Three short lines a recruiter should absorb in 10 seconds.

```
1:
2:
3:
```

### Status line

The line next to the live dot (what you are doing right now at a glance).

```
Status line:
```

---

## About (first content section)

Same goals as before: two short paragraphs that sound like you. Refine anytime.

```
(optional notes or replacement copy):
```

---

## Connect

Confirm which outbound links stay. Keep the set small.

---

## Now (`#now` block)

Updated on a rhythm you choose (monthly is fine). Short answers, 1–3 sentences each.

```
Building:
Researching:
Learning:
Watching:
Looking for:
Last updated (set when you edit the block):
```

---

## Experience (`#work`)

The spec still wants **story and judgment** behind each role. Same interview-style prompts as before; the output is folded into the Experience section on `/`, not a separate `/work` page.

### Canvas Agent

```
What specifically frustrated you about Canvas that made you build this?

One interesting technical decision and why (for example write locks or context compaction).

What did the hackathon demo look like? What did judges respond to?

GitHub URL (or "private"):
```

### Trimble

```
The pain you saw before your platform — make it concrete.

Why Azure Workload Identity Federation for auth — what constraint?

One thing you are proud of that is not on your resume?

GitHub URL (or "private/proprietary"):
```

### Novartis

```
What changed between v1 and final because of a conversation with a user?

What did the dashboards actually show?

GitHub URL (or "private/proprietary"):
```

### Center for Food Action

```
How did you learn the one-handed iPad requirement?

Anything that still sticks with you?

GitHub URL (or "private"):
```

### EmotionFlix

```
Where did the idea come from?

Why that depth of testing?

GitHub URL (or "private"):
```

---

## Projects and research (`#projects`)

### Research narrative

```
Elevator pitch in plain language (3–4 sentences).

What drew you to the problem?

Advisor name and link if public.

Paper or presentation link when available.

(Optional) If you later embed a graph, subgraph export or synthetic data approach:
```

### Project blurbs

Rewrite cards on the page so each sounds like you. Confirm links to repos and press.

---

## More about me (`#about`)

### Narrative

First person. Where you are from, what brought you to CS, languages, range (clubs, leadership, ICPC), what kind of engineer you want to be.

```
(draft or notes):
```

### Things that do not fit on a resume

```
Canstruction, awards, hobbies — whatever is real:
```

### Closing line

One sentence tying personal context back to the work.

```
Closing line options:
```

---

## Long-form writing (not a site route)

Essays and deep dives do **not** live at `/thinking`. Publish elsewhere (PDF, Medium, personal blog, repo README) and link from this page only if you want a pointer.

If you draft pieces for your own use, topics that still help your voice:

1. When intent contradicts content (research in plain language)
2. Why you do not let the model write SQL
3. Building for someone holding a box of canned goods

---

## Design decisions

### Accent color

Current build uses a warm violet / dusk glass direction. Say if you want a different accent.

```
Color preference:
```

### Equalizer belief

Technology as equalizer: keep in the **about** section only, or echo once in the hero?

```
Equalizer approach:
```

---

## What happens next

1. Drop copy into `src/pages/index.astro` (or ask for a pass section by section).
2. Refresh the **Now** block when life changes; bump **Last updated**.
3. Optional later: one React island for a research graph if it earns the bytes.

Take your time on narrative. Short factual blocks can ship first.
