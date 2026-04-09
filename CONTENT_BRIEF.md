# Content Brief

Everything I need from you to build the full site. Organized by page, with format guidance for each item. Answer inline under each prompt, or in whatever way is easiest. Where I ask for narrative, write freely. Where I ask for short answers, keep it tight.

---

## Global (affects multiple pages)

### Links

I have placeholders in the footer. Give me the real ones.

```
GitHub URL:
LinkedIn URL:
Email:
```

### Resume

Drop a `resume.pdf` into the `public/` folder when ready. The download link on the home page already points to `/resume.pdf`.

### Photo

Do you have a photo you want on `/about`? If yes, drop it into `public/` and tell me the filename. If not, I'll design around its absence for now.

```
Photo filename (or "skip for now"):
```

### Domain

Any preference?

```
Domain:
```

---

## Home `/`

### The One-Liner

This sits directly under your name. It's the first thing anyone reads. Not a job title. Not a tagline. A sentence that says what you actually do or care about. Philosophy.md suggested two options:

- "I build software that works for the people using it."
- "CS + Data Science at Ramapo. I build tools that close the gap between what systems know and what people need."

Write your own if neither feels right. This should sound like you, not like a LinkedIn headline.

```
One-liner:
```

### Proof Points

Three short lines under the one-liner. I have defaults from the spec but you should own these. What are the three things a recruiter should absorb in 10 seconds?

```
1:
2:
3:
```

### Featured Work Blurbs

Each featured project on the home page gets one sentence of context. I have drafts from the spec. Rewrite if they don't sound like you, or confirm they're good.

**Canvas Agent:**
> A tool-calling AI agent over LMS data with 9 typed tools, parameterized SQL, and persistent memory via pgvector. Won HackRamapo.

**Trimble:**
> Production configuration management platform in C#/.NET and Azure for a distributed broker architecture.

**Research:**
> What happens when user intent contradicts content semantics? Resolving affective conflict in retrieval with knowledge graphs.

```
Canvas Agent (rewrite or "good"):
Trimble (rewrite or "good"):
Research (rewrite or "good"):
```

### Currently

One sentence about what you're doing right now. I have: "Finishing up research and looking for full-time roles starting Summer 2026." Update if needed.

```
Currently:
```

---

## Work `/work`

The spec outlines 5 projects. For each one, I need you to fill in the gaps that only you can fill. The spec gives me the skeleton (problem, what you built, stack). What I need from you is the **story** and the **judgment calls**.

For each project, answer these. Write in first person, as much or as little as you want. I'll shape it into prose.

### Canvas Agent

```
What specifically frustrated you about Canvas that made you build this?

Walk me through one interesting technical decision you made and why.
(The spec mentions per-session write locks and context compaction.
Pick one and explain like you're telling a friend.)

What did the hackathon demo look like? What did judges respond to?

GitHub URL (or "private"):
```

### Trimble

```
What was the actual pain you saw on the engineering team before your platform?
(The spec says "config conflicts cost hours of debugging" — make it concrete.
A specific incident, a pattern you noticed, the moment you understood the problem.)

The auth proxy with Azure Workload Identity Federation — why did you build that
instead of using something off the shelf? What was the constraint?

What's one thing about this project that you're proud of that isn't
on your resume?

GitHub URL (or "private/proprietary"):
```

### Novartis

```
"Gathered requirements directly from stakeholders, iterated from feedback,
not from a spec doc" — tell me more. What changed between v1 and the final
version because of a conversation you had with someone using it?

What did the tracking dashboards actually show? Paint the picture for someone
who's never seen it.

GitHub URL (or "private/proprietary"):
```

### Center for Food Action (Pantry System)

```
"Any interface needs to work one-handed on an iPad" — how did you figure
this out? Did you watch someone try to use it? What changed in the design
because of that observation?

Anything about this project that sticks with you personally?

GitHub URL (or "private"):
```

### EmotionFlix

```
What made you want to build this? The concept is novel — where did the idea
come from?

"69 tests covering auth, SQL injection, and recommendation accuracy" — was
there a specific reason you went this deep on testing? A failure you saw,
a principle you hold?

GitHub URL (or "private"):
```

---

## Research `/research`

The spec is detailed on the technical side. What I need from you is the narrative layer.

