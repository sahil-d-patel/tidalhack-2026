# Roadmap: FRACTAL

## Overview

FRACTAL transforms from a blank canvas to a polished indie game experience in 4 phases spanning 24 hours. Phase 1 builds the infinite canvas foundation and establishes atmospheric base layers. Phase 2 integrates AI-powered topic branching and quiz generation with caching. Phase 3 delivers the complete gamification loop with Blizzard Mode survival mechanics. Phase 4 polishes the experience for demo-ready presentation with performance optimization and fallback strategies.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Atmosphere** - Infinite canvas with moody winter base visuals
- [ ] **Phase 2: AI Integration** - Dynamic topic branching and quiz generation with caching
- [ ] **Phase 3: Blizzard Mode** - Complete gamification loop with survival mechanics
- [ ] **Phase 4: Polish & Demo Prep** - Performance optimization and demo-ready fallbacks

## Phase Details

### Phase 1: Foundation & Atmosphere
**Goal**: Users can explore a beautiful, moody infinite canvas that feels like a winter scene from the first moment
**Depends on**: Nothing (first phase)
**Requirements**: CANV-01, CANV-02, CANV-03, CANV-06, ATMO-01, ATMO-05, ATMO-06
**Success Criteria** (what must be TRUE):
  1. User can pan and zoom smoothly across an infinite canvas
  2. Nodes appear as custom snowball-style elements with readable text
  3. Cabin visual is always visible in background as emotional anchor
  4. Color palette (navy/slate + amber) and typography (Fredoka/Nunito) establish moody atmosphere
  5. Parallax background with 3 SVG layers (hills, trees, cabin) creates visual depth
**Plans**: TBD

Plans:
- [ ] 01-01: TBD
- [ ] 01-02: TBD
- [ ] 01-03: TBD

### Phase 2: AI Integration
**Goal**: Users can click nodes to dynamically explore AI-generated sub-topics and see contextual summaries
**Depends on**: Phase 1
**Requirements**: CANV-04, CANV-05, BLIZ-03, POLI-03
**Success Criteria** (what must be TRUE):
  1. User clicks expandable node and 4 AI-generated sub-topics appear via Featherless
  2. User hovers node and sees AI-generated fun fact via Gemini
  3. Quiz data is pre-generated and stored in node data (no second API call needed)
  4. MongoDB caching prevents redundant API calls for same topics
  5. Demo mode toggle works with pre-cached responses (no live API required)
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Blizzard Mode
**Goal**: Users experience complete atmosphere shift from calm exploration to intense survival quiz
**Depends on**: Phase 2
**Requirements**: BLIZ-01, BLIZ-02, BLIZ-04, BLIZ-05, BLIZ-06, POLI-02, ATMO-02
**Success Criteria** (what must be TRUE):
  1. User triggers "Brave the Storm" on deep node and enters Blizzard Mode
  2. Sky darkens, snow particles intensify, cabin becomes obscured during blizzard
  3. Thermometer HUD displays user's warmth level throughout quiz
  4. Correct answer produces warm flash + thermometer rises
  5. Wrong answer produces icy flash + frost overlay creeps from screen edges
  6. Mode transition animates smoothly (sky color shift, particle acceleration)
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Polish & Demo Prep
**Goal**: Demo runs flawlessly in front of judges with performance optimizations and fallback strategies
**Depends on**: Phase 3
**Requirements**: ATMO-03, ATMO-04, POLI-01, POLI-04
**Success Criteria** (what must be TRUE):
  1. Frosted glass UI cards render with proper backdrop blur across Chrome/Firefox/Safari
  2. Custom loading animations (penguin waddle or snowman build) replace any generic spinners
  3. Sound design with toggle works (peace: soft wind + chimes, blizzard: howling wind)
  4. Demo mode is reliable enough to present without live API dependency
  5. Full 3-minute demo narrative can be delivered without crashes or performance issues
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Atmosphere | 0/3 | Not started | - |
| 2. AI Integration | 0/2 | Not started | - |
| 3. Blizzard Mode | 0/2 | Not started | - |
| 4. Polish & Demo Prep | 0/2 | Not started | - |
