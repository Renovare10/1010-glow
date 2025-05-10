<script lang="ts">
  import { slots } from './lib/stores';
  // Debug: Log piece shapes to verify selection
  $: console.log('Slots:', $slots.map(p => ({ name: p.name, shape: p.shape })));
</script>

<div class="slots">
  {#each $slots as piece}
    <div class="slot">
      <div
        class="piece-grid"
        style="grid-template-columns: repeat({piece.shape[0]?.length || 1}, 1fr); grid-template-rows: repeat({piece.shape.length}, 1fr);"
      >
        {#each piece.shape as row, i}
          {#each row as cell, j}
            {#if cell}
              <div class="piece-cell" style="grid-row: {i + 1}; grid-column: {j + 1};"></div>
            {/if}
          {/each}
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .slots {
    display: flex;
    justify-content: center;
    gap: 10vw; /* Keep your updated value */
    margin-top: 20px;
  }
  .slot {
    border-radius: 4px;
  }
  .piece-grid {
    display: grid;
    gap: 0.4vw; /* Scale gap relative to viewport, smaller for tighter piece grids */
  }
  .piece-cell {
    width: calc(min(90vw, 90vh) / 20); /* Scale with board, ~1/20th of board size */
    height: calc(min(90vw, 90vh) / 20); /* Match width for square cells */
    background: #007acc;
    box-sizing: border-box;
  }
</style>