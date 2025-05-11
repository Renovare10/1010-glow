import { writable, type Writable, get } from 'svelte/store';
import { PlacementManager } from '../placement/placement';
import { LineClearer } from '../placement/lineClearer';
import { type Piece, pieces, getRandomPiece } from '../pieces/pieces'; // Use type qualifier for Piece

// Re-export Piece for dependent modules
export type { Piece };

export type Screen = 'menu' | 'game' | 'pause' | 'store';
export const uiState = writable<{ screen: Screen; paused: boolean }>({
  screen: 'menu',
  paused: false
});

export const gameState = writable<(string | null)[][]>(
  Array(10).fill(null).map(() => Array(10).fill(null))
);

export const slots = writable<(Piece | null)[]>([]);
export const refillSlots = () => {
  const newSlots = Array(3)
    .fill(null)
    .map(() => getRandomPiece());
  slots.set(newSlots);
};

export const popSlot = (slotIndex: number | null) => {
  if (slotIndex !== null) {
    slots.update((s) => {
      const newSlots = [...s];
      newSlots[slotIndex] = null; // Pop piece
      return newSlots;
    });

    // Check if all slots are empty
    const currentSlots = get(slots);
    if (currentSlots.every(slot => slot === null)) {
      refillSlots(); // Generate new set
    }
  }
};

// Store for dragging state
export const dragging = writable<{
  piece: Piece | null;
  slotIndex: number | null;
  x: number;
  y: number;
}>({ piece: null, slotIndex: null, x: 0, y: 0 });

// Placement manager store
export const placementManager = new PlacementManager(pieces);

// Line clearer, subscribed to placement pipeline
export const lineClearer = new LineClearer(placementManager.getStore(), gameState);