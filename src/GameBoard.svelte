<script lang="ts">
  import GameController from './GameController.svelte';
  import { score } from './lib/game/stores';
</script>

<div class="board">
  <div class="score">{$score}</div>
  <GameController />
</div>

<style>
  .board {
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-rows: 1fr 8fr 2fr; /* Score: 1fr, Board: 8fr, Slots: 2fr */
    gap: var(--scale-unit); /* Scaled spacing */
    background-color: #1e1e1e;
    overflow: hidden;
    box-sizing: border-box;
  }

  .score {
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.87);
    font-size: calc(var(--scale-unit) * 1.5); /* Proportional to board cells */
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  }
</style>