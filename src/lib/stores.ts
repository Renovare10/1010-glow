import { writable } from 'svelte/store';

export type Screen = 'menu' | 'game' | 'pause' | 'store';
export const uiState = writable<{ screen: Screen; paused: boolean }>({
  screen: 'menu',
  paused: false
});

export const gameState = writable<boolean[][]>(
  Array(10).fill(null).map(() => Array(10).fill(false))
);

export type Piece = { name: string; shape: boolean[][] };
export const pieces: Piece[] = [
  { name: 'square', shape: [[true, true], [true, true]] },
  { name: 'L', shape: [[true, false], [true, false], [true, true]] }
];

export const slots = writable<Piece[]>([]);
export const refillSlots = () => {
  const newSlots = Array(3)
    .fill(null)
    .map(() => pieces[Math.floor(Math.random() * pieces.length)]);
  slots.set(newSlots);
};

// Store for dragging state
export const dragging = writable<{
  piece: Piece | null;
  slotIndex: number | null;
  x: number;
  y: number;
}>({ piece: null, slotIndex: null, x: 0, y: 0 });