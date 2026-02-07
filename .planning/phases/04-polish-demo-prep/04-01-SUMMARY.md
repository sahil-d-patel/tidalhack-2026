---
phase: 04-polish-demo-prep
plan: 01
subsystem: ui-polish
tags: [frosted-glass, loading-animation, visual-consistency, theme-reinforcement]
dependency_graph:
  requires: [blizzard-mode-ui, base-ui-components]
  provides: [consistent-frosted-glass-styling, snowflake-loading-animation]
  affects: [demo-toggle, hover-tooltip, thermometer-hud, quiz-card, snowball-node]
tech_stack:
  added: [frosted-glass-utility, snowflake-spin-keyframe]
  patterns: [css-utility-classes, custom-keyframe-animations]
key_files:
  created: []
  modified:
    - client/src/styles/globals.css
    - client/src/components/ui/DemoToggle.tsx
    - client/src/components/ui/HoverTooltip.tsx
    - client/src/components/ui/ThermometerHUD.tsx
    - client/src/components/ui/QuizCard.tsx
    - client/src/components/canvas/nodes/SnowballNode.tsx
decisions:
  - what: Frosted glass utility class for consistent styling
    why: Ensures all UI cards have identical backdrop-blur, bg color, border, and shadow properties
    impact: Visual consistency across entire UI
  - what: Snowflake spinner animation with scale pulse
    why: Reinforces winter theme in loading states, replacing generic pulse animation
    impact: Enhanced thematic consistency and visual polish
  - what: 1.5s ease-in-out animation timing
    why: Matches existing atmosphere transition timings for cohesive feel
    impact: Harmonious animation timing across app
metrics:
  duration_seconds: 82
  tasks_completed: 2
  commits: 2
  files_modified: 6
  completed_date: 2026-02-07
---

# Phase 4 Plan 1: Frosted Glass & Snowflake Spinner Summary

**One-liner:** Consistent frosted glass styling (slate-900/70 + backdrop-blur) across all UI cards with custom snowflake spinner replacing generic loading animations

## Objective Achieved

Applied unified frosted glass treatment to all UI cards (DemoToggle, HoverTooltip, ThermometerHUD, QuizCard) and replaced generic loading animations with a custom rotating snowflake spinner, creating visual consistency and reinforcing the winter theme throughout the app.

## Tasks Executed

### Task 1: Add frosted glass CSS and snowflake spinner to globals.css ✅
**Commit:** 582e140

Added three new CSS elements to globals.css:
- `@keyframes snowflake-spin`: 360deg rotation with gentle scale pulse (1 → 1.15 → 1) over 1.5s
- `.animate-snowflake-spin`: Utility class applying infinite snowflake spin
- `.frosted-glass`: Unified utility with backdrop-blur(12px), slate-900/70 bg, slate-400/30 border, depth shadows + inner highlight

**Files modified:**
- client/src/styles/globals.css

**Verification:** TypeScript compilation passed with zero errors.

### Task 2: Apply frosted glass to all UI components and snowflake spinner to loading states ✅
**Commit:** 839b80a

Applied consistent frosted glass styling across all UI cards:
- **DemoToggle.tsx**: Replaced `bg-slate-800/60 backdrop-blur-sm` with `frosted-glass`
- **HoverTooltip.tsx**: Replaced `bg-slate-800/95 backdrop-blur-sm border border-slate-700/50` with `frosted-glass`, updated arrow to match colors (`bg-slate-900/70 border-slate-400/30`), replaced loading text with spinning snowflake (`&#10052;`)
- **ThermometerHUD.tsx**: Replaced `bg-slate-800/80 backdrop-blur-sm border border-slate-600/50` with `frosted-glass`
- **QuizCard.tsx**: Replaced `bg-slate-900/90 backdrop-blur-md border border-slate-600/50 shadow-2xl` with `frosted-glass`
- **SnowballNode.tsx**: Replaced `animate-pulse` with `animate-snowflake-spin` for expanding state

**Files modified:**
- client/src/components/ui/DemoToggle.tsx
- client/src/components/ui/HoverTooltip.tsx
- client/src/components/ui/ThermometerHUD.tsx
- client/src/components/ui/QuizCard.tsx
- client/src/components/canvas/nodes/SnowballNode.tsx

**Verification:** TypeScript compilation passed, production build completed successfully in 891ms.

## Deviations from Plan

None - plan executed exactly as written.

## Technical Implementation

### Frosted Glass Utility
```css
.frosted-glass {
  background: rgba(15, 23, 42, 0.7);           /* slate-900 at 70% */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);         /* Safari support */
  border: 1px solid rgba(148, 163, 184, 0.3);  /* slate-400/30 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),   /* depth */
              inset 0 1px 0 rgba(255, 255, 255, 0.05); /* inner highlight */
}
```

### Snowflake Spinner Animation
```css
@keyframes snowflake-spin {
  0%   { transform: rotate(0deg) scale(1); }
  50%  { transform: rotate(180deg) scale(1.15); }
  100% { transform: rotate(360deg) scale(1); }
}
```

Applied to:
- HoverTooltip loading state (Unicode snowflake: ❄)
- SnowballNode expanding state

## Success Criteria Met

✅ All UI cards render with consistent frosted glass (backdrop-blur-md, slate-900/70 bg, subtle border)
✅ Loading states show spinning snowflake instead of generic pulse
✅ Build passes with zero errors
✅ No component logic or state management changed

## Impact Assessment

**Visual Consistency:** All UI cards now share identical frosted glass treatment, creating a cohesive premium feel that reinforces the "polished indie game" aesthetic.

**Theme Reinforcement:** Custom snowflake spinner appears in:
1. Node expansion (when sub-topics are generating)
2. Tooltip loading (when fun facts are fetching)

This replaces generic pulse animations with thematic visual feedback that reinforces the winter atmosphere.

**Performance:** CSS-based animations (keyframes) with no JavaScript overhead. Backdrop-blur utilizes hardware acceleration on supported browsers.

## Next Phase Readiness

**Status:** ✅ Ready

This plan provides the visual foundation for remaining polish work. The frosted glass utility and snowflake spinner are now available for any additional UI components added in subsequent plans.

**Blockers:** None

**Recommendations:**
- Consider applying frosted-glass to any modal dialogs or overlays added in future features
- Snowflake spinner can be reused for any async operations (API calls, data loading)

## Self-Check

Verifying all claimed files and commits exist:

**Files created/modified:**
- ✅ client/src/styles/globals.css (contains snowflake-spin, animate-snowflake-spin, frosted-glass)
- ✅ client/src/components/ui/DemoToggle.tsx (uses frosted-glass)
- ✅ client/src/components/ui/HoverTooltip.tsx (uses frosted-glass + snowflake spinner)
- ✅ client/src/components/ui/ThermometerHUD.tsx (uses frosted-glass)
- ✅ client/src/components/ui/QuizCard.tsx (uses frosted-glass)
- ✅ client/src/components/canvas/nodes/SnowballNode.tsx (uses animate-snowflake-spin)

**Commits:**
- ✅ 582e140 - chore(04-01): add frosted glass CSS and snowflake spinner
- ✅ 839b80a - feat(04-01): apply frosted glass and snowflake spinner to all UI

**Build verification:**
- ✅ TypeScript compilation passes with zero errors
- ✅ Production build completes successfully in 891ms
- ✅ All 4 UI components reference frosted-glass class
- ✅ SnowballNode uses animate-snowflake-spin
- ✅ HoverTooltip uses snowflake spinner for loading

## Self-Check: PASSED

All claimed files, commits, and functionality verified.
