/**
 * Defines and manages game pieces for the 1010-Glow game.
 * Provides piece data and generation logic for scalability.
 */

export type AnchorType = 'corner' | 'center' | 'line';
export interface Piece {
  name: string;
  shape: boolean[][];
  anchor: AnchorType;
}

/**
 * Static array of predefined pieces, including all shapes and rotations.
 * Structured to allow future dynamic generation (e.g., rotations).
 */
export const pieces: Piece[] = [
  { name: 'square', shape: [[true, true], [true, true]], anchor: 'center' },
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

/**
 * Returns a random piece from the pieces array.
 */
export function getRandomPiece(): Piece {
  return pieces[Math.floor(Math.random() * pieces.length)];
}