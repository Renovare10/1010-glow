<script lang="ts">
  import { gameState, dragging, slots, placementManager, pieces } from './lib/stores';
  import PieceSlots from './PieceSlots.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    // Initialize slots with random pieces
    const newSlots = Array(3)
      .fill(null)
      .map(() => pieces[Math.floor(Math.random() * pieces.length)]);
    slots.set(newSlots);
    placementManager.process(gameState, slots);

    const handleDrop = (event: PointerEvent | TouchEvent) => {
      handlePointerUp(event);
    };

    window.addEventListener('pointerup', handleDrop);
    window.addEventListener('touchend', handleDrop);
    return () => {
      window.removeEventListener('pointerup', handleDrop);
      window.removeEventListener('touchend', handleDrop);
    };
  });

  function handlePointerUp(event: PointerEvent | TouchEvent) {
    const board = document.querySelector('.grid');
    if (!board || !$dragging.piece) {
      dragging.set({ piece: null, slotIndex: null, x: 0, y: 0 });
      return;
    }

    const rect = board.getBoundingClientRect();
    const clientX = 'touches' in event ? event.changedTouches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.changedTouches[0].clientY : event.clientY;

    const isOnBoard = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;

    if (!isOnBoard) {
      dragging.set({ piece: null, slotIndex: null, x: 0, y: 0 });
      return;
    }

    event.preventDefault();

    const pointerEvent = { clientX, clientY, isPrimary: true, pointerId: 1, pointerType: 'touch' } as PointerEvent;

    placementManager.trigger({
      type: 'start',
      piece: $dragging.piece,
      event: pointerEvent,
      boardRect: rect,
      slotIndex: $dragging.slotIndex
    });
    dragging.set({ piece: null, slotIndex: null, x: 0, y: 0 }); // Reset after trigger
  }
</script>

<div class="board">
  <div class="grid">
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
    max-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    overflow: auto;
  }
  .grid {
    display: grid;
    grid-template: repeat(10, 1fr) / repeat(10, 1fr);
    width: min(74vw, 74vh);
    max-width: 600px;
    height: min(74vw, 74vh);
    max-height: 600px;
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