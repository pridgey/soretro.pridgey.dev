<script>
  import { Theme } from "./../utilities";
  import FlexContainer from "./FlexContainer.svelte";

  // State
  let hoverX = -1000;
  let highlightColor = {
    green: 0,
    red: 0
  };

  export let OnClick;

  function handleMouseOver(event) {
    const width = event.target.getBoundingClientRect().width;

    const red = 200 * (event.offsetX / width);
    const green = 200 - 200 * (event.offsetX / width);

    highlightColor = {
      green,
      red
    };

    hoverX = event.offsetX;
  }

  function handleClick(event) {
    OnClick(event);
  }
</script>

<style>
  #container {
    width: 100%;
    height: 20px;
    background-color: var(--bg);
  }

  #range {
    position: relative;
    width: 90%;
    height: 20px;
    background-color: var(--bg);
    overflow: hidden;
    cursor: pointer;
  }

  #range::before {
    content: "";
    position: absolute;
    left: var(--x);
    top: 50%;
    width: 200px;
    height: 200px;
    background: radial-gradient(
      circle closest-side,
      var(--highlight),
      transparent
    );
    transform: translate(-50%, -50%);
    transition: width 0.2s ease, height 0.2s ease;
  }
</style>

<div id="container" style="--bg:{Theme.colors.black}">
  <FlexContainer>
    <div
      id="range"
      style="--bg:{Theme.colors.black}; --x:{hoverX}px; --highlight:rgb({highlightColor.red},
      {highlightColor.green}, 0);"
      on:mousemove={handleMouseOver}
      on:click={handleClick} />
  </FlexContainer>
</div>
