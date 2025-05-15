AI Context for 1010-Glow Project  
**Project Overview**  
**Goal**: Build a 1010-klooni style puzzle game using Svelte, Vite, and TypeScript, with a mobile-first, PWA approach.  

**Current State**: 10x10 game board implemented, responsive, dark-themed (VS Code style, #1e1e1e), centered with three piece slots below; diverse pieces (2x2 square, small/large L-shapes with rotations, 1-5 cell bars, 3x3 cube) draggable with smooth placement, overlap validation, and line clearing for full rows/columns; random piece generation; scoring system (10, 30, 60, 100 points for 1, 2, 3, 4 lines); piece-specific colors (e.g., Frost Blue #88c0d0 for square, Pine Green #4c566a for L); drag preview scaled to 99% of board cell size with 75px Y-offset for thumb visibility; deployed to AWS S3 (http://chadm-portfolio.s3-website.us-east-2.amazonaws.com/1010-glow/); no menu, pause screen, or separate score display (score shown in Gameboard.svelte); focusing on core mechanics.

**Development Approach**: Agile, incremental gains, prioritizing small, working features with a build-test-feedback loop; modern code, scalability, commenting best practices; no unit tests, manual testing only.

**Preferences**: Mobile-first, PWA-ready, dark theme, full-screen, responsive scaling; short responses, files directly in prompt, no bulky commands, Windows environment.

**Code Structure and Files**  
- **src/App.svelte**: Main app component rendering the game board, using flexbox for full-screen layout, centering content, dark theme (#1e1e1e).  
- **src/Gameboard.svelte**: Layout wrapper for the game, using grid (1fr score, 8fr board, 2fr slots), dark VS Code theme (#1e1e1e); displays score reactively; delegates game logic/rendering to GameController.svelte.  
- **src/GameController.svelte**: Manages game logic, including slot initialization, drag-and-drop event handling with a 100px virtual margin below the board for input detection, and placement pipeline triggering; composes Grid.svelte and PieceSlots.svelte for UI.  
- **src/Grid.svelte**: Renders the 10x10 grid using CSS Grid, responsive (width: min(74vw, 74vh)), with dark VS Code theme; applies piece-specific colors from colors.ts based on gameState.  
- **src/PieceSlots.svelte**: Renders three slots with random pieces, draggable with touch/pointer events, responsive scaling (min(74vw, 74vh) / 20 for cells), drag preview at 99% board cell size with 75px Y-offset; uses colors.ts for piece-specific colors.  
- **src/lib/game/stores.ts**: Defines Svelte stores: uiState (screen: menu/game/pause/store, paused), gameState (10x10 grid of piece names or null, dynamic size support), slots (three active pieces), dragging (piece, slot index, cursor position), placementManager (event-driven placement pipeline), lineClearer (subscribes to pipeline for line clearing, emits clearedLines), scoreManager (subscribes to clearedLines, calculates score); imports piece definitions from pieces.ts.  
- **src/lib/game/ScoreManager.ts**: Manages score, subscribes to clearedLines, uses formula `10 * lines * (lines + 1) / 2` (10, 30, 60, 100 for 1, 2, 3, 4 lines), supports reset for game restarts.  
- **src/lib/pieces/pieces.ts**: Defines the Piece interface and a static array of pieces (2x2 square, small/large L-shapes with rotations, 1-5 cell bars, 3x3 cube, with anchor types: corner, center, line); provides getRandomPiece for random piece generation; structured for scalability (e.g., future rotation logic).  
- **src/lib/pieces/colors.ts**: Centralized color scheme for pieces (e.g., square: #88c0d0, L: #4c566a), supports multiple themes (currently dark), used by Grid.svelte and PieceSlots.svelte for DRY compliance.  
- **src/lib/placement/placement.ts**: Manages piece placement via an event-driven pipeline, handling position calculation (anchor-based snapping: corner, center, line, with 70px Y-offset and row clamping for bottom-row placement), validation, state updates with piece names, and emitting a clear event for line clearing.  
- **src/lib/placement/lineClearer.ts**: Subscribes to the placement pipeline’s clear event, detects/clears full rows/columns, emits clearedLines, supports dynamic grid sizes with validation, optimized for single store update.  
- **src/lib/board/**: Placeholder folder for future board-specific logic (e.g., grid animations, board services).  
- **src/app.css**: Global styles ensuring dark theme (#1e1e1e) and no scrollbars, sets body and #app to full-screen with zero margins/padding.  
- **src/main.ts**: Entry point mounting App.svelte to #app div in index.html.  
- **index.html**: HTML template with viewport meta for mobile responsiveness, Vite script for bundling; Cloudflare script removed to avoid 404s.  
- **vite.config.ts**: Vite configuration for Svelte and TypeScript, setting port 3000, ESNext target, and base: '/1010-glow'.  
- **package.json**: Defines dependencies (Svelte, Vite, TypeScript) and scripts (dev/build/preview).  
- **tsconfig.json, tsconfig.app.json, tsconfig.node.json**: TypeScript configurations for type checking and compilation; updated to enable "composite": true and set "outDir" for project references, resolving errors for DDD structure.  
- **svelte.config.js**: Svelte configuration with vitePreprocess and adapter-static for S3 deployment (outputs to dist).  
- **.github/workflows/deploy.yml**: GitHub Actions workflow for building and deploying to s3://chadm-portfolio/1010-glow/, streamlined with bash shell, no debug steps.

**Important Notes**  
- **Mobile-First**: Prioritizes touch events with robust pointer/touch handling, responsive scaling (e.g., min(74vw, 74vh) for board, pieces); virtual margin (100px) below board enables bottom-row placement.  
- **PWA Goals**: Planned for manifest.json and service worker, not yet implemented.  
- **Dark Theme**: VS Code colors (#1e1e1e background, #252526 grid, piece-specific colors from colors.ts).  
- **Agile Workflow**: One feature at a time (e.g., grid, pieces, drag-and-drop, line clearing, scoring); avoid full implementation; manual testing only.  
- **File Requests**: Stop and request missing files explicitly (e.g., GameController.svelte, placement.ts, pieces.ts for dynamic grid sizes).  
- **Response Style**: Short, task-focused, actionable; 2-3 practical options and 1 novel solution for feature discussions; artifacts wrapped in <xaiArtifact> tags with UUIDs.  
- **Deployment**: Fixed S3 subfolder issue (/1010-glow/); site live with correct asset paths.