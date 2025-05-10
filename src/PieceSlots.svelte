<script lang="ts">
  import { slots, dragging } from './lib/stores';
  let startX: number, startY: number;

  function handlePointerDown(event: PointerEvent, piece: any, index: number) {
    event.preventDefault();
    startX = event.clientX;
    startY = event.clientY;
    dragging.set({ piece, slotIndex: index, x: startX, y: startY });

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }

  function handlePointerMove(event: PointerEvent) {
    dragging.update(d => ({
      ...d,
      x: event.clientX,
      y: event.clientY
    }));
  }

  function handlePointerUp() {
    dragging.set({ piece: null, slotIndex: null, x: 0, y: 0 });
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }
</script>

<div class="slots">
  {#each $slots as piece, index (piece.name + index)}
    <div class="slot">
      <div
        class="piece-grid"
        on:pointerdown={e => handlePointerDown(e, piece, index)}
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
    width: calc(min(80vw, 80vh) / 11.11); /* ~90% of board cell size */
    height: calc(min(80vw, 80vh) / 11.11); /* ~90% of board cell size */
  }
  .preview {
    z-index: 1000;
  }
</style>