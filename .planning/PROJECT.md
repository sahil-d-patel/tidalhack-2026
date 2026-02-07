# FRACTAL

## What This Is

A gamified fractal knowledge explorer with a moody, atmospheric "cozy winter survival" theme, built for Tidal Hack '26. Users explore topics by branching through an infinite snowfield of knowledge nodes, then test themselves in a blizzard survival mode powered by AI-generated quizzes. Targets "Best UI/UX" and "Best Use of Gemini API" awards.

## Core Value

The visual experience must feel like a polished indie game, not a hackathon project. Every interaction — from exploring nodes to surviving the blizzard — must feel atmospheric, intentional, and beautiful.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Infinite panning canvas (react-flow) where users explore topic nodes as a snowfield
- [ ] AI-powered topic branching via Featherless API (click a node → 4 sub-topics appear)
- [ ] AI-powered summaries and quizzes via Gemini API (hover/inspect a node → fun fact + quiz)
- [ ] Peace Mode: calm exploration with atmospheric winter visuals (fog, snow particles, cabin in background)
- [ ] Blizzard Mode: survival quiz mode triggered from deep nodes — sky darkens, wind intensifies, frost creeps in
- [ ] Thermometer HUD showing health/warmth during Blizzard Mode
- [ ] Visual feedback: warm flash + fire crackle on correct answers, icy flash + frost overlay on wrong answers
- [ ] Moody atmospheric design: navy-to-slate gradients, fog layers, volumetric cabin glow, ambient depth
- [ ] Custom node styling: soft rounded snowball nodes with subtle shadows, footprint-style edges
- [ ] Parallax background: layered snow hills, pine trees, glowing cabin with smoking chimney
- [ ] Falling snow particles (tsparticles) with variable intensity (calm in Peace, heavy in Blizzard)
- [ ] Custom loading animations (penguin waddle or snowman building — no generic spinners)
- [ ] Sound design with toggle: soft wind + chimes in Peace, howling wind in Blizzard
- [ ] MongoDB caching layer: cache AI responses by topic to avoid redundant API calls
- [ ] Smooth transitions between Peace and Blizzard modes (sky color shift, particle acceleration, blur overlay)

### Out of Scope

- User accounts / authentication — unnecessary for hackathon demo
- Mobile responsiveness — desktop-first for judging
- Multiplayer / collaborative exploration — single-player experience
- Persistent user progress across sessions — demo resets are fine
- Leaderboards or scoring beyond the thermometer — keep it simple

## Context

- **Event**: Tidal Hack '26, 24-hour hackathon (Feb 7-8, 2026), MSC Bethancourt
- **Award targets**: "Best UI/UX" (visual polish) and "Best Use of Gemini API" (technical depth)
- **Design direction**: Moody, atmospheric winter — not cute/bubbly. Think Alto's Adventure meets Studio Ghibli winter scenes. Warm cabin glow contrasted against cold, foreboding snowscape. The emotional range (calm → intense) is the differentiator.
- **Visual anchors**: Deep navy/slate palette with warm amber/orange heat accent. Frosted glass UI. Fog layers for depth. The cabin is the emotional anchor — always visible, always glowing.
- **Typography**: 'Fredoka One' / 'Titan One' for headings (rounded, friendly), 'Nunito' / 'Quicksand' for body (readable, approachable)
- **AI APIs**: Featherless for sub-topic generation (have API key), Gemini for summaries + quizzes (have API key)
- **Assets**: User will AI-generate custom illustrations/art later — build with placeholders that can be swapped

## Constraints

- **Timeline**: 24-hour hackathon — must be demo-ready by end of event
- **Tech stack**: React + Vite (frontend), Node.js + Express (backend), MongoDB (caching)
- **Key libraries**: @xyflow/react, framer-motion, tsparticles, lucide-react
- **APIs**: Featherless (sub-topic branching), Gemini (summaries + quizzes)
- **Demo context**: Judges evaluate on a screen — visual impact in the first 5 seconds matters most

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Moody atmospheric over cute/bubbly | Stand out from Tidal branding that other projects will copy | — Pending |
| Navy/slate + amber/orange palette over periwinkle + red | Deeper mood, better contrast for "cozy vs cold" tension | — Pending |
| React Flow for canvas | Best-in-class node graph library, handles infinite pan/zoom | — Pending |
| MongoDB for caching | Avoid redundant API calls, faster demo experience | — Pending |
| Featherless for branching, Gemini for content | Separate concerns: structure vs knowledge | — Pending |
| Desktop-only | Hackathon judges use screens, mobile is wasted effort | — Pending |

---
*Last updated: 2026-02-07 after initialization*
