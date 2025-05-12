import { writable, get, type Writable } from 'svelte/store';
import { popSlot } from '../game/stores';
import type { Piece } from '../pieces/pieces';

export interface PlacementEvent {
  type: 'start' | 'validate' | 'apply' | 'clear' | 'cancel';
  piece: Piece | null;
  event: PointerEvent | null;
  boardRect: DOMRect | null;
  slotIndex: number | null;
}

interface PlacementResult {
  success: boolean;
  row?: number;
  col?: number;
  error?: string;
}

export class PlacementManager {
  private store = writable<PlacementEvent>({ type: 'cancel', piece: null, event: null, boardRect: null, slotIndex: null });
  private pieces: Piece[];
  private isProcessing: boolean = false;

  constructor(pieces: Piece[]) {
    this.pieces = pieces;
  }

  getStore() {
    return this.store;
  }

  trigger(event: PlacementEvent) {
    this.store.set(event);
  }

  process(
    gameState: Writable<(string | null)[][]>,
    slots: Writable<(Piece | null)[]>
  ) {
    this.store.subscribe(({ type, piece, event, boardRect, slotIndex }) => {
      if (this.isProcessing || type !== 'start' || !piece || !event || !boardRect || slotIndex === null) {
        if (type === 'start') {
          this.store.set({ type: 'cancel', piece: null, event: null, boardRect: null, slotIndex: null });
        }
        return;
      }

      this.isProcessing = true;

      const result = this.calculatePosition(piece, event, boardRect);
      if (!result.success) {
        this.store.set({ type: 'cancel', piece: null, event: null, boardRect: null, slotIndex: null });
        this.isProcessing = false;
        return;
      }

      if (!this.validatePlacement(piece, result.row!, result.col!, gameState)) {
        this.store.set({ type: 'cancel', piece: null, event: null, boardRect: null, slotIndex: null });
        this.isProcessing = false;
        return;
      }

      this.applyPlacement(piece, result.row!, result.col!, gameState);
      popSlot(slotIndex);
      this.store.set({ type: 'clear', piece: null, event: null, boardRect: null, slotIndex: null });
      this.store.set({ type: 'apply', piece, event: null, boardRect: null, slotIndex: null });
      this.isProcessing = false;
    });
  }

  private calculatePosition(piece: Piece, event: PointerEvent, boardRect: DOMRect): PlacementResult {
    const cellSize = boardRect.width / 10;
    const x = event.clientX - boardRect.left;
    const y = event.clientY - boardRect.top - 70; // Keep offset for preview visibility

    const height = piece.shape.length;
    const width = piece.shape[0].length;

    let row: number, col: number;

    switch (piece.anchor) {
      case 'corner':
        row = Math.floor((y + cellSize * 0.25) / cellSize);
        col = Math.floor((x + cellSize * 0.25) / cellSize);
        break;
      case 'center':
        const centerRow = (y / cellSize) - (height / 2);
        const centerCol = (x / cellSize) - (width / 2);
        row = Math.round(centerRow);
        col = Math.round(centerCol);
        break;
      case 'line':
        if (width > height) {
          col = Math.round((x / cellSize) - (width / 2));
          row = Math.floor(y / cellSize);
        } else {
          row = Math.round((y / cellSize) - (height / 2));
          col = Math.floor(x / cellSize);
        }
        break;
      default:
        return { success: false, error: 'Invalid anchor type' };
    }

    // Clamp row to ensure bottom-row placement
    row = Math.min(row, 9 - height + 1);
    if (row < 0 || col < 0 || col + width > 10) {
      return { success: false, error: 'Out of bounds' };
    }

    return { success: true, row, col };
  }

  private validatePlacement(piece: Piece, row: number, col: number, gameState: Writable<(string | null)[][]>): boolean {
    const state: (string | null)[][] = get(gameState);
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
        if (piece.shape[i][j] && state[row + i][col + j] !== null) {
          return false;
        }
      }
    }
    return true;
  }

  private applyPlacement(piece: Piece, row: number, col: number, gameState: Writable<(string | null)[][]>) {
    gameState.update((state: (string | null)[][]) => {
      const newState = state.map((r: (string | null)[]) => [...r]);
      for (let i = 0; i < piece.shape.length; i++) {
        for (let j = 0; j < piece.shape[i].length; j++) {
          if (piece.shape[i][j]) {
            newState[row + i][col + j] = piece.name;
          }
        }
      }
      return newState;
    });
  }
}