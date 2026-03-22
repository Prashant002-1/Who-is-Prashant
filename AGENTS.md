# Mission

## What We're Building

You have access to the Philosophy.md file which outlines everything you need to understand the scope of this project. Also refer to SKILL.md for design-specific instructions.

# Code Style Guideline

- No fluff. You are to think like an experienced ML engineer who cares about simplicity. Not some intern who shoehorns every possible thing to make the code look pretty. It just bloats the code. 
- ***No emojis in the code***. You must check this all the time. 
- Comments should communicate important information, and unnecessary/explanatory/notaional comments should be avoided
- Think outside the box, increase your creative capacity, and don't just create something that looks justifiable but steers away from the requirement or the actual thing. It's okay to stop and ask. Thinkg outside the box. 
- I would rather take ad-hoc code than code that is overly generic. 
- The end result may look ugly, but as long as it works and is reliable then it should be good enough. 
- We follow agile philosophy so instead of building in phases, we do short sprints, stop, review, and then move on to the next thing. As we build bigger and better, requirements may change, new discoveries might be made, and we have to adapt. 
- No safely "run-to-completion" harcoded logic, never fallback. Instead fail fast and work on fixing issues then. The fallback train leads nowhere.
- **Very important**: don't leave traces that you touched the code. No "instructions" in comments, no explaining in comments. Don't use print statements to talk inside the code, or communicate. print("this is/should be happening") print("this happened"). While it is a good habit to use print to debug, but excessive unwated prints just bloat the code. Unless it is absolutely necessary to communicate what is happening, avoid that pattern. 


## Workflow Orchestration

### 1. How to Plan
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Plan for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- Write rules for yourself in memory that prevent the same mistake
- Ruthlessly iterate on memories until mistake rate drops
- Review memories at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests -> then resolve them
- Zero context switching required from the user

## Task Management
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step

## Core Principles
- **Simplicity First**: Make every change as simple as possible.
- **No Laziness**: Find root causes. No temporary fixes. No Fallbacks. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.