<script>
  import { Theme } from "./../utilities";

  export let InitialValue;
  export let Placeholder;
  export let OnChange;
  export let OnEnter;
</script>

<style>
  input {
    font-size: 16px;
    padding: 6px 10px;
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid var(--border);
    font-family: "Mukta", sans-serif;
    color: var(--color);
  }
</style>

<input
  type="text"
  placeholder={Placeholder}
  defaultValue={InitialValue}
  on:input={OnChange}
  on:keydown={event => {
    if (event.keyCode === 13) {
      OnEnter();
      event.target.value = '';
    }
  }}
  style="--border:{Theme.colors.black}; --color:{Theme.colors.black}" />
