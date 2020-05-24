<script>
  export let width = "100%";
  export let height = "100%";
  export let direction = "row";
  export let alignItems = "center";
  export let justifyContent = "center";
  export let margin = "unset";
  export let padding = "unset";
</script>

<style>
  #flexContainer {
    display: flex;
    flex-direction: var(--direct);
    align-items: var(--align);
    justify-content: var(--justify);
    margin: var(--margin);
    padding: var(--padding);
    width: var(--width);
    height: var(--height);
    box-sizing: border-box;
  }
</style>

<div
  id="flexContainer"
  style="--width:{width}; --height:{height}; --direct:{direction}; --align:{alignItems};
  --justify:{justifyContent}; --margin:{margin}; --padding:{padding};">
  <slot />
</div>
