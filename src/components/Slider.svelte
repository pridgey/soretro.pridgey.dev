<script>
  import { Theme } from "./../utilities";
  import FlexContainer from "./FlexContainer.svelte";

  // State
  let hoverX = -1000;
  let hue = 176;
  let sliderInnerText = "How positive is this item?";
  let retroItem = {
    itemText: "",
    percentage: 0
  };
  let focused = false;
  let inputPlaceholder = "";

  export let OnSubmit;

  function resetComponent() {
    // reset stuff
    hoverX = -1000;
    sliderInnerText = "How positive is this item?";
    hue = 176;
  }

  function handleMouseOver(event) {
    if (!focused) {
      const width = event.target.getBoundingClientRect().width;

      const percentage = event.offsetX / width;

      // Set retroitem Percentage
      retroItem.percentage = percentage;

      // Calculate highlightColor
      const maxColor = 100;
      hue = maxColor - maxColor * percentage;

      // Set hoverX state
      hoverX = event.offsetX;

      let lowerThreshold = 0.25;
      let upperThreshold = 0.75;

      // Calculate innertext
      if (percentage <= lowerThreshold) {
        sliderInnerText = "That good eh?";
      } else if (percentage > lowerThreshold && percentage < upperThreshold) {
        sliderInnerText = "Not too good. Not too bad.";
      } else {
        sliderInnerText = "Woah. Bummer.";
      }
    }
  }

  function handleMouseOut(event) {
    if (!focused) {
      resetComponent();
    }
  }

  function handleInput(event) {
    if (focused) {
      retroItem.itemText = event.target.value;
    }
  }

  function handleFocus() {
    focused = true;
    inputPlaceholder = "Enter Retro Item and hit enter";
    sliderInnerText = retroItem.itemText;
  }

  function handleBlur() {
    focused = false;
    resetComponent();
    retroItem = {
      itemText: "",
      percentage: 0
    };
  }

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      // enter!
      const itemToSubmit = retroItem;
      OnSubmit(itemToSubmit);
      resetComponent();
      focused = false;
      document.getElementById("range").blur();
    }
  }
</script>

<style>
  #container {
    width: 100%;
    height: 7vw;
  }

  #range {
    position: relative;
    width: 90%;
    height: 7vw;
    background-color: var(--bg);
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2vw;
    font-family: "Mukta", sans-serif;
    border: 0;
    text-align: center;
    color: var(--color);
  }

  #range::placeholder {
    color: var(--color);
    opacity: 0.6;
  }

  #range::after {
    content: "";
    position: absolute;
    left: var(--x);
    top: 50%;
    width: 400px;
    height: 400px;
    background: radial-gradient(
      circle closest-side,
      var(--highlight),
      transparent
    );
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: width 0.2s ease, height 0.2s ease;
  }
</style>

<div id="container" style="--bg:{Theme.colors.black}">
  <FlexContainer>
    <input
      id="range"
      type="text"
      style="--bg:hsla({hue}, 56%, 55%, 1); --x:{hoverX}px; --color:{Theme.colors.white}"
      autocomplete="off"
      on:mousemove={handleMouseOver}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:mouseout={handleMouseOut}
      on:keydown={handleKeyDown}
      on:input={handleInput}
      placeholder={inputPlaceholder}
      value={sliderInnerText} />
  </FlexContainer>
</div>
