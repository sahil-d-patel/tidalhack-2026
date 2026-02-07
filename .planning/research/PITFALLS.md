# Pitfalls Research

**Domain:** Visually-rich gamified web app with React Flow, particle effects, AI APIs (24-hour hackathon)
**Researched:** 2026-02-07
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: React Flow Performance Collapse with Many Nodes + Particle Effects

**What goes wrong:**
React Flow renders all nodes by default (even off-viewport), while tsparticles and framer-motion animations run continuously. During demo, scrolling/panning becomes laggy at 50+ nodes, particles stutter, judges notice visual jank. UI/UX score tanks.

**Why it happens:**
Developers test with 5-10 nodes during development. Real demo uses knowledge graph with 100+ nodes. Multiple animation libraries (React Flow transforms, tsparticles canvas, framer-motion, parallax background) all compete for GPU resources. No viewport culling configured.

**How to avoid:**
- Set React Flow's `onlyRenderVisibleElements={false}` to enable viewport culling (renders only visible nodes)
- Use `snapToGrid` and `snapGrid={[50, 50]}` to reduce node position update frequency
- Memoize all custom node components with React.memo()
- Reduce tsparticles count to <100 for background effects
- Disable framer-motion animations on React Flow nodes (choose one animation library per layer)
- Test with 200+ nodes before demo day

**Warning signs:**
- Frame rate drops below 30 FPS when panning
- Browser DevTools Performance tab shows >50ms scripting time per frame
- CPU usage >80% during animations
- Visible jank when moving nodes

**Phase to address:**
Foundation Phase — Performance budget and testing with realistic node counts must be established before building features.

---

### Pitfall 2: AI API Rate Limiting During Live Demo

**What goes wrong:**
Demo starts, you click "Generate Knowledge Branch" → spinner appears → 30 seconds pass → 429 error "Rate limit exceeded." Audience loses interest. Judges see a broken feature. You explain "it worked yesterday" but demo time is over.

**Why it happens:**
Gemini API free tier was slashed 92% (250 RPD → 20 RPD) in December 2025 without warning. Featherless has burst limits. During final testing (night before demo), team exhausts daily quota. Next day's quota resets but first 5 demo attempts consume it. Multiple API calls per interaction (embedding + generation + vision) multiply quickly.

**How to avoid:**
- Pre-generate 10 example knowledge trees, load from JSON on demo day (zero API calls)
- Use "Demo Mode" toggle that loads cached responses instead of live API calls
- If live API required: paid tier ($20 gets 1500 RPM vs 15 RPM free) + queue system with max 3 concurrent requests
- Mock API responses in development, only use real API for final integration test
- Monitor rate limits in real-time with quota tracking UI (show "API calls remaining: 12/20")
- Have video recording of working feature as backup

**Warning signs:**
- 429 errors appearing in console during testing
- API calls taking >5 seconds consistently
- Multiple team members testing simultaneously exhausting quota
- No fallback mechanism when API fails

**Phase to address:**
Integration Phase — API wrapper with caching, demo mode, and fallback must be built before connecting to UI.

---

### Pitfall 3: CSS Layering Chaos (Parallax + Canvas + Particles + HUD)

**What goes wrong:**
Parallax background renders on top of React Flow. Particle overlay disappears. HUD buttons are unclickable. Blizzard effect obscures nodes. Looks perfect in Chrome, completely broken in Safari during judge's test. Demo delayed 5 minutes trying to fix z-index live.

**Why it happens:**
Four visual layers (parallax background, React Flow canvas, tsparticles overlay, blizzard effect, HUD) each create stacking contexts. Developer adds `z-index: 999` to fix one issue, breaks another. React Flow uses fixed positioning, which creates new stacking context. Canvas elements >256x256px in Chrome with fixed positioning render other fixed elements improperly. No cross-browser testing.

**How to avoid:**
- Document z-index system upfront:
  - Layer 0 (z-index: 0): Parallax background
  - Layer 1 (z-index: 10): React Flow canvas
  - Layer 2 (z-index: 20): Particle effects
  - Layer 3 (z-index: 30): Blizzard overlay
  - Layer 4 (z-index: 40): HUD/UI
