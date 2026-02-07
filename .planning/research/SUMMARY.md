# Project Research Summary

**Project:** FRACTAL - Gamified Fractal Knowledge Explorer
**Domain:** Interactive gamified web application with atmospheric UI and AI integration
**Researched:** 2026-02-07
**Confidence:** HIGH

## Executive Summary

FRACTAL is a gamified knowledge exploration tool that combines interactive node graph visualization with atmospheric storytelling and AI-powered content generation. Based on extensive research, the recommended approach uses React + Vite for the frontend with @xyflow/react for the infinite canvas, tsparticles for atmospheric effects, and a Node.js + Express backend proxying Featherless and Gemini APIs. The architecture follows a layered rendering pattern (parallax background, canvas, particles, overlays) with cache-first API middleware to reduce AI API costs by 90%.

The core differentiator is the dual-mode emotional shift: Peace Mode (calm exploration with gentle snow) transitioning to Blizzard Mode (survival quiz with intensifying storm effects). This narrative arc, combined with frosted glass UI and moody winter aesthetics, positions FRACTAL for "Best UI/UX" recognition. The key technical challenges are performance optimization (React Flow + particles + animations on limited GPU), API rate limiting management (Gemini free tier dropped 92% in Dec 2025), and CSS layering complexity with multiple visual systems.

Success depends on ruthless scope management in a 24-hour hackathon context. Research shows hackathon projects accomplish ~25% of planned scope, so a 4-phase build strategy is recommended: Foundation (8hrs), Visual Identity (6hrs), Gamification Loop (6hrs), Polish (4hrs). Critical pitfalls to avoid include performance collapse with 50+ nodes, API rate limit exhaustion during demos, and CSS z-index chaos across multiple rendering layers.

## Key Findings

### Recommended Stack

React 18/19 with Vite provides sub-300ms dev server startup (critical for hackathons) and replaces deprecated create-react-app. The stack prioritizes developer experience for rapid iteration under time pressure while maintaining production-grade performance.

**Core technologies:**
- **Vite 5.x+**: Ultra-fast dev server and build tool — replaces CRA, instant HMR, native ESM
- **@xyflow/react 12.x**: Infinite canvas node graph — GPU-accelerated, built-in dark mode, SSR support
- **framer-motion 12.x**: Component animations — React 19 compatible, 34kb→6kb with LazyMotion
- **@tsparticles/react 3.x**: Particle effects (snow/blizzard) — Canvas-based, 60 FPS, modular imports
- **Tailwind CSS 4.x**: Utility-first styling — rapid iteration, automatic purging, v4 improved DX
- **Node.js 20.x LTS + Express 4.x**: Backend API — minimal setup, middleware architecture
- **MongoDB 6.x + Mongoose 8.x**: Document database — natural JSON fit, easy schema evolution, .lean() queries 40x faster
- **Zustand 5.x**: Global state management — minimal boilerplate, 85ms updates, single store model

**Optional (time-dependent):**
- **Redis 7.x**: Caching layer for 1098% query performance boost (use if API costs become issue)
- **TanStack Query 5.x**: Server state management (skip unless API state becomes unwieldy)

**Critical version compatibility:**
- framer-motion 11+ required for React 19 support
- @xyflow/react renamed from reactflow (use @xyflow package)
- Vite requires VITE_ prefix for environment variables (security requirement)

**What NOT to use:**
- create-react-app (officially deprecated 2025)
- particles.js (unmaintained, use tsparticles)
- Redux vanilla (too much boilerplate, use Zustand)
- CSS-in-JS libraries (runtime overhead, React 19 issues)

### Expected Features

