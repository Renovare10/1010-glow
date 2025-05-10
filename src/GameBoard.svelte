<script lang="ts">
  import { gameState, dragging, slots, placementManager, pieces } from './lib/stores';
  import PieceSlots from './PieceSlots.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    slots.set(Array(3).fill(null).map(() => pieces[Math.floor(Math.random() * pieces.length)]));
    placementManager.process(gameState, slots); // Initialize pipeline
    return () => {};
  });

  function handlePointerUp(event: PointerEvent) {
    const board = document.querySelector('.grid');
    if (!board || !board.contains(event.target as Node) || !$dragging.piece) {
      console.log('Invalid drop (not on board or no piece), returning to slot');
      dragging.set({ piece: null, slotIndex: null, x: 0, y: 0 });
      return;
    }

    const rect = board.getBoundingClientRect();
    placementManager.trigger({
      type: 'start',
      piece: $dragging.piece,
      event,
      boardRect: rect,
      slotIndex: $dragging.slotIndex
    });
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