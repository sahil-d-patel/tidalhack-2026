---
phase: 03-blizzard-mode
plan: 01
subsystem: atmosphere-system
tags: [tsparticles, zustand, game-state, visual-transitions, atmosphere]
requires:
  - phase: 02-ai-integration
    provides: canvasStore foundation, demo mode, AI data structures
provides:
  - Blizzard Mode game state (gameMode, warmth, quiz mechanics)
  - Snow particle system with calm/blizzard intensity modes
  - Smooth atmosphere transitions (sky, cabin, vignette)
  - Quiz game loop with warmth counter and visual feedback
affects: 03-02-blizzard-ui (will consume gameMode state and actions)
tech-stack:
  added: [@tsparticles/react, @tsparticles/preset-snow, @tsparticles/engine]
  patterns: [zustand-game-state, conditional-atmosphere-rendering, css-transitions]
key-files:
  created:
    - client/src/components/background/SnowParticles.tsx
  modified:
    - client/src/state/canvasStore.ts
    - client/src/components/background/ParallaxBackground.tsx
    - client/src/styles/globals.css
    - client/src/App.tsx
key-decisions:
  - "Snow particles always visible (calm by default, blizzard when triggered)"
  - "Warmth counter starts at 50, +25 for correct answer, -30 for wrong"
  - "Quiz result flash feedback auto-clears after 800ms"
  - "Sky darkens to #070d1a/#0f172a in blizzard mode"
  - "Cabin opacity drops to 0.15 during blizzard (obscured but visible)"
  - "All transitions use 1.5s ease-in-out for smooth emotional shift"
duration: 2min
completed: 2026-02-07
---

# Phase 3 Plan 01: Blizzard Mode Atmosphere Summary
**Snow particle system with game state management and smooth Peace-to-Blizzard visual transitions**

## Performance
All tasks completed successfully in 2 minutes. No type errors, build passed. Clean execution with atomic commits per task.

## Accomplishments

### Task 1: Blizzard Mode State (commit 8867ae1)
- Added `gameMode: 'peace' | 'blizzard'` state to canvasStore (default: 'peace')
- Implemented `blizzardQuiz` state with nodeId, topic, quiz data, questionIndex
- Added `warmth` counter (0-100) for game mechanics
- Implemented `quizResult` state ('correct' | 'wrong' | null) with 800ms auto-clear
- Added `blizzardComplete` boolean flag for quiz completion tracking
- Created `enterBlizzard(nodeId, topic, quiz)` action to initialize blizzard state
- Created `answerQuiz(selectedIndex)` action with warmth adjustment logic:
  - Correct answer: warmth += 25 (capped at 100)
  - Wrong answer: warmth -= 30 (floored at 0)
- Created `exitBlizzard()` action to reset to peace mode
- Imported `QuizData` type with `type` prefix for verbatimModuleSyntax compliance

### Task 2: Snow Particles & Atmosphere (commit bef9fc9)
- Created `SnowParticles.tsx` component using @tsparticles/react:
  - Calm mode: 30 particles, speed 1-2, opacity 0.4-0.7, size 1-3px, gentle wobble
  - Blizzard mode: 150 particles, speed 5-10, opacity 0.6-1.0, size 2-5px, strong wobble
  - Used `useMemo` for particle options to prevent unnecessary re-renders
  - Used `initParticlesEngine` with `loadSnowPreset` for proper initialization
  - Re-keyed component on intensity change for instant visual update
- Updated `ParallaxBackground.tsx` with atmosphere transitions:
  - Connected `useCanvasStore` to read `gameMode`
  - Sky gradient: `from-background-dark to-background` in peace, `from-[#070d1a] to-[#0f172a]` in blizzard
  - Cabin opacity: 1.0 in peace, 0.15 in blizzard (faintly visible)
  - All transitions use `transition: 1.5s ease-in-out`
