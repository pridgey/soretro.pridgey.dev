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
</style>

<div id="container" style="--border:{Theme.colors.black}">
  <FlexContainer justifyContent="flex-start">
    {#each columnArray as column}
      <FlexContainer direction="column" justifyContent="flex-start">
        {#each RetroItems.filter(item => item.scale > (100 / Columns) * column && item.scale < (100 / Columns) * column + 100 / Columns) as item}
          <div>{item.text}</div>
        {/each}
      </FlexContainer>
    {/each}
  </FlexContainer>
</div>