Research reveals FRACTAL sits at intersection of knowledge exploration (Obsidian Canvas), gamified learning (Duolingo mechanics), and atmospheric storytelling (Alto's Adventure aesthetics). No existing tool combines all three, creating differentiation opportunity for UI/UX awards.

**Must have (table stakes):**
- **Infinite canvas with pan/zoom** — Figma/Miro-style navigation, users expect intuitive controls
- **Visual hierarchy with depth** — Glassmorphism requires layered backgrounds (frosted glass meaningless without depth)
- **Smooth microinteractions (200-500ms)** — 2026 UI standard, purposeful motion following real-world physics
- **Dark mode with 4.5:1 contrast** — WCAG accessibility requirement, winter theme demands dark palette
- **Progress visibility** — Learning platform baseline (position in tree, topics explored, quiz performance)
- **Immediate quiz feedback** — Gamification standard, engagement depends on <200ms validation
- **Responsive feedback on all interactions** — Visual + optional audio acknowledgment

**Should have (competitive differentiators):**
- **Dual-mode atmospheric shift (Peace → Blizzard)** — Unique mood-based UI, 2026 context-aware trend
- **Dynamic AI topic branching** — Featherless API showcased, infinite exploration vs static tree
- **Contextual Gemini quiz generation** — Best Use of Gemini API hook, 3-5 questions per topic
- **Survival mechanics tied to learning** — Quiz performance affects atmospheric intensity (wrong answers = storm intensifies)
- **Frosted glass UI (8-16px blur, 10-40% opacity)** — 2026 glassmorphism trend with depth blur
- **Cinematic camera transitions** — Atmospheric UX trend, smooth focus shifts signal exploration journey
- **Cabin as emotional anchor** — Narrative-driven UI, warm refuge contrasts cold exploration
- **Seasonal color palette (moody winter)** — Alto's Adventure reference: muted atmospheric, deep navy/slate + amber accents

**Defer (v2+):**
- **User accounts/authentication** — Time sink with zero UI/UX award value (use localStorage for demo)
- **Full mobile optimization** — Infinite canvas + complex interactions require desktop-first approach
- **Multiplayer/leaderboards** — Backend complexity with no UI differentiation
- **Manual content database** — Use AI generation exclusively for demo
- **Sound effects/music** — Polish feature with low 24hr ROI (audio rarely works in judge environments)
- **Full accessibility beyond contrast** — Screen readers/keyboard nav require extensive testing
- **Tutorial/onboarding flow** — Intuitive UI > tutorial (use single "How to Play" modal if needed)

### Architecture Approach

The architecture uses a layered rendering pattern with explicit z-index control (background z:0, canvas z:10, particles z:20, overlay z:30, HUD z:40) and cache-first API middleware to reduce AI costs by 90%. State management separates concerns: game mode (Peace/Blizzard state machine), node graph (ReactFlow controlled state), and UI state (thermometer, overlays).

**Major components:**
1. **Layered Z-Index Rendering** — Parallax background, React Flow canvas, tsparticles overlay, HUD overlays with explicit stacking contexts. Clear separation enables independent optimization per layer but requires disciplined CSS architecture.

2. **Cache-First API Middleware** — Express middleware intercepts requests, checks MongoDB cache (24hr TTL), only calls Featherless/Gemini on cache miss. Transparent to route handlers, prevents 90% of API costs. Critical for demo day with multiple team members testing.

3. **Controlled ReactFlow with Custom State** — ReactFlow in controlled mode connected to Zustand store. Full control over node mutations enables game mechanics integration. Requires memoized callbacks to prevent infinite re-render loops.

4. **Game Mode State Machine** — Explicit state machine (peace/blizzard) manages mode transitions, temperature depletion, quiz mechanics. Prevents invalid state transitions and makes mode-specific behaviors clear.

5. **Performance-Optimized Particle System** — tsparticles with Canvas rendering, config-driven presets (peace snow vs blizzard), lazy-loaded based on game mode. Sub-10KB bundle, 60 FPS with hardware acceleration.

**Data flow pattern:**
User clicks node → API client POST /api/scout → Cache middleware checks MongoDB → (Miss: call Featherless + cache response) → Update Zustand store → ReactFlow re-renders → New child nodes appear

**Recommended project structure:**
```
client/src/
  components/
    background/    # Parallax SVG layers
    canvas/        # InfiniteCanvas, SnowballNode
    particles/     # ParticleManager, configs
    overlays/      # Thermometer, BlizzardOverlay
  state/          # gameModeStore, graphStore
  api/            # client, scout, inspect
server/src/
  routes/         # scout.ts, inspect.ts
  middleware/     # cache.ts, errorHandler.ts
  services/       # featherless.ts, gemini.ts
  models/         # Topic.ts, Summary.ts
```

### Critical Pitfalls

Research identified 7 critical pitfalls that kill hackathon demos with complex visual UIs under 24-hour time pressure. Each has clear warning signs and prevention strategies.

1. **React Flow Performance Collapse (50+ nodes)** — React Flow renders all nodes by default while tsparticles + framer-motion run continuously. At 50+ nodes, panning becomes laggy, particles stutter, judges notice jank. **Prevention:** Enable viewport culling (`onlyRenderVisibleElements={false}`), memoize custom nodes, reduce particles to <100, test with 200+ nodes before demo.

2. **AI API Rate Limiting During Demo** — Gemini free tier dropped 92% (250 RPD → 20 RPD) in Dec 2025. Team exhausts quota during final testing. Demo day first 5 attempts consume new quota, then 429 errors. **Prevention:** Pre-generate 10 example trees as JSON, use "Demo Mode" toggle with cached responses, paid tier ($20 for hackathon), or video backup.

3. **CSS Layering Chaos** — Four visual layers create stacking context conflicts. Parallax renders on top of React Flow, particles disappear, HUD unclickable. Looks perfect in Chrome, broken in Safari during judge's test. **Prevention:** Document z-index system upfront (0/10/20/30/40), use CSS custom properties, test Chrome/Firefox/Safari, avoid canvas >256x256px with fixed positioning (Chrome bug).

4. **MongoDB Connection Timeout** — Atlas free tier sleeps after 5min inactivity. First demo query triggers 5-10s cold start. Page loads, first interaction hangs 10+ seconds, error timeout. **Prevention:** Keep-alive ping every 4min, warm database 5min before demo, increase pool size (50) and timeout (10s), pre-load critical data to Redis.

5. **Sound Blocking Main Thread** — Using deprecated ScriptProcessorNode (main thread) instead of AudioWorklet. Large audio files loaded synchronously. After 10 interactions, sounds cut out or browser crashes. Safari has no sound. **Prevention:** Use AudioWorklet (off main thread), pre-load/decode audio on init, limit concurrent sounds to 6, initialize AudioContext on first user gesture (iOS requirement).

6. **GPU Thrashing (Framer Motion + tsparticles)** — Both use GPU-accelerated animations. Running simultaneously on mobile causes thrashing, drops to 15 FPS. **Prevention:** Only animate transform/opacity (GPU-accelerated), never width/height/top/left, choose one animation library per layer, reduce particle count on mobile, test actual mobile device.

7. **Scope Creep ("80% Done" at Hour 20)** — Hour 20: core works but looks basic. Team adds "just one more" effect. Hour 24: nothing polished, demo fragmented. **Prevention:** Define 3 core demo moments (not features), feature freeze at Hour 18 (6hrs for polish), practice full 3-min demo at Hour 16/20/22.

## Implications for Roadmap

Based on research, a 4-phase structure is recommended following hackathon time constraints and dependency ordering. Total 24 hours: Foundation (8hrs), Visual Identity (6hrs), Gamification Loop (6hrs), Polish (4hrs).

### Phase 1: Foundation (Hours 0-8)
**Rationale:** Backend provides data contract for frontend development and can be tested independently. Canvas is the central feature that other UI layers build around. These can run in parallel with 2-person team.

**Delivers:**
- Express backend with stub endpoints returning mock data
- MongoDB connection with Topic/Summary cache models
- Infinite canvas with custom SnowballNode components
- Zustand store for node/edge management
- Basic pan/zoom working with controlled ReactFlow state

**Addresses (FEATURES.md):**
- Infinite canvas with pan/zoom (table stakes)
- Visual hierarchy foundation (enables glassmorphism later)

**Avoids (PITFALLS.md):**
- React Flow performance collapse — viewport culling and memoization implemented from start
- CSS layering chaos — z-index system documented before visual layers added

**Uses (STACK.md):**
- Vite + React setup
- @xyflow/react in controlled mode
- Express + MongoDB/Mongoose
- Zustand for state management

**Success metric:** Can click a node, store updates, new nodes appear on canvas with controlled state.

---

### Phase 2: Visual Identity (Hours 8-14)
**Rationale:** Enhances visual appeal without affecting core functionality. Establishes "Best UI/UX" differentiation early. Can run partially parallel with Phase 3 AI integration.

**Delivers:**
- Dark mode base (#121212) with navy/slate backgrounds
- Frosted glass UI cards (8-16px blur, 20-30% opacity)
- Winter color palette (amber/orange accents)
- Parallax background with 3 SVG layers (hills, trees, cabin)
- CSS particle system for gentle snow (Peace Mode)
- Basic hover microinteractions (200-300ms transitions)
- Z-index layering finalized and tested

**Addresses (FEATURES.md):**
- Visual hierarchy with depth (table stakes)
- Dark mode with 4.5:1 contrast (table stakes)
- Smooth microinteractions (table stakes)
- Frosted glass UI (differentiator)
- Seasonal color palette (differentiator)
- Cabin as visual element (differentiator setup)

**Avoids (PITFALLS.md):**
- CSS layering chaos — systematic z-index implementation
- GPU thrashing — CSS animations only, GPU-accelerated properties

**Uses (STACK.md):**
- Tailwind CSS for rapid styling
- tsparticles for snow effects
- framer-motion for microinteractions
- SVG for parallax layers

**Success metric:** Judges react to visual atmosphere in first 10 seconds. All layers visible and non-conflicting in Chrome/Firefox/Safari.

---

### Phase 3: AI Integration & Gamification Loop (Hours 14-20)
**Rationale:** Unlocks real data flow and completes the core gameplay loop. Combines AI integration with game mechanics since they're tightly coupled (quiz responses drive storm intensity).

**Delivers:**
- Featherless API service (POST /api/scout for topic branching)
- Gemini API service (POST /api/inspect for quiz generation)
- Cache-first middleware on both endpoints (24hr TTL)
- Game mode state machine (Peace ↔ Blizzard transitions)
- Quiz UI component (question display, multiple choice, submit)
- Correct/incorrect feedback (visual state change <200ms)
- Blizzard Mode toggle (increases particle intensity, darker sky, cabin glow)
- Survival mechanic (quiz score affects storm intensity)
- Thermometer HUD component
- Demo Mode toggle (pre-cached responses for rate limit protection)

**Addresses (FEATURES.md):**
- Dynamic AI topic branching (differentiator)
- Contextual Gemini quiz generation (differentiator)
- Dual-mode atmospheric shift (differentiator)
- Survival mechanics tied to learning (differentiator)
- Progress visibility (table stakes)
- Immediate quiz feedback (table stakes)

**Avoids (PITFALLS.md):**
- AI API rate limiting — Demo Mode with cached responses, quota monitoring
- MongoDB connection timeout — Cache-first reduces DB load, connection pooling configured

**Uses (STACK.md):**
- @google/generative-ai SDK for Gemini
- Axios for Featherless API calls
- MongoDB for response caching
- Zustand game mode state machine

**Success metric:** Can enter Blizzard Mode, answer questions, see storm react to performance. API failures handled gracefully. Demo Mode works without live API calls.

---

### Phase 4: Polish & Demo Prep (Hours 20-24)
**Rationale:** Performance optimization after core features complete. Final 4 hours focus on seamless demo experience and backup plans.

**Delivers:**
- Cinematic camera transitions between nodes (easing curves)
- Viewport-based node virtualization (performance)
- Mobile device detection and particle density adjustment
- Loading states, error boundaries, edge cases
- Progress indicator polish (topics explored, quiz score)
- Cabin visual refinement (SVG illustration with glow effect)
- Demo script (2-3 minute walkthrough)
- Video recording of working demo (backup)
- Cross-browser testing (Chrome, Firefox, Safari)
- 200+ node stress test

**Addresses (FEATURES.md):**
- Cinematic camera transitions (differentiator)
- Responsive feedback polish (table stakes)

**Avoids (PITFALLS.md):**
- Scope creep — feature freeze at Hour 18, only polish/fixes after
- All critical pitfalls — verification testing with realistic conditions

**Uses (STACK.md):**
- Framer Motion for camera animations
- React.lazy() for code splitting
- LazyMotion for bundle reduction

**Success metric:** Can deliver full demo narrative without crashes. Video backup recorded. All checkpoints passed.

---

### Phase Ordering Rationale

- **Phases 1 and 2 backend/frontend can run in parallel** with 2-person team (one on Express/MongoDB, one on React/Canvas)
- **Phase 3 blocks on Phase 1** but Visual Identity (Phase 2) can overlap with early AI integration
- **Phase 4 must be last** — can't optimize what doesn't exist, performance testing requires complete system
- **Feature freeze at Hour 18** is hard cutoff — 6 hours for polish more valuable than new features
- **Critical path: Foundation → AI Integration → Polish** (16 hours minimum)
- **Parallelizable work saves 4-6 hours** enabling time buffer for unexpected issues

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 3 (AI Integration):** API-specific implementation details needed
  - Featherless API endpoint structure, request/response format
  - Gemini prompt engineering for quiz generation (structured output schema)
  - Rate limit specifics for both APIs (check current 2026 tiers)
  - Cache TTL strategy (24hr vs topic-specific)

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation):** Well-documented React Flow + Express + MongoDB patterns, official docs sufficient
- **Phase 2 (Visual Identity):** Standard CSS/Tailwind + tsparticles, extensive examples available
- **Phase 4 (Polish):** Performance optimization follows known patterns, profiling tools well-documented

**Additional research recommended:**
- **Specific color palette hex values** for WCAG contrast verification (moody winter with 4.5:1 ratio)
- **Featherless model selection** (which LLM endpoint to use for topic branching)
- **Gemini prompt templates** for consistent quiz generation format

### Time-Sensitive Checkpoints

Research identified critical moments to catch pitfalls before they become disasters:

- **Hour 8:** Can you demo one complete interaction end-to-end? (If no: scope too large, cut features)
- **Hour 12:** Does it work with real API not hardcoded data? (If no: simplify or use Demo Mode)
- **Hour 16:** Does it work in all 3 browsers? (If no: 8 hours to fix, prioritize now)
- **Hour 18:** FEATURE FREEZE — Are 3 core demo moments polished? (If no: cut everything else)
- **Hour 20:** Can you do full 3-min demo with no failures? (If no: 4 hours for critical blockers)
- **Hour 22:** Do you have recorded video backup? (If no: record before final rush bugs appear)

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All core technologies verified with official docs and 2026-dated sources. Version compatibility confirmed. Vite, @xyflow/react, framer-motion, tsparticles all have recent official documentation. |
| Features | MEDIUM | Table stakes and UI fundamentals confirmed by 2026 UI/UX trends (glassmorphism, dark mode, microinteractions). Differentiators (dual-mode atmospheric shift) are novel application without direct examples but validated by mood-based UI trends. |
| Architecture | HIGH | Layered rendering, cache-first middleware, controlled ReactFlow, and state machine patterns all verified with official docs and production examples. MERN stack architecture well-documented. |
| Pitfalls | HIGH | All 7 critical pitfalls verified with official troubleshooting guides, community discussions, and post-mortem analyses. Gemini rate limit reduction (92% cut in Dec 2025) confirmed by multiple sources. React Flow performance issues documented in official performance guide. |

**Overall confidence:** HIGH

Research synthesized from official documentation (React Flow, Vite, Gemini API, MongoDB), verified 2026 UI/UX trend analysis (12+ sources), hackathon winning strategies (MIT Sloan, Devpost), and production architecture guides (Redis caching patterns, AI web app architecture). Confidence reduced only for novel feature combinations (no direct FRACTAL-like examples exist).

### Gaps to Address

**During planning/early phases:**
- **Featherless API specifics:** Endpoint URL, authentication method, request format, response schema for topic branching. Need to review current Featherless documentation (not covered in general research).
- **Gemini structured output format:** Best practices for quiz generation with consistent JSON structure. Official docs exist but need application-specific prompt engineering.
- **Exact color palette:** Moody winter hex values that meet WCAG 4.5:1 contrast on dark backgrounds. Needs specific accessibility testing with contrast checker.

**During integration phase:**
- **API rate limit monitoring:** Implement real-time quota tracking for both Featherless and Gemini. Display remaining calls in dev UI.
- **Mobile breakpoint strategy:** Research shows desktop-first recommended, but need specific breakpoint definition (768px, 1024px?) and fallback messaging.

**Post-MVP (v2):**
- **Sound design specifics:** If time permits, need Web Audio API implementation research (AudioWorklet vs AudioContext patterns, iOS Safari unlock requirements).
- **Accessibility enhancements:** Beyond contrast ratios, full ARIA labels, keyboard navigation, screen reader testing not researched for hackathon scope.

**Known unknowns:**
- **Featherless model performance:** Token generation speed, context window limits, cost per request. Need testing to validate it meets <2s response time expectations.
- **Actual particle count for 60 FPS:** Research suggests <100 particles, but device-specific testing required to find optimal number (may be 50-150 range).

## Sources

### Primary (HIGH confidence)

**Official Documentation:**
- [Vite Official Guide](https://vite.dev/guide/) — Build tool configuration, environment variables
- [@xyflow/react API Reference](https://reactflow.dev/api-reference/react-flow) — React Flow usage, performance optimization
- [framer-motion Official Docs](https://motion.dev) — Animation best practices, bundle reduction
- [tsparticles Official Site](https://particles.js.org/) — Particle system configuration, performance
- [MongoDB Official Docs](https://www.mongodb.com/docs/) — Connection pooling, performance tuning
- [Express.js MongoDB REST API Tutorial](https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial) — MERN stack patterns
- [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai) — Gemini integration
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables/system-environment-variables) — Deployment configuration

**2026-Verified Stack Research:**
- [How to Set Up a Production-Ready React Project with TypeScript and Vite](https://oneuptime.com/blog/post/2026-01-08-react-typescript-vite-production-setup/view) (2026-01-08)
- [Stop Waiting for Your React App to Load: The 2026 Guide to Vite](https://medium.com/@shubhspatil77/stop-waiting-for-your-react-app-to-load-the-2026-guide-to-vite-7e071923ab9f) (2026-01)
- [React Flow 12 Release](https://xyflow.com/blog/react-flow-12-release) — Latest features and migration guide
- [shadcn/ui Tailwind v4 Docs](https://ui.shadcn.com/docs/tailwind-v4) (2026)
- [State Management in 2025: When to Use Context, Redux, Zustand, or Jotai](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k)

**UI/UX Trends 2026:**
- [12 UI/UX Design Trends That Will Dominate 2026 (Data-Backed)](https://www.index.dev/blog/ui-ux-design-trends)
- [Glassmorphism: Definition and Best Practices - NN/G](https://www.nngroup.com/articles/glassmorphism/)
- [10 Dark Mode UI Best Practices & Principles for 2026](https://www.designstudiouiux.com/blog/dark-mode-ui-design-best-practices/)
- [Dark Glassmorphism: The Aesthetic That Will Define UI in 2026](https://medium.com/@developer_89726/dark-glassmorphism-the-aesthetic-that-will-define-ui-in-2026-93aa4153088f)

**Critical Pitfalls:**
- [React Flow Performance Documentation](https://reactflow.dev/learn/advanced-use/performance) — Viewport culling, memoization
- [Gemini API Rate Limits 2026: Complete Developer Guide](https://blog.laozhang.ai/en/posts/gemini-api-rate-limits-guide)
- [Google's Gemini API Free Tier Fiasco](https://quasa.io/media/google-s-gemini-api-free-tier-fiasco-developers-hit-by-silent-rate-limit-purge) — Dec 2025 92% reduction
- [How to Fix "connection timeout" Errors in MongoDB](https://oneuptime.com/blog/post/2025-12-15-mongodb-connection-timeout-errors/view)
- [CSS Z-Index Explained: Stop the Stacking Chaos](https://dev.to/satyam_gupta_0d1ff2152dcc/css-z-index-explained-stop-the-stacking-chaos-manage-layers-like-a-pro-1fcj)
- [Web Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

### Secondary (MEDIUM confidence)

**Architecture & Caching:**
- [3 Design Patterns to Speed Up MEAN and MERN Stack Applications](https://redis.io/learn/guides/three-caching-design-patterns) — Cache-first middleware
- [Building a Production-Grade AI Web App in 2026](https://dev.to/art_light/building-a-production-grade-ai-web-app-in-2026-architecture-trade-offs-and-hard-won-lessons-4llg)
- [State Machines in React](https://mastery.games/post/state-machines-in-react/) — Game mode state machine pattern

**Gamification & Learning:**
- [7 Best Gamified Learning Management Systems for Employee Training in 2026](https://www.d2l.com/blog/gamified-learning-management-system/)
- [10 Best Gamification Education Apps for Adults (2026)](https://yukaichou.com/gamification-examples/10-best-gamification-education-apps/)

**Knowledge Exploration Tools:**
- [Obsidian Canvas - Visualize Your Ideas](https://obsidian.md/canvas)
- [oMyTree – Turn AI Chats into Knowledge Trees](https://www.omytree.com/)
- [Scrintal - The Most Customizable Knowledge Graph](https://scrintal.com/features/knowledge-graph)

**Hackathon Strategies:**
- [Avoid These Five Pitfalls at Your Next Hackathon | MIT Sloan](https://sloanreview.mit.edu/article/avoid-these-five-pitfalls-at-your-next-hackathon/)
- [3 Effective Tips for Managing Your Time During a Hackathon](https://tips.hackathon.com/article/3-effective-tips-for-managing-your-time-during-a-hackathon)
- [Why Tech Demos Fail (Even After Weeks of Prep)](https://medium.com/@srinathmohan_21939/why-tech-demos-fail-even-after-weeks-of-prep-and-what-you-can-do-about-it-5f5696fc7cab)
- [Zeabur 2026 New Year Tech Challenge Hackathon Winners](https://zeabur.com/blogs/zeabur-2026-new-year-hackathon)

### Tertiary (LOW confidence - needs validation)

- [Building React Native Apps with Gemini 3 Pro APIs in 2026](https://vocal.media/futurism/building-react-native-apps-with-gemini-3-pro-ap-is-in-2026) — General AI integration patterns (React Native, but principles apply)
- [JavaScript Particles Background Guide 2026](https://copyprogramming.com/howto/javascript-particles-background-js-code-example) — Particle performance (community tutorial)

---
*Research completed: 2026-02-07*
*Ready for roadmap: YES*
*Total research files synthesized: 4 (STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md)*
