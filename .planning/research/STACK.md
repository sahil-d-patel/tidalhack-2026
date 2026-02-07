# Technology Stack

**Project:** FRACTAL - Gamified Fractal Knowledge Explorer
**Domain:** Interactive knowledge visualization with atmospheric winter theme
**Researched:** 2026-02-07
**Confidence:** HIGH

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 18.x/19.x | UI library | Industry standard with concurrent rendering support. Framer Motion v11+ has improved React 19 compatibility. Use 18.x for stability or 19.x for cutting edge. |
| Vite | 5.x+ | Build tool & dev server | Sub-300ms dev server start time (critical for hackathon). Replaced deprecated create-react-app. Native ESM, instant HMR, optimized builds via Rollup. |
| TypeScript | 5.x+ | Type safety | Optional but recommended. Enables better IntelliSense, catches errors early. Can scaffold with `npm create vite@latest -- --template react-ts`. |
| Node.js | 20.x LTS or 22.x | Backend runtime | LTS for stability. ES module support with "type": "module" in package.json. |
| Express | 4.x | Backend framework | Minimal, flexible, battle-tested. Perfect for REST API with middleware architecture. |

### Database & Caching

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| MongoDB | 6.x+ | Primary database | Document database (BSON = JSON-like). Natural fit for Node.js. Easy schema evolution during hackathon. |
| Mongoose | 8.x+ | MongoDB ODM | Schema validation, query builder, middleware hooks. Use `.lean()` queries for 40x+ performance boost. |
| Redis | 7.x+ (optional) | Caching layer | 1098% faster queries vs no cache. Use for Featherless/Gemini response caching. Optional if time-constrained. |

### Canvas & Visualization

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @xyflow/react | 12.10.0+ | Node graph canvas | Renamed from `reactflow`. SSR support, built-in dark mode, infinite canvas with zoom/pan. Handles complex graphs with optimized rendering. GPU-accelerated transforms. |
| HTML5 Canvas | Native | Particle rendering | Native browser API. Maintains 60 FPS with 1000+ particles. Use for snow/fog effects. Better performance than SVG for particle systems. |

### Animation & Effects

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| framer-motion | 12.33.0+ | Component animations | Now branded as "Motion". v11+ has improved layout animations & React 19 support. Use `LazyMotion` to reduce bundle from 34kb to 6kb. Independent of React render cycle = smooth 60fps. |
| @tsparticles/react | 3.0.0 | Particle effects (snow) | Actively maintained core engine (3.9.1). Use `initParticlesEngine` with tree-shaking for minimal bundle. Supports snow, fog, wind presets. |

**Lightweight Alternative for Particles (if bundle size critical):**
- **canvas-nest.js** - 2-3kb, interactive dot backgrounds with mouse interaction
- **Falling Particles Library** - Vanilla JS, custom snowflake shapes, requestAnimationFrame optimization

### UI Components & Styling

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Tailwind CSS | 4.x | Utility-first CSS | Fast styling during hackathon. Purges unused CSS automatically. v4 has improved DX. |
| shadcn/ui | Latest | Component library | Copy-paste components (not npm dependency). Built on Radix UI + Tailwind. v4 compatible. Uses single `radix-ui` package (cleaner package.json). |
| lucide-react | Latest | Icon library | Default for shadcn/ui. Tree-shakeable. 1000+ icons. Modern, consistent design. |

### State Management

| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| React Context API | Built-in | Theme, user preferences | Simple prop-drilling solutions. Fine for theme, locale, auth state. Avoid for complex/frequent updates. |
| Zustand | 5.x+ | Global state | Recommended for node graph state, UI state. Single store model. 85ms update time in complex forms. Simple API, no boilerplate. |
| TanStack Query | 5.x+ (optional) | Server state | Optional. Handles Featherless/Gemini API caching, retries, optimistic updates. Reduces custom fetch logic. |

**Recommendation for Hackathon:** Start with Context API for theme/auth. Add Zustand if node graph state gets complex. Skip TanStack Query unless API state becomes unwieldy.

### API Integration

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| @google/generative-ai | Latest | Gemini API SDK | Official Google SDK for Gemini. Handles text generation, multi-modal input. Backend integration recommended for API key security. |
| axios or fetch | Built-in fetch | HTTP client | Native `fetch` API is sufficient. Axios adds interceptors, automatic JSON parsing. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Code linting | Use flat config (eslint.config.js) for modern setup. Add @typescript-eslint if using TS. |
| Prettier | Code formatting | Integrate with ESLint via `eslint-config-prettier`. Auto-format on save. |
| vite-plugin-svgr | SVG as React components | Import SVGs as `<ReactComponent />`. Useful for custom icons. |
| rollup-plugin-visualizer | Bundle analysis | Treemap visualization of bundle size. Identify bloat early. |
| Vitest | Testing (optional) | Built into Vite ecosystem. Fast, Jest-compatible. Skip if time-constrained. |