- Use CSS custom properties: `--z-background: 0; --z-flow: 10; --z-particles: 20;`
- All layers must use `position: absolute` or `fixed` (not mixed)
- Test in Chrome, Firefox, Safari before demo
- Avoid canvas >256x256px with fixed positioning (triggers Chrome rendering bug)
- Use browser DevTools 3D view to visualize stacking contexts

**Warning signs:**
- Elements appearing/disappearing when you add new components
- Click events not registering on UI elements
- Different rendering in Chrome vs Safari
- Escalating z-index values (999, 9999, 99999)

**Phase to address:**
Foundation Phase — CSS architecture and layer system must be designed before building visual features.

---

### Pitfall 4: MongoDB Connection Timeout on First Demo Load

**What goes wrong:**
Open demo URL. Page loads. Click first interaction. Spinner for 10+ seconds. Error: "Connection timeout." Refresh page, now it works. Judges already moved on.

**Why it happens:**
MongoDB serverless instances (Atlas free tier) "sleep" after 5 minutes of inactivity. First query after wake triggers 5-10 second cold start. Demo starts with cold database. Connection pool `maxPoolSize` too low (default 10), or `connectTimeoutMS` too short (default 30s). No connection retry logic.

**How to avoid:**
- Keep-alive ping: cron job hits API endpoint every 4 minutes to prevent database sleep
- Warm up database 5 minutes before demo: run test query to wake connection
- Increase connection pool: `maxPoolSize: 50, minPoolSize: 5`
- Increase timeout: `connectTimeoutMS: 10000, socketTimeoutMS: 45000`
- Implement retry logic with exponential backoff (3 retries)
- Pre-load critical data into Redis/memory cache for instant demo startup
- Have local MongoDB fallback for demo day

**Warning signs:**
- First API call takes >5 seconds, subsequent calls instant
- "MongoTimeoutException" in logs
- Demo works after refresh but not on first load
- 5-10 second delay after periods of inactivity

**Phase to address:**
Data Layer Phase — Database connection strategy and warming must be implemented with data access layer.

---

### Pitfall 5: Sound Design Blocking Main Thread or Crashing Browser

**What goes wrong:**
User clicks node. Sound plays but UI freezes for 200ms. After 10 interactions, sounds start cutting out or browser tab crashes. Safari on judge's laptop has no sound at all.

**Why it happens:**
Using deprecated ScriptProcessorNode (runs on main thread) instead of AudioWorklet. Loading large audio files synchronously on interaction. No Web Audio API context management (iOS Safari requires user gesture to unlock audio). Memory leak from not cleaning up audio buffers. Multiple audio files playing simultaneously exhaust audio context limits (6-32 sources depending on browser).

**How to avoid:**
- Use AudioWorklet (off main thread) not ScriptProcessorNode (deprecated)
- Pre-load and decode all audio files on app init with `decodeAudioData()` (async)
- Limit concurrent sounds to 6 (recycle oldest AudioBufferSourceNode)
- Initialize AudioContext on first user interaction (iOS Safari requirement)
- Clean up audio nodes after playback: `source.stop(); source.disconnect();`
- Provide "Mute" toggle prominently (some judges prefer silent demos)
- Test audio in Safari/iOS, not just Chrome
- Consider silent demo mode as default with opt-in audio

**Warning signs:**
- UI freezes momentarily when sound plays
- Console warnings about AudioContext
- Sounds cut off or don't play after several interactions
- Memory usage climbing steadily in DevTools
- Audio works in Chrome but not Safari

**Phase to address:**
Sound Integration Phase — Audio system architecture must be built properly before adding sound effects.

---

### Pitfall 6: Framer Motion + tsparticles GPU Thrashing

**What goes wrong:**
Opening animation looks smooth. Add particle effects. Now both stutter. GPU usage spikes to 100%. Mobile browsers drop to 15 FPS. Visual "Best UI/UX" demo has worst performance.

**Why it happens:**
Framer Motion and tsparticles both use GPU-accelerated animations (CSS transforms, canvas rendering). Running simultaneously on mobile devices with limited GPU causes thrashing. Animating non-GPU properties (width, height, top, left) forces layout recalculation every frame.

