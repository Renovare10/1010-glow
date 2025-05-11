<script lang="ts">
  import GameController from './GameController.svelte';
</script>

<div class="board">
  <GameController />
</div>

<style>
  .board {
    text-align: center;
    width: 100%;
    max-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow: auto;
  }
</style>