import { writable, get, type Writable } from 'svelte/store';
import type { PlacementEvent } from './placement';

/**
 * Manages detection and clearing of full rows and columns via the placement pipeline.
 * Subscribes to 'clear' events to process game state updates and emits cleared lines.
 */
export class LineClearer {
  readonly clearedLines: Writable<number>;
  private readonly width: number;
  private readonly height: number;

  constructor(
    store: Writable<PlacementEvent>,
    gameState: Writable<(string | null)[][]>,
    width = 10,
    height = 10
  ) {
    this.width = width;
    this.height = height;
    this.clearedLines = writable(0);
    store.subscribe(event => {
      if (event.type === 'clear') {
        const linesCleared = this.clearLines(gameState);
        this.clearedLines.set(linesCleared);
      }
    });
  }

  /**
   * Checks and clears full rows and columns in the game state.
   * @param gameState - Writable store of the game grid with piece names or null.
   * @returns Number of lines cleared (rows + columns).
   */
  private clearLines(gameState: Writable<(string | null)[][]>): number {
    const state = get(gameState);

    // Validate grid dimensions and cell types
    if (
      state.length !== this.height ||
      state.some(row => row.length !== this.width) ||
      state.some(row => row.some(cell => cell !== null && typeof cell !== 'string'))
    ) {
      console.warn('Invalid game state: incorrect dimensions or cell types');
      return 0;
    }

    // Check rows
    const fullRows = state
      .map((row, index) => (row.every(cell => cell !== null) ? index : -1))
      .filter(index => index !== -1);

    // Check columns
    const fullCols = Array(this.width)
      .fill(null)
      .map((_, col) => (state.every(row => row[col] !== null) ? col : -1))
      .filter(index => index !== -1);

    // Clear rows and columns in one update if needed
    let linesCleared = 0;
    if (fullRows.length > 0 || fullCols.length > 0) {
      gameState.update(current => {
        const newState = current.map(row => [...row]);
        // Clear full rows
        fullRows.forEach(rowIdx => {
          newState[rowIdx] = Array(this.width).fill(null);
        });
        // Clear full columns
        fullCols.forEach(colIdx => {
          for (let row = 0; row < this.height; row++) {
            newState[row][colIdx] = null;
          }
        });
        return newState;
      });
      linesCleared = fullRows.length + fullCols.length;
    }

    return linesCleared;
  }
}