## Installation

```bash
# Initialize Vite project
npm create vite@latest fractal-app -- --template react-ts
cd fractal-app

# Core dependencies
npm install @xyflow/react framer-motion @tsparticles/react tsparticles lucide-react

# tsParticles engine (load only needed features)
npm install @tsparticles/engine @tsparticles/basic @tsparticles/move-base @tsparticles/shape-circle

# State management
npm install zustand

# API integration
npm install @google/generative-ai axios

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Backend (separate directory)
npm init -y
npm install express mongoose dotenv cors
npm install -D nodemon

# Dev tools
npm install -D eslint prettier eslint-config-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D rollup-plugin-visualizer

# Optional: TanStack Query for advanced API state
npm install @tanstack/react-query

# Optional: Redis for caching
npm install redis
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| Build Tool | Vite | Webpack, Parcel | Webpack is slower (5-10s vs 300ms). Parcel lacks ecosystem. CRA is deprecated. |
| Node Graph | @xyflow/react | react-graph-vis, react-d3-graph | react-graph-vis less maintained. react-d3-graph steeper learning curve. @xyflow has best DX and performance. |
| Animation | framer-motion | GSAP, react-spring | GSAP requires GreenSock license for commercial. react-spring harder API. Motion has best React integration. |
| Particles | @tsparticles/react | particles.js, canvas-nest | particles.js deprecated (use tsparticles). canvas-nest limited features. tsparticles most customizable. |
| State | Zustand | Redux, Jotai, Recoil | Redux too much boilerplate for hackathon. Jotai atomic model overkill. Recoil less maintained. Zustand wins on simplicity. |
| UI Library | shadcn/ui + Tailwind | Material-UI, Chakra UI, Ant Design | MUI heavy bundle (300kb+). Chakra less flexible. Ant Design opinionated. shadcn gives full code ownership. |
| Backend | Express | Fastify, Koa, NestJS | Fastify faster but less ecosystem. Koa minimal docs. NestJS over-engineered for hackathon. Express has most Stack Overflow answers. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| create-react-app | Officially deprecated by React team (2025) | Vite with react template |
| particles.js | Unmaintained, superseded by tsparticles | @tsparticles/react |
| react-particles-js | Deprecated wrapper | @tsparticles/react |
| Redux (vanilla) | Too much boilerplate, slow DX | Redux Toolkit or Zustand |
| CSS-in-JS (Emotion, styled-components) | Runtime performance overhead, React 19 issues | Tailwind CSS with shadcn/ui |
| Webpack | Slow dev server (5-10s), complex config | Vite |
| MongoDB native driver (direct) | Low-level, no schema validation | Mongoose ODM |

## Stack Patterns by Variant

**If prioritizing SPEED (recommended for hackathon):**
- Use JavaScript (not TypeScript) to skip type definitions
- Skip testing framework (Vitest)
- Use Context API (not Zustand) until complexity demands
- Use native `fetch` (not axios)
- Skip Redis caching initially (add if API rate limits hit)
- Use canvas-nest.js (not tsparticles) for ultra-light particles

**If prioritizing POLISH (UI/UX award focus):**
- Invest in framer-motion animations (page transitions, micro-interactions)
- Use @tsparticles with custom snow shapes
- Add parallax layers with `motion.div` and `useScroll` hook
- Implement dark mode with shadcn/ui theming
- Use `react-scroll-parallax` for depth effects
- Add sound effects with Web Audio API (optional)

**If prioritizing SCALABILITY (post-hackathon):**
- Use TypeScript from start
- Implement TanStack Query for API state
- Add Redis caching layer
- Use Zustand with persist middleware
- Implement proper error boundaries
- Add Vitest with component tests

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| @xyflow/react 12.x | React 18.x or 19.x | SSR support added in v12. Dark mode built-in. |
| framer-motion 12.x | React 18.x or 19.x | v11+ has improved React 19 concurrent rendering support. |
| @tsparticles/react 3.x | tsparticles engine 3.x | Must install engine separately. Use modular imports for tree-shaking. |
| Tailwind CSS 4.x | Vite 5.x+ | Auto-configured with `npx tailwindcss init`. Works with PostCSS. |
| Mongoose 8.x | MongoDB 6.x+ | Use Node.js 18+ for best compatibility. |
| Zustand 5.x | React 18.x+ | Works with React 19. No breaking changes for basic usage. |

## Environment Variables Setup

**Vite requires VITE_ prefix for environment variables:**

```bash
# .env.local (add to .gitignore)
VITE_FEATHERLESS_API_KEY=your_key_here
VITE_GEMINI_API_KEY=your_key_here
VITE_API_BASE_URL=http://localhost:3000/api

