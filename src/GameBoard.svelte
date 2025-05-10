<script lang="ts">
  import { gameState, refillSlots, dragging, slots, pieces } from './lib/stores';
  import PieceSlots from './PieceSlots.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    refillSlots();
    return () => {};
  });

  function handlePointerUp(event: PointerEvent) {
    const board = document.querySelector('.grid');
    if (board && board.contains(event.target as Node) && $dragging.piece) {
      const rect = board.getBoundingClientRect();
      const cellSize = rect.width / 10; // Board is 10x10
      // Calculate cursor position relative to board
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let row: number, col: number;

      // Handle placement based on piece height
      const pieceHeight = $dragging.piece.shape.length;
      if (pieceHeight === 3) {
        // L-shape: Align center-left cell (row 1, col 0) to left of nearest cell edge
        // Find the nearest cell based on cursor position
        const cellRow = Math.floor(y / cellSize);
        const cellCol = Math.floor(x / cellSize);
        // Calculate distances to cell edges (top, bottom, left, right)
        const topDist = Math.abs(y - cellRow * cellSize);
        const bottomDist = Math.abs(y - (cellRow + 1) * cellSize);
        const leftDist = Math.abs(x - cellCol * cellSize);
        const rightDist = Math.abs(x - (cellCol + 1) * cellSize);
        // Find the closest edge
        const minDist = Math.min(topDist, bottomDist, leftDist, rightDist);
        // Prioritize horizontal edges for column, vertical for row
        if (leftDist === minDist || rightDist === minDist) {
          col = leftDist <= rightDist ? cellCol : cellCol + 1;
        } else {
          col = cellCol;
        }
        if (topDist === minDist || bottomDist === minDist) {
          row = topDist <= bottomDist ? cellRow : cellRow + 1;
        } else {
          row = cellRow;
        }
        // Align center-left cell (row 1, col 0) to left of cell
        row = row - 1; // Center-left at row 1, so top-left at row - 1
        col = col - 1; // Place left of cursor's cell
      } else {
        // 2x2 square: Snap top-left to one up and left of nearest node
        row = Math.round((y - cellSize * 0.25) / cellSize) - 1;
        col = Math.round((x - cellSize * 0.25) / cellSize) - 1;
      }

      // Ensure piece fits within board bounds
      if (
        row >= 0 &&
        col >= 0 &&
        row + $dragging.piece.shape.length <= 10 &&
        col + $dragging.piece.shape[0].length <= 10
      ) {
        // Update gameState
        gameState.update(state => {
          const newState = state.map(row => [...row]);
          const piece = $dragging.piece!;
          for (let i = 0; i < piece.shape.length; i++) {
            for (let j = 0; j < piece.shape[i].length; j++) {
              if (piece.shape[i][j]) {
                newState[row + i][col + j] = true;
              }
            }
          }
          return newState;
        });

        // Remove piece from slot and refill
        if ($dragging.slotIndex !== null) {
          slots.update(s => {
            const newSlots = [...s];
            newSlots[$dragging.slotIndex!] = pieces[Math.floor(Math.random() * pieces.length)];
            return newSlots;
          });
        }

        console.log('Placed piece on board:', $dragging.piece, 'at', { row, col });
      } else {
        console.log('Invalid drop (out of bounds), returning to slot');
      }
    } else {
      console.log('Invalid drop (not on board), returning to slot');
    }
    dragging.set({ piece: null, slotIndex: null, x: 0, y: 0 });
  }
</script>

<div class="board">
  <div class="grid" on:pointerup={handlePointerUp}>
    {#each $gameState as row, i}
      {#each row as cell, j}
        <div class="cell" class:occupied={cell}></div>
      {/each}
    {/each}
  </div>
  <PieceSlots />
</div>

<style>
  .board {
    text-align: center;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
  }
  .grid {
    display: grid;
    grid-template: repeat(10, 1fr) / repeat(10, 1fr);
    width: min(90vw, 90vh);
    max-width: 700px;
    height: min(90vw, 90vh);
    max-height: 700px;
    aspect-ratio: 1;
    gap: 2px;
    background: #252526;
    margin: 0;
  }
  .cell {
    background: #3c3c3c;
    border: 1px solid #444;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .occupied {
    background: #007acc;
  }
</style>