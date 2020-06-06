<script>
  import { Theme } from "./../utilities";
  import FlexContainer from "./FlexContainer.svelte";

  // State
  let hoverX = -1000;
  let highlightColor = {
    green: 15,
    red: 15
  };
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
    highlightColor = {
      green: 15,
      red: 15
    };
  }

  function handleMouseOver(event) {
    if (!focused) {
      const width = event.target.getBoundingClientRect().width;

      const percentage = event.offsetX / width;

      // Set retroitem Percentage
      retroItem.percentage = percentage;

      // Calculate highlightColor
      const red = 190 * percentage;
      const green = 190 - 190 * percentage;

      highlightColor = {
        green,
        red
      };

      // Set hoverX state
      hoverX = event.offsetX;

      // Calculate innertext
      if (percentage <= 0.3) {
        sliderInnerText = "That good eh?";
      } else if (percentage > 0.3 && percentage < 0.7) {
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
      style="--bg:rgb({highlightColor.red}, {highlightColor.green}, 0); --x:{hoverX}px;
      --color:{Theme.colors.white}"
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