**How to avoid:**
- Only animate `transform` and `opacity` (GPU-accelerated)
- Never animate `top`, `left`, `width`, `height` (triggers layout)
- Choose one animation library per visual layer:
  - framer-motion for UI components (buttons, modals)
  - tsparticles for background ambiance only
  - React Flow's built-in transforms for node movement
- Reduce particle count on mobile: detect with `window.innerWidth < 768`
- Use `will-change: transform` sparingly (only on actively animating elements)
- Throttle particle updates to 30 FPS instead of 60 FPS
- Test on actual mobile device, not just DevTools mobile simulation

**Warning signs:**
- GPU usage >80% in Task Manager
- Animations stutter when multiple effects run
- Mobile devices significantly slower than desktop
- Battery drain during testing

**Phase to address:**
Foundation Phase — Animation performance budget and GPU monitoring must be established before building visual features.

---

### Pitfall 7: Scope Creep Kills Demo ("It's 80% Done" at Hour 20)

**What goes wrong:**
Hour 20: Core features work but look basic. Team adds "just one more" particle effect, then AI vision integration, then sound effects, then mobile responsive design. Hour 24: nothing fully polished, demo is fragmented, "Best UI/UX" entry has visual bugs and incomplete features.

**Why it happens:**
Hackathon projects accomplish ~25% of planned scope. Team underestimates polish time (5 hours to build feature, 3 hours to make it demo-ready). No ruthless prioritization. "Nice-to-have" features started before "must-have" features are polished.

**How to avoid:**
- Define 3 core demo moments (not features):
  1. "Wow" visual moment: Fractal zoom animation
  2. "It works" moment: AI generates knowledge branch
  3. "Unique value" moment: Interactive exploration reveals insights
- Use "Demo Day +" prioritization:
  - Demo Day: Ship these 3 moments polished
  - Post-hackathon: Everything else
- Feature freeze at Hour 18 (6 hours for polish, testing, recording backup video)
- 2-hour time blocks: 1.5 hours building, 0.5 hours testing in demo scenario
- Every feature must work in demo flow or gets cut (no "we'll fix it during presentation")
- Practice full 3-minute demo at Hour 16, Hour 20, Hour 22

**Warning signs:**
- Adding features after Hour 16
- "Almost done" repeated for same feature
- No full end-to-end demo run yet
- Core features still have bugs but new features being added
- Team splitting to work on different "priorities"

**Phase to address:**
Planning Phase — Demo script and non-negotiable feature freeze must be defined before coding starts.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems (or demo-day problems).

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoded API responses | Instant "working" feature | Doesn't work with real API, demo breaks when API added | Only for UI mockups early on, must replace by Hour 12 |
| Inline styles everywhere | Fast styling iteration | CSS layering conflicts impossible to debug | Never (use Tailwind or CSS modules from start) |
| No error handling | Features work in happy path | Demo crashes on any edge case | Never (wrap all async in try-catch minimum) |
| Single MongoDB instance | Simple setup | Connection timeout on cold start | Only if keep-alive ping implemented |
| Testing only in Chrome | Faster dev cycle | Safari/Firefox bugs discovered during demo | Never (test all browsers at Hour 16, 20, 22) |
| AI API calls on every interaction | Impressive "live" AI | Exhausts rate limits during testing/demo | Never (use demo mode toggle with cached responses) |
| All animations at 60 FPS | Smooth on desktop | Mobile devices unusable | Detect mobile, reduce to 30 FPS or disable non-critical animations |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Gemini API | Using free tier (20 RPD, exhausted in testing) | Demo mode with cached responses OR paid tier ($20 for hackathon) |
| Featherless API | No timeout handling (can hang indefinitely) | 10-second timeout + loading state + error fallback |
| MongoDB Atlas | No connection warming (cold start on demo) | Keep-alive ping every 4 minutes OR pre-warm 5 min before demo |
| Vercel deployment | Environment variables undefined in production | Add via Dashboard or `vercel env add`, never rely on .env file |
| Web Audio API | AudioContext not initialized on user gesture (Safari) | Initialize on first click, check state before playing sounds |

## Performance Traps

