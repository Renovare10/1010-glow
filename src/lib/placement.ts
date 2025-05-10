import { writable, get, type Writable } from 'svelte/store';
import type { Piece } from './stores';

/** Interface for placement events */
interface PlacementEvent {
  type: 'start' | 'validate' | 'apply' | 'cancel';
  piece: Piece | null;
  event: PointerEvent | null;
  boardRect: DOMRect | null;
  slotIndex: number | null;
}

/** Interface for placement result */
interface PlacementResult {
  success: boolean;
  row?: number;
  col?: number;
  error?: string;
}

/**
 * Manages piece placement as an event-driven pipeline.
 */
export class PlacementManager {
  private store = writable<PlacementEvent>({ type: 'cancel', piece: null, event: null, boardRect: null, slotIndex: null });
  private pieces: Piece[];

  constructor(pieces: Piece[]) {
    this.pieces = pieces;
  }

  /** Exposes the store for subscription */
  getStore() {
    return this.store;
  }

  /** Triggers a placement event */
  trigger(event: PlacementEvent) {
    this.store.set(event);
  }

  /** Processes placement pipeline: calculate position, validate, apply */
  process(
    gameState: Writable<boolean[][]>,
    slots: Writable<Piece[]>
  ) {
    this.store.subscribe(({ type, piece, event, boardRect, slotIndex }) => {
      if (type !== 'start' || !piece || !event || !boardRect) return;

      const result = this.calculatePosition(piece, event, boardRect);
      if (!result.success) {
        this.store.set({ type: 'cancel', piece: null, event: null, boardRect: null, slotIndex: null });
        console.log(result.error);
        return;
      }

      if (!this.validatePlacement(piece, result.row!, result.col!, gameState)) {
        this.store.set({ type: 'cancel', piece: null, event: null, boardRect: null, slotIndex: null });
        console.log('Invalid drop (out of bounds or overlap)');
        return;
      }

      this.applyPlacement(piece, result.row!, result.col!, gameState);
      this.refillSlot(slotIndex, slots);
      this.store.set({ type: 'apply', piece, event: null, boardRect: null, slotIndex: null });
      console.log('Placed piece:', piece, 'at', { row: result.row, col: result.col });
    });
  }

  /** Calculates drop position based on piece type */
  private calculatePosition(piece: Piece, event: PointerEvent, boardRect: DOMRect): PlacementResult {
    const cellSize = boardRect.width / 10;
    const x = event.clientX - boardRect.left;
    const y = event.clientY - boardRect.top;

    if (piece.shape.length === 3) {
      // L-shape: Align center-left cell (row 1, col 0) to nearest edge
      const cellRow = Math.floor(y / cellSize);
      const cellCol = Math.floor(x / cellSize);
      const topDist = Math.abs(y - cellRow * cellSize);
      const bottomDist = Math.abs(y - (cellRow + 1) * cellSize);
      const leftDist = Math.abs(x - cellCol * cellSize);
      const rightDist = Math.abs(x - (cellCol + 1) * cellSize);
      const minDist = Math.min(topDist, bottomDist, leftDist, rightDist);

      let row = cellRow;
      let col = cellCol;
      if (leftDist === minDist || rightDist === minDist) {
        col = leftDist <= rightDist ? cellCol : cellCol + 1;
      }
      if (topDist === minDist || bottomDist === minDist) {
        row = topDist <= bottomDist ? cellRow : cellRow + 1;
      }
      return { success: true, row: row - 1, col: col - 1 };
    } else {
      // 2x2 square: Snap top-left to one up and left of nearest node
      const row = Math.round((y - cellSize * 0.25) / cellSize) - 1;
      const col = Math.round((x - cellSize * 0.25) / cellSize) - 1;
      return { success: true, row, col };
    }
  }

  /** Validates placement for bounds and overlaps */
  private validatePlacement(piece: Piece, row: number, col: number, gameState: Writable<boolean[][]>): boolean {
    const state: boolean[][] = get(gameState);
    if (
      row < 0 ||
      col < 0 ||
      row + piece.shape.length > 10 ||
      col + piece.shape[0].length > 10
    ) {
      return false;
    }

    for (let i = 0; i < piece.shape.length; i++) {
      for (let j = 0; j < piece.shape[i].length; j++) {
        if (piece.shape[i][j] && state[row + i][col + j]) {
          return false;
        }
      }
    }
    return true;
  }

  /** Applies piece placement to game state */
  private applyPlacement(piece: Piece, row: number, col: number, gameState: Writable<boolean[][]>) {
    gameState.update((state: boolean[][]) => {
      const newState = state.map((r: boolean[]) => [...r]);
      for (let i = 0; i < piece.shape.length; i++) {
        for (let j = 0; j < piece.shape[i].length; j++) {
          if (piece.shape[i][j]) {
            newState[row + i][col + j] = true;
          }
        }
      }
      return newState;
    });
  }

  /** Refills slot with a random piece */
  private refillSlot(slotIndex: number | null, slots: Writable<Piece[]>) {
    if (slotIndex !== null) {
      slots.update((s) => {
        const newSlots = [...s];
        newSlots[slotIndex] = this.pieces[Math.floor(Math.random() * this.pieces.length)];
        return newSlots;
      });
    }
  }
}