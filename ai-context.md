# AI Context for 1010-Glow Project
## Project Overview

**Goal**: Build a 1010-klooni style puzzle game using Svelte, Vite, and TypeScript, with a mobile-first, PWA approach.  
**Current State**: 10x10 game board implemented, responsive, dark-themed (VS Code style), centered with three piece slots below; pieces (2x2 square, L-shape) draggable with smooth placement and overlap validation; deployed to AWS S3 (http://chadm-portfolio.s3-website.us-east-2.amazonaws.com/1010-glow/); no menu or pause screen, focusing on core mechanics.  
**Development Approach**: Agile, incremental gains, prioritizing small, working features with a build-test-feedback loop; modern code, scalability, commenting best practices.  
**Preferences**: Mobile-first, PWA-ready, dark theme, full-screen, responsive scaling; short responses, files directly in prompt, no bulky commands, Windows environment.

## Code Structure and Files

- **src/App.svelte**: Main app component rendering the game board, using flexbox for full-screen layout, centering content, dark theme (#1e1e1e).
- **src/GameBoard.svelte**: Renders 10x10 grid using CSS Grid, responsive (width: min(90vw, 90vh)), dark VS Code theme, centered with piece slots below; handles drag-and-drop via global touch/pointer events, uses coordinate-based board detection for placement with gameState and dragging stores.
- **src/PieceSlots.svelte**: Renders three slots with random pieces (2x2 square, L-shape), draggable with touch/pointer events, responsive scaling (min(90vw, 90vh) / 20 for cells), transparent drag preview.
- **src/lib/stores.ts**: Defines Svelte stores: uiState (screen: menu/game/pause/store, paused), gameState (10x10 boolean grid), pieces (2x2 square, L-shape), slots (three active pieces), dragging (piece, slot index, cursor position), placementManager (event-driven placement pipeline); used for game logic and UI.
- **src/lib/placement.ts**: Manages piece placement via an event-driven pipeline, handling position calculation, validation, and state updates.
- **src/app.css**: Global styles ensuring dark theme (#1e1e1e) and no scrollbars, sets body and #app to full-screen with zero margins/padding.
- **src/main.ts**: Entry point mounting App.svelte to #app div in index.html.
- **index.html**: HTML template with viewport meta for mobile responsiveness, Vite script for bundling; Cloudflare script removed to avoid 404s.
- **vite.config.ts**: Vite configuration for Svelte and TypeScript, setting port 3000, ESNext target, and base: '/1010-glow'.
- **package.json**: Defines dependencies (Svelte, Vite, TypeScript) and scripts (dev/build/preview).
- **tsconfig.json, tsconfig.app.json, tsconfig.node.json**: TypeScript configurations for type checking and compilation.
- **svelte.config.js**: Svelte configuration with vitePreprocess and adapter-static for S3 deployment (outputs to dist).
- **.github/workflows/deploy.yml**: GitHub Actions workflow for building and deploying to s3://chadm-portfolio/1010-glow/, streamlined with bash shell, no debug steps.

## Important Notes

- **Mobile-First**: Prioritizes touch events with robust pointer/touch handling, responsive scaling (e.g., min(90vw, 90vh) for board, pieces).
- **PWA Goals**: Planned for manifest.json and service worker, not yet implemented.
- **Dark Theme**: VS Code colors (#1e1e1e background, #252526 grid, #007acc occupied cells).
- **Agile Workflow**: One feature at a time (e.g., grid, pieces, drag-and-drop); avoid full implementation.
- **File Requests**: Stop and request missing files explicitly.
- **Response Style**: Short, task-focused, actionable; 2-3 practical options and 1 novel solution for feature discussions.
- **Deployment**: Fixed S3 subfolder issue (/1010-glow/); site live with correct asset paths.

## Context for Future Threads

**Recent Changes**: Implemented custom drag-and-drop with pointer and touch events for 2x2 square and L-shape pieces; resolved mobile drag issues (sticking, event propagation) using coordinate-based board detection and global event listeners; added placement validation to prevent overlaps; smooth placement snapping to grid intersections (2x2 golden, L-shape edge-based); three slots with random piece selection and refilling; resolved S3 deployment (subfolder access, Cloudflare script removed); deploy.yml streamlined (debug step removed, bash shell).  
**Pending Features**: Reduce drag preview size (to ~80% of board cell size), implement PWA setup (manifest.json, service worker), add game mechanics (line clearing, scoring).  
**User Preferences**: Files in prompt, no inline commands, Windows, minimal response bulk.  
**Testing**: Test changes (npm run dev, check mobile), provide feedback loop questions.