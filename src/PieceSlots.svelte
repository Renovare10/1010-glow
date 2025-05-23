<script lang="ts">
  import { slots, dragging } from './lib/game/stores';
  import { colorMap } from './lib/pieces/colors';
  import type { Piece } from './lib/pieces/pieces';
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

  function handleEnd() {
    window.removeEventListener('pointermove', handleMove);
    window.removeEventListener('touchmove', handleMove);
    dragging.set({ piece: null, slotIndex: null, x: 0, y: 0 });
  }
</script>

<div class="slots">
  {#each $slots as piece, index (`${index}-${piece ? piece.name : 'empty'}`)}
    <div class="slot">
      {#if piece && ($dragging.slotIndex !== index || !$dragging.piece)}
        <div
          class="piece-grid"
          on:pointerdown|preventDefault|stopPropagation={e => handleStart(e, piece, index)}
          on:touchstart|passive={e => handleStart(e, piece, index)}
          on:pointerup={handleEnd}
          on:touchend={handleEnd}
          style="grid-template-columns: repeat({piece.shape[0]?.length || 1}, 1fr); grid-template-rows: repeat({piece.shape.length}, 1fr);"
        >
          {#each piece.shape as row, i}
            {#each row as cell, j}
              {#if cell}
                <div
                  class="piece-cell"
                  style="grid-row: {i + 1}; grid-column: {j + 1}; background: {colorMap[piece.name]};"
                ></div>
              {/if}
            {/each}
          {/each}
        </div>
      {/if}
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
      top: {$dragging.y - 75}px; /* Match offset in placement.ts */
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
            style="grid-row: {i + 1}; grid-column: {j + 1}; background: {colorMap[$dragging.piece.name]};"
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
    gap: 8vw;
    margin-top: 10px;
    height: calc((min(74vw, 74vh) / 20) * 5 + 0.4vw);
  }
  .slot {
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc((min(74vw, 74vh) / 20) * 5);
    height: calc((min(74vw, 74vh) / 20) * 5);
  }
  .piece-grid {
    display: grid;
    gap: 2px;
    cursor: grab;
    touch-action: none;
  }
  .piece-grid:active {
    cursor: grabbing;
  }
  .piece-cell {
    width: calc(min(74vw, 74vh) / 20);
    height: calc(min(74vw, 74vh) / 20);
    box-sizing: border-box;
  }
  .piece-grid:focus,
  .piece-grid:active {
    outline: none;
  }
  .preview .piece-cell {
    width: calc(min(74vw, 74vh) / 10 * 0.99);
    height: calc(min(74vw, 74vh) / 10 * 0.99);
  }
  .preview {
    z-index: 1000;
  }
</style>