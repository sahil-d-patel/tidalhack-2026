---
phase: 03-blizzard-mode
plan: 02
subsystem: ui
tags: [react, framer-motion, zustand, blizzard-mode, quiz, gamification]

# Dependency graph
requires:
  - phase: 03-01
    provides: gameMode state, warmth counter, blizzard actions (enterBlizzard, answerQuiz, exitBlizzard)
provides:
  - Complete Blizzard Mode UI with quiz card, thermometer HUD, frost overlay
  - "Brave the Storm" button on quiz nodes triggers blizzard gameplay
  - Visual feedback system (warm/cold flashes, frost creep, thermometer animations)
  - Full gamification loop from trigger to quiz to exit
affects: [04-polish, future-quiz-expansion]

# Tech tracking
tech-stack:
  added: []
  patterns: [individual-zustand-selectors, animation-css-keyframes, pointer-events-none-for-overlays]

key-files:
  created:
    - client/src/components/ui/QuizCard.tsx
    - client/src/components/ui/FrostOverlay.tsx
    - client/src/components/ui/ThermometerHUD.tsx
  modified:
    - client/src/components/canvas/nodes/SnowballNode.tsx
    - client/src/App.tsx
    - client/src/styles/globals.css

key-decisions:
  - "Quiz card uses 2x2 grid for 4 answer options (balanced visual layout)"
  - "Thermometer uses color transitions (blue < 30, yellow 30-60, amber > 60) for intuitive warmth indication"
  - "Frost overlay uses CSS box-shadow inset with dynamic spread/blur/opacity based on warmth"
  - "Answer feedback uses framer-motion AnimatePresence for smooth flash transitions (800ms duration)"
  - "Thermometer animations (scale-correct, shake) use CSS keyframes instead of JS for better performance"

patterns-established:
  - "Individual zustand selectors in components (not destructuring) for optimal re-render performance"
  - "pointer-events-none on overlays to prevent blocking interactions"
  - "CSS custom properties (--z-*) for consistent z-index layering"

# Metrics
duration: 9min
completed: 2026-02-07
---

# Phase 3 Plan 2: Blizzard Mode UI Summary

**Complete gamification loop with quiz card overlay, thermometer HUD showing warmth 0-100, frost edge overlay that intensifies with coldness, and warm/cold answer feedback flashes**

## Performance

- **Duration:** 9 min
- **Started:** 2026-02-07T22:30:26Z
- **Completed:** 2026-02-07T22:39:38Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- "Brave the Storm" button on nodes with quiz data triggers Blizzard Mode
- Full-screen quiz card with 4 options, answer feedback, and exit flow
- Thermometer HUD with color-coded warmth display (blue/yellow/amber)
- Frost overlay that creeps from edges as warmth decreases
- Visual feedback system: warm orange flash on correct, icy blue flash on wrong
- Thermometer animations: scale on correct, shake on wrong

## Task Commits

Each task was committed atomically:

1. **Task 1: Add "Brave the Storm" trigger and quiz/feedback UI** - `b8f7161` (feat)
   - SnowballNode: "Brave the Storm" button, blizzard active glow effect
   - QuizCard: Full-screen quiz overlay with 4 options, answer feedback, exit button
   - FrostOverlay: Dynamic frost intensity based on warmth level

2. **Task 2: Create ThermometerHUD and wire all Blizzard UI into App** - `c026a28` (feat)
   - ThermometerHUD: Vertical thermometer with color transitions and animations
   - App.tsx: Wire FrostOverlay, QuizCard, ThermometerHUD into component tree
   - globals.css: Add scale-correct and shake CSS animations

## Files Created/Modified

**Created:**
- `client/src/components/ui/QuizCard.tsx` - Full-screen quiz overlay with answer options, feedback, and exit flow
- `client/src/components/ui/FrostOverlay.tsx` - Dynamic frost edge overlay based on warmth level
- `client/src/components/ui/ThermometerHUD.tsx` - Vertical thermometer HUD with color-coded warmth display

**Modified:**
- `client/src/components/canvas/nodes/SnowballNode.tsx` - Added "Brave the Storm" button for quiz nodes, blizzard active glow
- `client/src/App.tsx` - Wired FrostOverlay, QuizCard, ThermometerHUD into component tree
- `client/src/styles/globals.css` - Added scale-correct and shake CSS keyframes for thermometer animations

## Decisions Made

**Quiz card layout:**
- 2x2 grid for 4 answer options provides balanced visual layout
- Correct option highlighted green, wrong selected highlighted red, others fade to 50% opacity
- "Return to Warmth" button appears after answering (not during quiz)

**Thermometer visual design:**
- Color transitions: blue < 30 (cold), yellow 30-60 (medium), amber > 60 (warm)
- Vertical bar with rounded bottom, tick marks at 0/25/50/75/100
- Scale animation on correct (0.3s), shake animation on wrong (0.3s)
- Used CSS keyframes instead of JS for better performance

**Frost overlay implementation:**
- CSS box-shadow inset with dynamic spread/blur/opacity
- Frost intensity formula: spread = 40 + (100-warmth)*1.4, blur = 20 + (100-warmth)*0.8, opacity = 0.15 + (100-warmth)*0.0045
- At warmth 50 (start): subtle frost. At warmth 0: heavy frost creeping from edges
- 0.8s transition duration for smooth creep effect

**Answer feedback flashes:**
- framer-motion AnimatePresence for smooth flash transitions
- Warm orange (amber-500/20) on correct, icy blue (blue-400/20) on wrong
- 800ms duration, auto-clears to prevent state bugs

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all components implemented smoothly with existing state management from Plan 03-01.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 4 (Polish & Deploy):**
- Complete Blizzard Mode gameplay loop functional
- All UI components responsive and animated
- Visual feedback system polished and atmospheric
- Build succeeds with no type errors

**Suggested polish items for Phase 4:**
- Sound effects for quiz answers (warm chime, cold wind)
- Particle effects on correct/wrong answers
- Quiz result persistence (score tracking)
- Accessibility improvements (keyboard navigation, ARIA labels)

## Self-Check: PASSED

**Created files:**
- FOUND: client/src/components/ui/QuizCard.tsx
- FOUND: client/src/components/ui/FrostOverlay.tsx
- FOUND: client/src/components/ui/ThermometerHUD.tsx

**Commits:**
- FOUND: b8f7161 (Task 1: Brave the Storm trigger and quiz/feedback UI)
- FOUND: c026a28 (Task 2: ThermometerHUD and App wiring)

All files created and commits verified.
