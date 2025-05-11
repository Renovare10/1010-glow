<script lang="ts">
  import { gameState } from './lib/game/stores';
  import { colorMap } from './lib/pieces/colors';
</script>

<div class="grid">
  {#each $gameState as row, i}
    {#each row as cell, j}
      <div class="cell" class:occupied={cell} style={cell ? `background: ${colorMap[cell]};` : ''}></div>
    {/each}
  {/each}
</div>

<style>
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
</style>