Patterns that work at small scale but fail as usage grows (or during demo with realistic data).

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| React Flow rendering all nodes | Smooth with 10 nodes, laggy with 50+ | `onlyRenderVisibleElements={false}`, memoize custom nodes | >30 nodes with animations |
| Unlimited particle count | Beautiful on desktop, slideshow on mobile | Detect mobile, reduce to <50 particles, throttle to 30 FPS | Mobile browsers, older laptops |
| No API request concurrency limits | Works in dev (1 user), breaks in demo (5 team members testing) | Queue with max 3 concurrent, implement demo mode | Multiple users or rapid interactions |
| Synchronous audio loading | First interaction loads fast, subsequent clicks lag | Pre-load and decode all audio on init with `decodeAudioData()` | After 3+ audio files loaded on demand |
| CSS animations without `will-change` | Smooth initially, jank after multiple layers added | Use `will-change: transform` on actively animating elements only | 4+ animated layers (parallax + particles + flow + HUD) |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| API keys in client-side code | Keys exposed in browser, exhausted by malicious users before demo | All API calls through serverless functions/API routes, keys in env vars |
| No rate limiting on AI endpoints | Malicious actor exhausts Gemini quota, demo fails | Implement server-side rate limiting (10 req/min/IP) |
| MongoDB connection string in client code | Database credentials exposed, data wiped before demo | Connection only in server-side API routes, never client |
| CORS wide open (`*`) with sensitive endpoints | Anyone can call your API, exhaust quotas | Restrict CORS to your Vercel domain only |
| Unvalidated AI prompt injection | User inputs malicious prompts, AI returns inappropriate content during demo | Sanitize inputs, use content filtering, have prompt guardrails |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No loading states for AI generation | 5-second blank screen, user thinks it's broken | Animated loading spinner + "Generating knowledge..." text + progress indicator |
| Particle effects obscure interactive elements | Can't click nodes because particles on top | Particles in background layer only, 50% opacity, pause on hover |
| Sound effects with no mute option | Annoying in quiet demo environment, judges can't concentrate | Muted by default with prominent "Enable Sound" toggle |
| No onboarding for complex UI | Judges don't understand what to do, click randomly | 15-second animated tutorial on first load OR demo mode with pre-scripted flow |
| Tiny click targets for nodes | Difficult to interact, especially on touchscreen/trackpad | Minimum 44px click area, visible hover state |
| No error recovery flow | AI fails, user stuck on error screen | "Try again" button + fallback to example data |
| Overwhelming visual density | Looks impressive but cognitive overload | Progressive disclosure: simple view by default, "Show advanced" toggle |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **AI Integration**: Tested with rate limiting failures — verify retry logic works, demo mode with cached responses tested
- [ ] **Particle Effects**: Tested on mobile device (not just DevTools) — verify <30 FPS acceptable or disable on mobile
- [ ] **Sound System**: Tested in Safari/iOS (not just Chrome) — verify AudioContext initialized on user gesture
- [ ] **Database Connection**: Tested after 10 minutes of inactivity — verify cold start doesn't cause 10-second timeout
- [ ] **React Flow Performance**: Tested with 200+ nodes — verify viewport culling working, no jank when panning
- [ ] **CSS Layering**: Tested in Chrome, Firefox, Safari — verify all layers visible and interactive in all browsers
- [ ] **Environment Variables**: Tested in Vercel production deployment — verify API keys loaded correctly, not from .env
- [ ] **Error States**: Tested with network disabled — verify graceful degradation, not white screen of death
- [ ] **Demo Flow**: Full 3-minute run-through with cold start — verify no stutters, failures, or awkward pauses
- [ ] **Backup Plan**: Video recording of working demo — verify plays smoothly if live demo fails

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Rate limiting during demo | MEDIUM | Switch to demo mode (if implemented), show video backup, explain "worked in testing" |
| Performance jank during demo | LOW | Reduce visible nodes (zoom in to show detail), disable particles temporarily, refresh page |
| CSS layering broken in Safari | HIGH | Switch to Chrome for demo, acknowledge Safari bug, show video backup |
| MongoDB connection timeout | MEDIUM | Refresh page (triggers reconnect), show cached example data, explain will be fixed |
| Sound not working | LOW | Acknowledge and continue ("sound optional"), focus on visual features |
| API error during generation | MEDIUM | Click "try again" (if retry implemented), fallback to pre-generated example, continue demo |
| Framer Motion crashes browser | HIGH | Disable animations in code quickly (comment out), refresh, demo without animations |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| React Flow performance collapse | Foundation | Load test with 200+ nodes, measure FPS >30 |
| AI API rate limiting | Integration | Demo mode tested, quota monitoring working |
| CSS layering chaos | Foundation | 3 browsers tested, all layers visible/interactive |
| MongoDB connection timeout | Data Layer | Cold start test after 10 min inactivity <5s |
| Sound blocking main thread | Sound Integration | Audio plays without UI freeze, tested in Safari |
| GPU thrashing | Foundation | Mobile device tested, FPS >30 with all effects |
| Scope creep | Planning | Feature freeze at Hour 18, demo script defined |

