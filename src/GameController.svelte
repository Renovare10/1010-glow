<script lang="ts">
  import { gameState, dragging, slots, placementManager } from './lib/game/stores';
  import { pieces } from './lib/pieces/pieces';
  import PieceSlots from './PieceSlots.svelte';
  import Grid from './Grid.svelte';
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

<div class="controller">
  <Grid />
  <PieceSlots />
</div>

<style>
  .controller {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
  }
</style>