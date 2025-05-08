<script lang="ts">
  import { gameState } from './lib/stores';
</script>

<div class="board">
  <div class="grid">
    {#each $gameState as row, i}
      {#each row as cell, j}
        <div class="cell" class:occupied={cell}></div>
      {/each}
    {/each}
  </div>
</div>

<style>
  .board {
    text-align: center;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin: 10px 0 0 0; /* Small top margin */
  }
  .grid {
    display: grid;
    grid-template: repeat(10, 1fr) / repeat(10, 1fr);
    width: min(90vw, 90vh); /* Scale with screen size */
    max-width: 700px; /* Cap for large screens */
    aspect-ratio: 1;
    gap: 2px;
    background: #252526; /* VS Code sidebar dark */
    margin: 0;
  }
  .cell {
    background: #3c3c3c; /* VS Code editor dark */
    border: 1px solid #444;
  }
  .occupied {
    background: #007acc; /* VS Code blue accent */
  }
</style>