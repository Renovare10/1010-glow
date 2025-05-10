<script lang="ts">
  import { gameState, refillSlots } from './lib/stores';
  import PieceSlots from './PieceSlots.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    refillSlots();
    return () => {};
  });
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
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column; /* Stack grid and slots vertically */
    gap: 20px; /* Space between board and slots */
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