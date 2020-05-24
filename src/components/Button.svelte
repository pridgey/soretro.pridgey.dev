<script>
  import { Theme } from "./../utilities";
  export let OnClick;
</script>

<style>
  button {
    font-family: "Mukta", sans-serif;
    color: var(--color);
    background-color: transparent;
    border: 1px solid var(--color);
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--color);
    color: var(--white);
  }
</style>

<button
  type="button"
  on:click={OnClick}
  style="--color:{Theme.colors.teal}; --white:{Theme.colors.white}">
  <slot />
</button>
