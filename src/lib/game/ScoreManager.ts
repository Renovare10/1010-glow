import { writable, type Writable, get } from 'svelte/store';

/**
 * Manages game score based on cleared lines.
 * Subscribes to clearedLines events and updates the score store.
 */
export class ScoreManager {
  readonly score: Writable<number>;

  constructor(clearedLines: Writable<number>) {
    this.score = writable(0);
    clearedLines.subscribe(lines => {
      if (typeof lines === 'number' && lines > 0) {
        this.updateScore(lines);
      }
    });
  }

  /**
   * Updates the score based on the number of lines cleared.
   * @param linesCleared - Number of lines cleared (rows + columns).
   */
  private updateScore(linesCleared: number): void {
    // Simple scoring: 100 points per line
    const points = linesCleared * 100;
    this.score.update(current => current + points);
  }

  /**
   * Resets the score to 0 (e.g., for game restart).
   */
  reset(): void {
    this.score.set(0);
  }
}