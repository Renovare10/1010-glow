import { writable, type Writable } from 'svelte/store';
import { PlacementManager } from './placement';
import { LineClearer } from './lineClearer';

export type Screen = 'menu' | 'game' | 'pause' | 'store';
export const uiState = writable<{ screen: Screen; paused: boolean }>({
  screen: 'menu',
  paused: false
});

export const gameState = writable<boolean[][]>(
  Array(10).fill(null).map(() => Array(10).fill(false))
);

export type AnchorType = 'corner' | 'center' | 'line';
export type Piece = { name: string; shape: boolean[][]; anchor: AnchorType };
export const pieces: Piece[] = [
  { name: 'square', shape: [[true, true], [true, true]], anchor: 'center' }, // 2x2: Snap center
  { name: 'L', shape: [[true, false, false], [true, false, false], [true, true, true]], anchor: 'center' },
  { name: 'L_90', shape: [[true, true, true], [true, false, false], [true, false, false]], anchor: 'center' },
  { name: 'L_180', shape: [[true, true, true], [false, false, true], [false, false, true]], anchor: 'center' },
  { name: 'L_270', shape: [[false, false, true], [false, false, true], [true, true, true]], anchor: 'center' },
  { name: 'smallL', shape: [[true, false], [true, true]], anchor: 'center' },
  { name: 'smallL_90', shape: [[true, true], [true, false]], anchor: 'center' },
  { name: 'smallL_180', shape: [[true, true], [false, true]], anchor: 'center' },
  { name: 'smallL_270', shape: [[false, true], [true, true]], anchor: 'center' },
  { name: 'bar5_h', shape: [[true, true, true, true, true]], anchor: 'center' },
  { name: 'bar5_v', shape: [[true], [true], [true], [true], [true]], anchor: 'center' },
  { name: 'bar4_h', shape: [[true, true, true, true]], anchor: 'line' },
  { name: 'bar4_v', shape: [[true], [true], [true], [true]], anchor: 'line' },
  { name: 'bar3_h', shape: [[true, true, true]], anchor: 'center' },
  { name: 'bar3_v', shape: [[true], [true], [true]], anchor: 'center' },
  { name: 'bar2_h', shape: [[true, true]], anchor: 'line' },
  { name: 'bar2_v', shape: [[true], [true]], anchor: 'line' },
  { name: 'single', shape: [[true]], anchor: 'center' },
  { name: 'cube3', shape: [[true, true, true], [true, true, true], [true, true, true]], anchor: 'center' }
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

// Placement manager store
export const placementManager = new PlacementManager(pieces);

// Line clearer, subscribed to placement pipeline
export const lineClearer = new LineClearer(placementManager.getStore(), gameState);