# Backend .env
MONGODB_URI=mongodb://localhost:27017/fractal
FEATHERLESS_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
REDIS_URL=redis://localhost:6379
PORT=3000
```

**IMPORTANT SECURITY:** Never expose API keys in frontend code. Access them via `import.meta.env.VITE_*` only for non-sensitive config. Store Featherless/Gemini keys in backend .env and proxy requests through Express endpoints.

## Deployment (Hackathon Demo)

**Frontend:**
- **Vercel** (recommended): Push to GitHub, connect repo, auto-deploys. Zero config needed. ~5 min setup.
- **Netlify**: Similar to Vercel. Build command: `npm run build`, Publish dir: `dist`

**Backend:**
- **Render** (recommended): Free tier, MongoDB + Redis available as add-ons. Connect GitHub repo.
- **Railway**: Modern UI, generous free tier. One-click MongoDB/Redis deployment.
- **Fly.io**: Edge deployment, Dockerfile support. Good for global latency.

**Database:**
- **MongoDB Atlas**: Free M0 tier (512MB). Enable IP whitelist for hackathon venue.
- **Railway MongoDB**: One-click, no IP restrictions, easy for demos.

**Caching (if using Redis):**
- **Upstash**: Serverless Redis, free tier. REST API (no client required).
- **Redis Cloud**: Free 30MB tier. Traditional Redis protocol.

## Performance Optimization Checklist

- [ ] Enable Vite's `manualChunks` to split vendor bundles
- [ ] Use `React.lazy()` for code-splitting heavy components
- [ ] Implement framer-motion's `LazyMotion` (34kb → 6kb)
- [ ] Load tsparticles features selectively (not full bundle)
- [ ] Use `rollup-plugin-visualizer` to identify large dependencies
- [ ] Enable Tailwind's CSS purge (automatic in production)
- [ ] Use `@xyflow/react` with viewport-based rendering
- [ ] Implement Mongoose `.lean()` queries (40x faster)
- [ ] Add `prefers-reduced-motion` CSS for accessibility
- [ ] Use Canvas for particles (not DOM nodes)

## Sources

**High Confidence (Official Docs & Recent 2026 Sources):**
- [How to Set Up a Production-Ready React Project with TypeScript and Vite](https://oneuptime.com/blog/post/2026-01-08-react-typescript-vite-production-setup/view) (2026-01-08)
- [Stop Waiting for Your React App to Load: The 2026 Guide to Vite](https://medium.com/@shubhspatil77/stop-waiting-for-your-react-app-to-load-the-2026-guide-to-vite-7e071923ab9f) (2026-01)
- [@xyflow/react npm package](https://www.npmjs.com/package/@xyflow/react) - v12.10.0 (verified 2026-01)
- [React Flow 12 release](https://xyflow.com/blog/react-flow-12-release) (official)
- [framer-motion npm package](https://www.npmjs.com/package/framer-motion) - v12.33.0 (verified 2026-02-06)
- [Motion — JavaScript & React animation library](https://motion.dev) (official)
- [@tsparticles/react npm package](https://www.npmjs.com/package/@tsparticles/react) - v3.0.0
- [tsParticles official site](https://particles.js.org/) (official)
- [Express.js And MongoDB REST API Tutorial | MongoDB](https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial) (official)
- [State Management in 2025: When to Use Context, Redux, Zustand, or Jotai](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k) (2025)
- [Env Variables and Modes | Vite](https://vite.dev/guide/env-and-mode) (official)
- [14 Best React UI Component Libraries in 2026](https://www.untitledui.com/blog/react-component-libraries) (2026)
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) (official, 2026)

**Medium Confidence (Community Sources with 2026 Context):**
- [Beyond Eye Candy: Top 7 React Animation Libraries for Real-World Apps in 2026](https://www.syncfusion.com/blogs/post/top-react-animation-libraries) (2026)
- [Building React Native Apps with Gemini 3 Pro APIs in 2026](https://vocal.media/futurism/building-react-native-apps-with-gemini-3-pro-ap-is-in-2026) (2026)
- [Integrating Zoom, Pan, and Pinch in React Apps](https://blog.nashtechglobal.com/react-zoom-pan-pinch/)
- [Implementing Caching Strategies with Mongoose](https://moldstud.com/articles/p-implementing-caching-strategies-with-mongoose)
- [Optimizing Your React Vite Application: Reducing Bundle Size](https://shaxadd.medium.com/optimizing-your-react-vite-application-a-guide-to-reducing-bundle-size-6b7e93891c96)

---
*Stack research for: FRACTAL - Gamified Fractal Knowledge Explorer*
*Researched: 2026-02-07*
*Confidence: HIGH (all core technologies verified with official sources and 2026-dated articles)*
