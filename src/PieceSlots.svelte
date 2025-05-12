
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
        <!-- Wrap piece in a 5x5 grid for larger grabbable area -->
        <div
          class="piece-container"
          on:pointerdown|preventDefault|stopPropagation={e => handleStart(e, piece, index)}
          on:touchstart|passive={e => handleStart(e, piece, index)}
          on:pointerup={handleEnd}
          on:touchend={handleEnd}
        >
          <div
            class="piece-grid"
            style="
              grid-template-columns: repeat({piece.shape[0]?.length || 1}, 1fr);
              grid-template-rows: repeat({piece.shape.length}, 1fr);
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            "
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
      top: {$dragging.y - 75}px;
      transform: translate(-50%, -50%);
      pointer-events: none;
      opacity: 1;
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
  gap: calc(min(calc(min(74vw, 74vh) / 10), 60px) * 2); /* 2 cell sizes for spacing */
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
  .piece-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    width: calc(min(74vw, 74vh) / 20 * 5); /* Full slot size for max grabbable area */
    height: calc(min(74vw, 74vh) / 20 * 5);
    position: relative;
    cursor: grab;
    touch-action: none;
  }
  .piece-container:active {
    cursor: grabbing;
  }
  .piece-grid {
    display: grid;
    gap: 2px;
  }
  .piece-cell {
  width: min(calc(min(74vw, 74vh) / 11), 60px);
  height: min(calc(min(74vw, 74vh) / 11), 60px);
    box-sizing: border-box;
  }
  .piece-container:focus,
  .piece-container:active {
    outline: none;
  }
.preview .piece-cell {
  width: min(calc(min(74vw, 74vh) / 10), 60px);
  height: min(calc(min(74vw, 74vh) / 10), 60px);
}
  .preview {
    z-index: 1000;
  }
</style>