```
The elevator pitch: you're at a career fair and someone asks "what's your
research about?" — what do you say? (3-4 sentences, plain language, no jargon)

What got you interested in this problem? Was there a specific moment,
paper, conversation, or experience?

Who is your advisor? (Name, title, link if available)

Is there a paper or presentation I should link to? If not yet, when
do you expect one?

The interactive viz needs real data. I'll need a subgraph of ~30 nodes
(User, Movie, Emotion) with weighted EVOKES edges. Can you export that
from your dataset, or should we create a representative synthetic one?
Format preference:
```

```json
{
  "nodes": [
    { "id": "u1", "type": "User", "label": "User A" },
    { "id": "m1", "type": "Movie", "label": "Schindler's List" },
    { "id": "e1", "type": "Emotion", "label": "Sadness" }
  ],
  "edges": [
    { "source": "m1", "target": "e1", "type": "EVOKES", "weight": 0.92 }
  ]
}
```

```
Data approach ("I'll export real data" / "use synthetic" / "let's discuss"):
```

---

## Thinking `/thinking`

These are the short essays (500-800 words each). I need 2-3 to launch. The spec suggests three topics. For each one you want to write, give me a rough draft, an outline, or raw thoughts. I'll help shape it if needed, but the voice has to be yours.

### Piece 1: "When Intent Contradicts Content"

The plain-language version of the research problem.

```
Target audience: someone at a career fair who asked "what's your research about?"

Core question to answer: Why does "happy movie about war" break retrieval?

Write your draft, outline, or raw thoughts here:
```

### Piece 2: "Why I Don't Let the Model Write SQL"

From the Canvas Agent. Engineering judgment on display.

```
Core question: You had 9 typed tools with parameterized SQL instead of letting
the LLM generate queries. Why? What goes wrong when you don't do this?

Write your draft, outline, or raw thoughts here:
```

### Piece 3: "Building for Someone Holding a Box of Canned Goods"

The pantry system. Product thinking.

```
Core question: What changes when you watch someone actually try to use
your software in context?

Write your draft, outline, or raw thoughts here:
```

```
Which of these three do you want to write? All three? Pick two?
Any other topic you'd rather write about instead?
```

---

## Now `/now`

Short answers, 1-3 sentences each. This page should take you 5 minutes.

```
Building:
Researching:
Learning:
Reading:
Looking for:
Last updated (I'll set this to today's date):
```

---

## About `/about`

This is the most personal page. I need your voice here, not mine. Write as much or as little as you're comfortable with and I'll help structure it.

### The Narrative (3-4 paragraphs, first person)

```
Where are you from? What brought you to CS? Was there a moment, a class,
a project, a person?

You speak three languages — which three? Does that shape how you think
about problems or about building software for people?

The range: you managed 17 RAs and a residential community of 200+,
co-founded the CS club and brought in Bjarne Stroustrup, led the math club,
competed in ICPC. Pick the ones that matter to you and tell me why they
matter. Don't list them — tell the story.

What do you care about building? What kind of engineer do you want to be?
Not the "correct" answer — the honest one.
```

### The Things That Don't Fit on a Resume

```
Canstruction (1st place) — what is this, what did you build, why does
it matter to you?

Student Employee of the Year — what were you doing that earned this?

Anything else? Hobbies, interests, something weird and specific that
makes you memorable?
```

### The Closing Line

One sentence that connects the personal back to the professional. Not a call to action. Just a sentence that ties it together. Write a few options if you want.

```
Closing line:
```

---

## Design Decisions (need your input)

### Accent Color

The spec uses deep teal (`#2B6B5E`). Any instinct toward a different color, or is teal right?

```
Color preference ("teal is good" / suggest alternative):
```

### The "Equalizer" Belief

Philosophy.md mentions this: the idea that technology is an equalizer. Should this be woven into the `/about` narrative only, or should it be a through-line across the whole site?

```
Equalizer approach ("about page only" / "site-wide thread" / other):
```

---

## What Happens Next

Once you fill this in, I build the pages in sprint order:
1. Home (finalize with your real copy)
2. Work (full prose entries)
3. About (personal narrative)
4. Research (static content first, then the interactive viz)
5. Thinking (publish your essays)
6. Now (last, takes 5 minutes)

Take your time with the narrative pieces. The short answers I can work with immediately.
