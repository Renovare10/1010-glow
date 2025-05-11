import { writable, get, type Writable } from 'svelte/store';
import type { PlacementEvent } from './placement';

/**
 * Manages detection and clearing of full rows and columns via the placement pipeline.
 * Subscribes to 'clear' events to process game state updates.
 */
export class LineClearer {
  constructor(store: Writable<PlacementEvent>, gameState: Writable<(string | null)[][]>) {
    store.subscribe(event => {
      if (event.type === 'clear') {
        this.clearLines(gameState);
      }
    });
  }

  /**
   * Checks and clears full rows and columns in the game state.
   * @param gameState - Writable store of the 10x10 game grid with piece names or null.
   * @returns Number of lines cleared (rows + columns).
   */
  private clearLines(gameState: Writable<(string | null)[][]>): number {
    let linesCleared = 0;
    const state = get(gameState);

    // Check rows
    const fullRows = state
      .map((row, index) => (row.every(cell => cell !== null) ? index : -1))
      .filter(index => index !== -1);

    // Check columns
    const fullCols = Array(10)
      .fill(null)
      .map((_, col) => (state.every(row => row[col] !== null) ? col : -1))
      .filter(index => index !== -1);

    // Clear full rows
    if (fullRows.length > 0) {
      gameState.update(current => {
        const newState = current.map((row, index) =>
          fullRows.includes(index) ? Array(10).fill(null) : [...row]
        );
        return newState;
      });
      linesCleared += fullRows.length;
    }

    // Clear full columns
    if (fullCols.length > 0) {
      gameState.update(current => {
        const newState = current.map(row => [...row]);
        fullCols.forEach(col => {
          for (let row = 0; row < 10; row++) {
            newState[row][col] = null;
          }
        });
        return newState;
      });
      linesCleared += fullCols.length;
    }

    return linesCleared;
  }
}