## Hackathon-Specific Warnings

Unique to 24-hour time pressure context.

| Phase | Likely Pitfall | Mitigation |
|-------|---------------|------------|
| Hour 0-6 (Foundation) | Over-engineering architecture | Use Vite + React + Tailwind defaults, no custom webpack |
| Hour 6-12 (Features) | Building features that aren't in demo script | Refer to demo script before starting any feature |
| Hour 12-16 (Integration) | Integrating all features simultaneously | Integrate one at a time, test each before moving on |
| Hour 16-18 (Polish) | Starting new features instead of polishing | Hard feature freeze, only bug fixes and polish allowed |
| Hour 18-22 (Testing) | Testing only happy path | Test all error cases, cross-browser, cold starts |
| Hour 22-24 (Prep) | No backup plan for demo failures | Record video backup, prepare demo mode, practice 3x |

## Time-Sensitive Checkpoints

Critical moments to catch pitfalls before they become disasters.

**Hour 8 Checkpoint:**
- Can you demo one complete interaction end-to-end?
- If no: scope is too large, cut features now

**Hour 12 Checkpoint:**
- Does it work with real API (not hardcoded data)?
- If no: API integration is harder than expected, simplify or use demo mode

**Hour 16 Checkpoint:**
- Does it work in all 3 browsers (Chrome, Firefox, Safari)?
- If no: you have 8 hours to fix cross-browser issues, prioritize now

**Hour 18 Feature Freeze:**
- Are your 3 core demo moments polished and tested?
- If no: cut all other features, focus on polishing core 3

**Hour 20 Checkpoint:**
- Can you do a full 3-minute demo with no failures?
- If no: you have 4 hours to fix critical blockers, identify and fix now

**Hour 22 Final Checkpoint:**
- Do you have a recorded video backup of a successful demo?
- If no: record now before bugs appear in final rush

## Sources

