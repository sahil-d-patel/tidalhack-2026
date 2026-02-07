# Requirements: FRACTAL

**Defined:** 2026-02-07
**Core Value:** The visual experience must feel like a polished indie game, not a hackathon project.

## v1 Requirements

### Canvas & Exploration

- [ ] **CANV-01**: Infinite panning/zooming canvas with smooth controls (@xyflow/react)
- [ ] **CANV-02**: Custom snowball-style nodes (rounded white with subtle blue inner shadow, text-slate-700, font-nunito for readability)
- [ ] **CANV-03**: Custom footprint-style edges (dashed lines connecting nodes)
- [ ] **CANV-04**: Click node triggers AI sub-topic generation (exactly 4 branches via Featherless, plus icon on node edge indicates expandability)
- [ ] **CANV-05**: Hover/inspect node shows AI-generated fun fact (Gemini summary)
- [ ] **CANV-06**: Cabin visual always visible as home base anchor in background

### Atmosphere & Visuals

- [ ] **ATMO-01**: Parallax background with 3 SVG layers (snow hills, pine trees, cabin with chimney smoke)
- [ ] **ATMO-02**: Falling snow particle system (tsparticles) with variable intensity per mode
- [ ] **ATMO-03**: Frosted glass UI cards (backdrop-blur 8-16px, 10-40% opacity)
- [ ] **ATMO-04**: Custom loading animations (penguin waddle or snowman build, no generic spinners)
- [ ] **ATMO-05**: Moody navy-to-slate color palette with warm amber/orange heat accent
- [ ] **ATMO-06**: Fredoka One / Titan One headings + Nunito / Quicksand body typography

### Blizzard Mode

- [ ] **BLIZ-01**: "Brave the Storm" trigger on deep nodes activates Blizzard Mode
- [ ] **BLIZ-02**: Sky darkens, wind intensifies, cabin becomes obscured during blizzard
- [ ] **BLIZ-03**: AI-generated multiple-choice quiz cards from Gemini (4 options, 1 correct, winter-themed where possible, stored as JSON in node data to avoid second API call)
- [ ] **BLIZ-04**: Thermometer HUD (vertical bar: full=warm/red, empty=frozen/blue)
- [ ] **BLIZ-05**: Correct answer: warm orange/gold flash + thermometer rises
- [ ] **BLIZ-06**: Wrong answer: icy blue flash + frost crystal overlay creeps from corners

### Polish & Infrastructure

- [ ] **POLI-01**: Sound design with toggle (peace: soft wind + chimes, blizzard: howling wind)
- [ ] **POLI-02**: Smooth animated transitions between Peace and Blizzard modes
- [ ] **POLI-03**: MongoDB caching layer (check cache before API calls, store responses by topic)
- [ ] **POLI-04**: Demo mode toggle (pre-cached responses for reliable judging demo)

## v2 Requirements

### Social & Sharing

- **SOCL-01**: Share explored knowledge paths via link
- **SOCL-02**: Export knowledge tree as image/PDF

### Extended Gameplay

- **GAME-01**: Score tracking across multiple blizzard sessions
- **GAME-02**: Difficulty scaling (deeper nodes = harder questions)
- **GAME-03**: Achievement badges for exploration milestones

### Mobile

- **MOBI-01**: Touch-optimized canvas controls
- **MOBI-02**: Responsive layout for tablet/phone

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / authentication | Unnecessary for hackathon demo, zero UI/UX award value |
| Mobile responsiveness | Desktop-first for judging; 24hrs insufficient for quality mobile UX |
| Multiplayer / collaborative exploration | Backend complexity, no UI/UX differentiation |
| Persistent user progress | Demo resets are fine for hackathon judging |
| Leaderboards | Not core to the exploration/survival experience |
| Real-time chat | Out of scope for single-player experience |
| Full accessibility (ARIA, keyboard nav) | Contrast ratios maintained but full a11y deferred |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CANV-01 | Phase 1 | Complete |
| CANV-02 | Phase 1 | Complete |
| CANV-03 | Phase 1 | Complete |
| CANV-04 | Phase 2 | Complete |
| CANV-05 | Phase 2 | Complete |
| CANV-06 | Phase 1 | Complete |
| ATMO-01 | Phase 1 | Complete |
| ATMO-02 | Phase 3 | Pending |
| ATMO-03 | Phase 4 | Pending |
| ATMO-04 | Phase 4 | Pending |
| ATMO-05 | Phase 1 | Complete |
| ATMO-06 | Phase 1 | Complete |
| BLIZ-01 | Phase 3 | Pending |
| BLIZ-02 | Phase 3 | Pending |
| BLIZ-03 | Phase 2 | Complete |
| BLIZ-04 | Phase 3 | Pending |
| BLIZ-05 | Phase 3 | Pending |
| BLIZ-06 | Phase 3 | Pending |
| POLI-01 | Phase 4 | Pending |
| POLI-02 | Phase 3 | Pending |
| POLI-03 | Phase 2 | Complete |
| POLI-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0

---
*Requirements defined: 2026-02-07*
*Last updated: 2026-02-07 after roadmap creation*
