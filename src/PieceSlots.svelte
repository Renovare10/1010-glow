<script lang="ts">
  import { slots, dragging } from './lib/stores';
  import type { Piece } from './lib/stores';
  let startX: number, startY: number;

  function handleStart(event: PointerEvent | TouchEvent, piece: Piece, index: number) {
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    startX = clientX;
    startY = clientY;
    dragging.set({ piece, slotIndex: index, x: startX, y: startY });

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
  }

  function handleMove(event: PointerEvent | TouchEvent) {
    event.preventDefault();
    event.stopPropagation();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    dragging.update(d => ({
      ...d,
      x: clientX,
      y: clientY
    }));
  }
</script>

<div class="slots">
  {#each $slots as piece, index (piece.name + index)}
    <div class="slot">
      <div
        class="piece-grid"
        on:pointerdown|preventDefault|stopPropagation={e => handleStart(e, piece, index)}
        on:touchstart|passive={e => handleStart(e, piece, index)}
        style="grid-template-columns: repeat({piece.shape[0]?.length || 1}, 1fr); grid-template-rows: repeat({piece.shape.length}, 1fr);"
      >
        {#each piece.shape as row, i}
          {#each row as cell, j}
            {#if cell}
              <div
                class="piece-cell"
                style="grid-row: {i + 1}; grid-column: {j + 1};"
              ></div>
            {/if}
          {/each}
        {/each}
      </div>
    </div>
  {/each}
</div>

{#if $dragging.piece}
  <div
    class="piece-grid preview"
    style="
      grid-template-columns: repeat({$dragging.piece.shape[0]?.length || 1}, 1fr);
      grid-template-rows: repeat({$dragging.piece.shape.length}, 1fr);
      position: absolute;
      left: {$dragging.x}px;
      top: {$dragging.y}px;
      transform: translate(-50%, -50%);
      pointer-events: none;
      opacity: 0.8;
    "
  >
    {#each $dragging.piece.shape as row, i}
      {#each row as cell, j}
        {#if cell}
          <div
            class="piece-cell"
            style="grid-row: {i + 1}; grid-column: {j + 1};"
          ></div>
        {/if}
      {/each}
    {/each}
  </div>
{/if}

<style>
  .slots {
    display: flex;
    justify-content: center;
    gap: 10vw;
    margin-top: 20px;
  }
  .slot {
    border-radius: 4px;
  }
  .piece-grid {
    display: grid;
    gap: 0.4vw;
    cursor: grab;
    touch-action: none;
  }
  .piece-grid:active {
    cursor: grabbing;
  }
  .piece-cell {
    width: calc(min(90vw, 90vh) / 20);
    height: calc(min(90vw, 90vh) / 20);
    background: #007acc;
    box-sizing: border-box;
  }
  .piece-grid:focus,
  .piece-grid:active {
    outline: none;
  }
  .preview .piece-cell {
    width: calc(min(80vw, 80vh) / 11.11);
    height: calc(min(80vw, 80vh) / 11.11);
  }
  .preview {
    z-index: 1000;
  }
</style>