### React Flow Performance
- [React Flow Performance Documentation](https://reactflow.dev/learn/advanced-use/performance) - Official performance optimization guide
- [React Flow Stress Test Examples](https://reactflow.dev/examples/nodes/stress) - Official stress testing examples
- [How to improve React Flow performance with large graphs](https://github.com/xyflow/xyflow/discussions/4975) - Community discussion on performance
- [The ultimate guide to optimize React Flow project performance](https://medium.com/@lukasz.jazwa_32493/the-ultimate-guide-to-optimize-react-flow-project-performance-42f4297b2b7b) - Comprehensive optimization guide

### Animation Performance
- [Framer Help: Troubleshooting Animation Issues](https://www.framer.com/help/articles/troubleshooting-animation-issues/) - Official troubleshooting guide
- [How to Troubleshoot Common Framer Performance Issues](https://goodspeed.studio/blog/how-to-troubleshoot-common-framer-performance-issues) - Performance optimization strategies
- [tsParticles Performance Considerations](https://particles.js.org/) - Official documentation
- [Beyond Eye Candy: Top 7 React Animation Libraries for Real-World Apps in 2026](https://www.syncfusion.com/blogs/post/top-react-animation-libraries) - Modern animation library comparison

### AI API Rate Limiting
- [Gemini API Rate Limits 2026: Complete Developer Guide](https://blog.laozhang.ai/en/posts/gemini-api-rate-limits-guide) - Current rate limits and solutions
- [Google's Gemini API Free Tier Fiasco: Developers Hit by Silent Rate Limit Purge](https://quasa.io/media/google-s-gemini-api-free-tier-fiasco-developers-hit-by-silent-rate-limit-purge) - December 2025 rate limit reduction incident
- [5 Ways to Solve AI Studio Gemini 3 Pro Rate Limits – 2026 Complete Guide](https://help.apiyi.com/en/ai-studio-gemini-3-pro-rate-limit-solution-en.html) - Workarounds and solutions

### Database Connection Issues
- [How to Fix "connection timeout" Errors in MongoDB](https://oneuptime.com/blog/post/2025-12-15-mongodb-connection-timeout-errors/view) - Troubleshooting guide
- [Tuning Your Connection Pool Settings - MongoDB Docs](https://www.mongodb.com/docs/manual/tutorial/connection-pool-performance-tuning/) - Official performance tuning
- [Connection Pool Overview - MongoDB Docs](https://www.mongodb.com/docs/manual/administration/connection-pool-overview/) - Official connection pool documentation

### CSS Layering and Z-Index
- [CSS Z-Index Explained: Stop the Stacking Chaos](https://dev.to/satyam_gupta_0d1ff2152dcc/css-z-index-explained-stop-the-stacking-chaos-manage-layers-like-a-pro-1fcj) - Stacking context guide
- [Z-index and stacking contexts | web.dev](https://web.dev/learn/css/z-index) - Official web.dev guide
- [HTML5 Canvas & z-index issue in Google Chrome](https://www.tutorialspoint.com/HTML5-Canvas-and-z-index-issue-in-Google-Chrome) - Canvas-specific Chrome rendering bug

### Web Audio API
- [Web Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - Official documentation
- [Web Audio FAQ | Chrome for Developers](https://developer.chrome.com/blog/web-audio-faq) - Common issues and solutions
- [Background audio processing using AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_AudioWorklet) - Off-main-thread audio processing

### Hackathon Best Practices
- [Avoid These Five Pitfalls at Your Next Hackathon | MIT Sloan](https://sloanreview.mit.edu/article/avoid-these-five-pitfalls-at-your-next-hackathon/) - Research-backed pitfall analysis
- [3 Effective Tips for Managing Your Time During a Hackathon](https://tips.hackathon.com/article/3-effective-tips-for-managing-your-time-during-a-hackathon) - Time management strategies
- [Why Tech Demos Fail (Even After Weeks of Prep)](https://medium.com/@srinathmohan_21939/why-tech-demos-fail-even-after-weeks-of-prep-and-what-you-can-do-about-it-5f5696fc7cab) - Demo failure analysis
- [Ultimate Hackathon Timeline Guide](https://www.automateathon.com/blog/events/hackathon-timeline-guide.html) - 24-hour time management

### Cross-Browser Compatibility
- [Top 10 Frustrating Browser Compatibility Issues Devs Face](https://www.lambdatest.com/blog/top-browser-compatibility-pain-points-for-developers/) - Common compatibility issues
- [Cross Browser Compatibility Issues to Avoid](https://www.browserstack.com/guide/common-cross-browser-compatibility-issues) - Best practices guide

### Deployment Issues
- [Vercel Environment Variables Documentation](https://vercel.com/docs/environment-variables/system-environment-variables) - Official environment variable guide
- [Vercel .env Variables are blank in Production](https://github.com/vercel/vercel/discussions/5015) - Common deployment issue

### Parallax Performance
- [The best way to create a parallax scrolling effect in 2026](https://www.builder.io/blog/parallax-scrolling-effect) - Modern parallax implementation
- [Fixing a parallax scrolling website to run in 60 FPS](https://kristerkari.github.io/adventures-in-webkit-land/blog/2013/08/30/fixing-a-parallax-scrolling-website-to-run-in-60-fps/) - Performance optimization techniques

---
*Pitfalls research for: FRACTAL - Gamified fractal knowledge explorer (Tidal Hack '26)*
*Researched: 2026-02-07*
*Focus: Critical mistakes that kill hackathon demos with complex visual UIs under 24-hour time pressure*
