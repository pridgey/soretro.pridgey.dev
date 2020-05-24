<script>
  import FlexContainer from "./FlexContainer.svelte";
  import { Theme } from "./../utilities";
  export let RetroItems = [];
  export let Columns = 5;

  let columnArray = Array.from(Array(Columns).keys());
</script>

<style>
  #container {
    margin-top: 60px;
    border-top: 1px solid var(--border);
    width: 100%;
  }

  .card {
    border: 1px solid var(--border);
    margin: 8px;
    padding: 8px 16px;
    box-sizing: border-box;
    border-radius: 6px;
    width: 100%;
    text-align: center;
  }
</style>

<div id="container" style="--border:{Theme.colors.black}">
  <FlexContainer justifyContent="flex-start">
    {#each columnArray as column}
      <FlexContainer
        direction="column"
        justifyContent="flex-start"
        margin="5px">
        {#if RetroItems.length > 0}
          {#each RetroItems.filter(item => item.scale > (100 / Columns) * column && item.scale < (100 / Columns) * column + 100 / Columns) as item}
            <div class="card">
              <FlexContainer alignItems="flex-start">{item.text}</FlexContainer>
            </div>
          {/each}
        {/if}
      </FlexContainer>
    {/each}
  </FlexContainer>
</div>
