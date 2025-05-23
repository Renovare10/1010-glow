# AI Context for 1010-Glow Project

## Project Overview

**Goal**: Build a 1010-klooni style puzzle game using Svelte, Vite, and TypeScript, with a mobile-first, PWA approach.  
**Current State**: 10x10 game board implemented, responsive, dark-themed (VS Code style), centered with three piece slots below; diverse pieces (2x2 square, small/large L-shapes with rotations, 1-5 cell bars, 3x3 cube) draggable with smooth placement, overlap validation, and line clearing for full rows/columns; random piece generation; color scheme for pieces (e.g., Frost Blue for square, Pine Green for L); drag preview scaled to 99% of board cell size; deployed to AWS S3 (http://chadm-portfolio.s3-website.us-east-2.amazonaws.com/1010-glow/); no menu or pause screen, focusing on core mechanics.  
**Development Approach**: Agile, incremental gains, prioritizing small, working features with a build-test-feedback loop; modern code, scalability, commenting best practices.  
**Preferences**: Mobile-first, PWA-ready, dark theme, full-screen, responsive scaling; short responses, files directly in prompt, no bulky commands, Windows environment.

## Code Structure and Files

- **src/App.svelte**: Main app component rendering the game board, using flexbox for full-screen layout, centering content, dark theme (#1e1e1e).
- **src/GameBoard.svelte**: Layout wrapper for the game, using flexbox to center content with a dark VS Code theme (#1e1e1e); delegates game logic and rendering to `GameController.svelte`.
- **src/GameController.svelte**: Manages game logic, including slot initialization, drag-and-drop event handling, and placement pipeline triggering; composes `Grid.svelte` and `PieceSlots.svelte` for UI.
- **src/Grid.svelte**: Renders the 10x10 grid using CSS Grid, responsive (width: min(74vw, 74vh)), with dark VS Code theme; applies piece-specific colors from `colors.ts` based on `gameState`.
- **src/PieceSlots.svelte**: Renders three slots with random pieces, draggable with touch/pointer events, responsive scaling (min(74vw, 74vh) / 20 for cells), drag preview at 99% board cell size; uses `colors.ts` for piece-specific colors.
- **src/lib/game/stores.ts**: Defines Svelte stores: `uiState` (screen: menu/game/pause/store, paused), `gameState` (10x10 grid of piece names or null), `slots` (three active pieces), `dragging` (piece, slot index, cursor position), `placementManager` (event-driven placement pipeline), `lineClearer` (subscribes to pipeline for line clearing); imports piece definitions from `pieces.ts`.
- **src/lib/pieces/pieces.ts**: Defines the `Piece` interface and a static array of pieces (2x2 square, small/large L-shapes with rotations, 1-5 cell bars, 3x3 cube, with anchor types: corner, center, line); provides `getRandomPiece` for random piece generation; structured for scalability (e.g., future rotation logic).
- **src/lib/pieces/colors.ts**: Centralized color scheme for pieces (e.g., square: #88c0d0, L: #4c566a), supports multiple themes (currently dark), used by `Grid.svelte` and `PieceSlots.svelte` for DRY compliance.
- **src/lib/placement/placement.ts**: Manages piece placement via an event-driven pipeline, handling position calculation (anchor-based snapping: corner, center, line), validation, state updates with piece names, and emitting a `clear` event for line clearing.
- **src/lib/placement/lineClearer.ts**: Subscribes to the placement pipeline’s `clear` event, detects and clears full rows/columns based on non-null cells, designed for extensibility (e.g., animations, scoring).
- **src/lib/board/**: Placeholder folder for future board-specific logic (e.g., grid animations, board services).
- **src/app.css**: Global styles ensuring dark theme (#1e1e1e) and no scrollbars, sets body and #app to full-screen with zero margins/padding.
- **src/main.ts**: Entry point mounting App.svelte to #app div in index.html.
- **index.html**: HTML template with viewport meta for mobile responsiveness, Vite script for bundling; Cloudflare script removed to avoid 404s.
- **vite.config.ts**: Vite configuration for Svelte and TypeScript, setting port 3000, ESNext target, and base: '/1010-glow'.
- **package.json**: Defines dependencies (Svelte, Vite, TypeScript) and scripts (dev/build/preview).
- **tsconfig.json, tsconfig.app.json, tsconfig.node.json**: TypeScript configurations for type checking and compilation; updated to enable `"composite": true` and set `"outDir"` for project references, resolving errors for DDD structure.
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

**Recent Changes**: Applied Domain-Driven Design (DDD) Lite by reorganizing `src/lib/` into domain-specific folders: `pieces/` (`pieces.ts`, `colors.ts`), `placement/` (`placement.ts`, `lineClearer.ts`), `game/` (`stores.ts`), and `board/` (placeholder); updated imports across files to reflect new structure. Refactored `GameBoard.svelte` into `Grid.svelte` (grid rendering), `GameController.svelte` (game logic, slot initialization, drag-and-drop), and `GameBoard.svelte` (layout wrapper) for clearer separation of concerns. Fixed TypeScript configuration errors: added `"composite": true` and `"outDir"` in `tsconfig.app.json` and `tsconfig.node.json` to support project references. Previously: refactored `stores.ts` to move piece definitions to `pieces.ts` for scalability; resolved TypeScript errors: TS1484 (type-only import for `Piece` with `verbatimModuleSyntax`), TS2307 (missing `pieces.ts` module), TS2339 (undeclared `isProcessing` in `placement.ts`), and TS2459 (non-exported `Piece`/`pieces`); fixed CSS typo (`упражнениеgap` to `gap`) and removed empty ruleset in `GameBoard.svelte`; implemented custom drag-and-drop with pointer/touch events; resolved mobile drag issues (sticking, event propagation) using coordinate-based board detection; added placement validation, anchor-based snapping (corner, center, line), three slots with random piece generation, and line clearing via an event-driven pipeline; resolved S3 deployment issues; added piece-specific color scheme in `colors.ts`; updated `gameState` for color persistence; fixed game board color bugs; set drag preview to 99% of board cell size.  
**Pending Features**: Implement PWA setup (manifest.json, service worker), add game mechanics (e.g., scoring, game over detection), menu/pause screen.