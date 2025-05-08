import { writable } from 'svelte/store';

export type Screen = 'menu' | 'game' | 'pause' | 'store';
export const uiState = writable<{ screen: Screen; paused: boolean }>({
  screen: 'menu',
  paused: false
});

export const gameState = writable<boolean[][]>(
  Array(10).fill(null).map(() => Array(10).fill(false))
);