# AI Context for 1010-Glow Project

## Project Overview
- Goal: Build a 1010-klooni style puzzle game using Svelte, Vite, and TypeScript, with a mobile-first, PWA approach.
- Current State: 10x10 game board implemented, responsive, dark-themed (VS Code style), top-aligned with space below for pieces; deployed successfully to AWS S3 (`http://chadm-portfolio.s3-website.us-east-2.amazonaws.com/1010-glow/`); no menu or pause screen, focusing on core mechanics.
- Development Approach: Agile, incremental gains, prioritizing small, working features with a build-test-feedback loop; modern code, scalability, commenting best practices.
- Preferences: Mobile-first, PWA-ready, dark theme, full-screen, responsive scaling; short responses, files directly in prompt, no bulky commands, Windows environment.

## Code Structure and Files
- src/App.svelte: Main app component rendering the game board, using flexbox for full-screen layout, centering content, top-aligned with dark theme (#1e1e1e).
- src/GameBoard.svelte: Renders 10x10 grid using CSS Grid, responsive (`width: min(90vw, 90vh)`), dark VS Code theme, top-aligned with 10px margin, uses `gameState` store.
- src/lib/stores.ts: Defines Svelte stores for UI and game state, with `uiState` (screen: menu/game/pause/store, paused) and `gameState` (10x10 boolean grid); only `gameState` currently used.
- src/app.css: Global styles ensuring dark theme (#1e1e1e) and no scrollbars, sets `body` and `#app` to full-screen with zero margins/padding.
- src/main.ts: Entry point mounting `App.svelte` to `#app` div in `index.html`.
- index.html: HTML template with viewport meta for mobile responsiveness, Vite script for bundling; Cloudflare script removed to avoid 404s.
- vite.config.ts: Vite configuration for Svelte and TypeScript, setting port 3000, ESNext target, and `base: '/1010-glow'`.
- package.json: Defines dependencies (Svelte, Vite, TypeScript) and scripts (dev/build/preview).
- tsconfig.json, tsconfig.app.json, tsconfig.node.json: TypeScript configurations for type checking and compilation.
- svelte.config.js: Svelte configuration with `vitePreprocess` and `adapter-static` for S3 deployment (outputs to `dist`).
- .github/workflows/deploy.yml: GitHub Actions workflow for building and deploying to `s3://chadm-portfolio/1010-glow/`, streamlined with bash shell, no debug steps.

## Important Notes
- Mobile-First: Prioritizes touch events and responsive scaling (e.g., `min(90vw, 90vh)` for board).
- PWA Goals: Planned for manifest.json and service worker, not yet implemented.
- Dark Theme: VS Code colors (#1e1e1e background, #252526 grid, #007acc occupied cells).
- Agile Workflow: One feature at a time (e.g., grid, then pieces); avoid full implementation.
- File Requests: Stop and request missing files explicitly.
- Response Style: Short, task-focused, actionable; 2-3 practical options and 1 novel solution for feature discussions.
- Deployment: Fixed S3 subfolder issue (`/1010-glow/`); site live with correct asset paths.

## Context for Future Threads
- Recent Changes: Resolved S3 deployment (subfolder access, Cloudflare script removed); `deploy.yml` streamlined (debug step removed, bash shell).
- Pending Features: Draggable pieces (e.g., 2x2 square) with touch/mouse events, PWA setup (manifest.json, service worker), game mechanics (piece spawning, line clearing, scoring).
- User Preferences: Files in prompt, no inline commands, Windows, minimal response bulk.
- Testing: Test changes (`npm run dev`, check mobile), provide feedback loop questions.