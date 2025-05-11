# AI Context for 1010-Glow Project

## Project Overview

**Goal**: Build a 1010-klooni style puzzle game using Svelte, Vite, and TypeScript, with a mobile-first, PWA approach.  
**Current State**: 10x10 game board implemented, responsive, dark-themed (VS Code style), centered with three piece slots below; diverse pieces (2x2 square, small/large L-shapes with rotations, 1-5 cell bars, 3x3 cube) draggable with smooth placement, overlap validation, and line clearing for full rows/columns; random piece generation; color scheme for pieces (e.g., Frost Blue for square, Pine Green for L); drag preview scaled to 99% of board cell size; deployed to AWS S3 (http://chadm-portfolio.s3-website.us-east-2.amazonaws.com/1010-glow/); no menu or pause screen, focusing on core mechanics.  
**Development Approach**: Agile, incremental gains, prioritizing small, working features with a build-test-feedback loop; modern code, scalability, commenting best practices.  
**Preferences**: Mobile-first, PWA-ready, dark theme, full-screen, responsive scaling; short responses, files directly in prompt, no bulky commands, Windows environment.

## Code Structure and Files

- **src/App.svelte**: Main app component rendering the game board, using flexbox for full-screen layout, centering content, dark theme (#1e1e1e).
- **src/GameBoard.svelte**: Renders 10x10 grid using CSS Grid, responsive (width: min(74vw, 74vh)), dark VS Code theme, centered with piece slots below; handles drag-and-drop via global touch/pointer events, uses coordinate-based board detection for placement with `gameState` and `dragging` stores; applies piece-specific colors from `colors.ts`.
- **src/PieceSlots.svelte**: Renders three slots with random pieces, draggable with touch/pointer events, responsive scaling (min(74vw, 74vh) / 20 for cells), drag preview at 99% board cell size; uses `colors.ts` for piece-specific colors.
- **src/lib/stores.ts**: Defines Svelte stores: `uiState` (screen: menu/game/pause/store, paused), `gameState` (10x10 grid of piece names or null), `pieces` (2x2 square, small/large L-shapes, 1-5 cell bars, 3x3 cube with anchor types), `slots` (three active pieces), `dragging` (piece, slot index, cursor position), `placementManager` (event-driven placement pipeline), `lineClearer` (subscribes to pipeline for line clearing); used for game logic and UI.
- **src/lib/placement.ts**: Manages piece placement via an event-driven pipeline, handling position calculation (anchor-based snapping: corner, center, line), validation, state updates with piece names, and emitting a `clear` event for line clearing.
- **src/lib/lineClearer.ts**: Subscribes to the placement pipeline’s `clear` event, detects and clears full rows/columns based on non-null cells, designed for extensibility (e.g., animations, scoring).
- **src/lib/colors.ts**: Centralized color scheme for pieces (e.g., square: #88c0d0, L: #4c566a), supports multiple themes (currently dark), used by `GameBoard.svelte` and `PieceSlots.svelte` for DRY compliance.
- **src/app.css**: Global styles ensuring dark theme (#1e1e1e) and no scrollbars, sets body and #app to full-screen with zero margins/padding.
- **src/main.ts**: Entry point mounting App.svelte to #app div in index.html.
- **index.html**: HTML template with viewport meta for mobile responsiveness, Vite script for bundling; Cloudflare script removed to avoid 404s.
- **vite.config.ts**: Vite configuration for Svelte and TypeScript, setting port 3000, ESNext target, and base: '/1010-glow'.
- **package.json**: Defines dependencies (Svelte, Vite, TypeScript) and scripts (dev/build/preview).
- **tsconfig.json, tsconfig.app.json, tsconfig.node.json**: TypeScript configurations for type checking and compilation.
- **svelte.config.js**: Svelte configuration with vitePreprocess and adapter-static for S3 deployment (outputs to dist).
- **.github/workflows/deploy.yml**: GitHub Actions workflow for building and deploying to s3://chadm-portfolio/1010-glow/, streamlined with bash shell, no debug steps.

## Important Notes

- **Mobile-First**: Prioritizes touch events with robust pointer/touch handling, responsive scaling (e.g., min(74vw, 74vh) for board, pieces).
- **PWA Goals**: Planned for manifest.json and service worker, not yet implemented.
- **Dark Theme**: VS Code colors (#1e1e1e background, #252526 grid, piece-specific colors from `colors.ts`).
- **Agile Workflow**: One feature at a time (e.g., grid, pieces, drag-and-drop, line clearing, color scheme); avoid full implementation.
- **File Requests**: Stop and request missing files explicitly.
- **Response Style**: Short, task-focused, actionable; 2-3 practical options and 1 novel solution for feature discussions.
- **Deployment**: Fixed S3 subfolder issue (/1010-glow/); site live with correct asset paths.

## Context for Future Threads

**Recent Changes**: Implemented custom drag-and-drop with pointer/touch events for diverse pieces (2x2 square, small/large L-shapes with rotations, 1-5 cell bars, 3x3 cube); resolved mobile drag issues (sticking, event propagation) using coordinate-based board detection and global event listeners; added placement validation to prevent overlaps; implemented anchor-based snapping (corner, center, line) for intuitive placement; three slots with random piece generation and refilling; added line clearing for full rows/columns using an event-driven pipeline with `lineClearer.ts`; resolved S3 deployment (subfolder access, Cloudflare script removed); deploy.yml streamlined (debug step removed, bash shell); added piece-specific color scheme (e.g., Frost Blue for square, Pine Green for L) in `colors.ts` for DRY compliance; updated `gameState` to store piece names for color persistence; fixed game board color bugs (board changing color on drag, all cells blue); set drag preview to 99% of board cell size with consistent scaling.  
**Pending Features**: Implement PWA setup (manifest.json, service worker), add game mec