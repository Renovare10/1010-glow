<script lang="ts">
  import GameBoard from './GameBoard.svelte';
</script>

<main>
  <GameBoard />
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Stick to top */
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    background-color: #1e1e1e; /* VS Code dark background */
    overflow: hidden;
  }
</style>