- Added `.blizzard-vignette` CSS class in `globals.css`:
  - `box-shadow: inset 0 0 150px 60px rgba(0, 0, 0, 0.7)`
  - Creates dramatic darkening around screen edges
- Wired in `App.tsx`:
  - Added `<SnowParticles>` at z-index 20 (between background and canvas)
  - Added vignette overlay div at z-index 30 with conditional class
  - Connected `gameMode` state to drive intensity prop

## Task Commits

| Task | Name                              | Commit  | Files                                                                                                                     |
| ---- | --------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1    | Blizzard Mode state and game loop | 8867ae1 | client/src/state/canvasStore.ts                                                                                           |
| 2    | Snow particles and atmosphere     | bef9fc9 | client/src/components/background/SnowParticles.tsx (new), ParallaxBackground.tsx, globals.css, App.tsx |

## Files Created/Modified

**Created:**
- `client/src/components/background/SnowParticles.tsx` — tsparticles snow overlay with calm/blizzard modes

**Modified:**
- `client/src/state/canvasStore.ts` — Added gameMode, warmth, quiz state and enterBlizzard/answerQuiz/exitBlizzard actions
- `client/src/components/background/ParallaxBackground.tsx` — Connected gameMode for sky gradient and cabin opacity transitions
- `client/src/styles/globals.css` — Added blizzard-vignette class for dramatic screen darkening
- `client/src/App.tsx` — Wired SnowParticles and vignette overlay with gameMode state

## Decisions Made

1. **Snow particles always visible** — Even in Peace mode, gentle snow falls. This establishes the winter atmosphere immediately and makes the blizzard transition feel like an intensification rather than a sudden addition.

2. **Warmth counter mechanics** — Starting at 50 creates tension (not safe, not doomed). +25 for correct answers means 2 correct answers bring you to safety. -30 for wrong answers means 2 wrong answers can be catastrophic. This creates high-stakes decision-making.

3. **Quiz result flash feedback with auto-clear** — 800ms is long enough to read but short enough not to interrupt flow. Auto-clearing prevents UI state management bugs.

4. **Dark sky gradient in blizzard** — Using very dark blues (#070d1a, #0f172a) instead of pure black maintains the winter aesthetic while creating dramatic contrast with Peace mode.

5. **Cabin obscured but visible** — 0.15 opacity keeps the cabin as a faint beacon of hope rather than completely disappearing. This maintains visual continuity and spatial orientation.

6. **1.5s transition duration** — Long enough to feel cinematic and emotional, short enough not to feel sluggish. Ease-in-out creates natural acceleration/deceleration.

## Deviations from Plan

None — plan executed exactly as written. All tasks completed without bugs, blocking issues, or architectural changes needed.

## Issues Encountered

None. TypeScript compilation passed, build succeeded, all integrations worked as expected.

## User Setup Required

None. Snow particles render automatically in calm mode on page load. Blizzard Mode will be triggered by UI in Plan 02.

## Next Phase Readiness

**Status:** Ready for 03-02 (Blizzard Mode UI)

**Provides:**
- `gameMode` state (peace/blizzard)
- `warmth` counter (0-100)
- `blizzardQuiz` state (nodeId, topic, quiz, questionIndex)
- `quizResult` state for visual feedback
- `blizzardComplete` flag
- `enterBlizzard(nodeId, topic, quiz)` action
- `answerQuiz(selectedIndex)` action
- `exitBlizzard()` action
- Visual atmosphere system that responds to gameMode changes

**Next Plan (03-02) Requirements:**
- Quiz UI overlay to display questions/options
- Warmth bar UI component
- Node click handler to trigger enterBlizzard
- Exit button to call exitBlizzard
- Visual feedback for quiz results

**Blockers:** None

## Self-Check: PASSED

**Files created:**
```
FOUND: client/src/components/background/SnowParticles.tsx
```

**Commits exist:**
```
FOUND: 8867ae1
FOUND: bef9fc9
```

All claims verified. Plan execution complete.
