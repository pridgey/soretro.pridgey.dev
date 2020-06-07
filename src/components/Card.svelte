<script>
  import { Theme } from "./../utilities";
  import { onMount, afterUpdate } from "svelte";

  // Exports
  export let text;
  export let percent;

  // State
  const maxColor = 100; // The max color hue we can have
  let hue = maxColor - maxColor * percent; // Determine the hue based on the percentage up the bar
  let highlightColor = `hsla(${hue}, 56%, 55%, 1)`; // Use the hue to create a color state
  let currentCard; // Represents this current card

  // Component mount
  onMount(() => {
    // determine our top and left as relative to the container
    let cardLeft = 0;
    let cardTop = 0;

    // grab the container and currentCard
    let currentCardRect = currentCard.getBoundingClientRect();
    let containerRect = document
      .getElementById("cardcontainer")
      .getBoundingClientRect();

    // set the left based on the percentage across the slider
    cardLeft = containerRect.width * percent;

    // determine if the card overflows the right side
    if (cardLeft + currentCardRect.width > containerRect.width) {
      // Looks like we overflow, so put it as right as we'll allow
      cardLeft = containerRect.width - currentCardRect.width;
    }

    const determineOverlap = () => {
      let cardsArray = Array.from(document.getElementsByClassName("card"))
        .filter(card => card !== currentCard)
        .map(card => {
          let cardRect = card.getBoundingClientRect();
          return {
            x1: cardRect.left,
            x2: cardRect.left + cardRect.width,
            y1: cardRect.top,
            y2: cardRect.top + cardRect.height
          };
        });

      console.log("array", cardsArray);
      console.log("-----------------");
      console.log("");

      const checkCoordinate = (x, y) => {
        return cardsArray.some(card => {
          console.log("checkCoordinate", card);
          console.log(`x: ${x} | ${card.x1}-${card.x2}`);
          console.log(`y: ${y} | ${card.y1}-${card.y2}`);
          console.log("------------------------------");
          console.log("");
          return x >= card.x1 && x <= card.x2 && y >= card.y1 && y <= card.y2;
        });
      };

      let left = containerRect.left + cardLeft;
      let leftmid = containerRect.left + cardLeft + currentCardRect.width / 2;
      let right = containerRect.left + cardLeft + currentCardRect.width;
      let top = containerRect.top + cardTop;
      let topmid = containerRect.top + cardTop + currentCardRect.height / 2;
      let bottom = containerRect.top + cardTop + currentCardRect.height;

      return (
        checkCoordinate(left, top) ||
        checkCoordinate(leftmid, top) ||
        checkCoordinate(right, top) ||
        checkCoordinate(left, topmid) ||
        checkCoordinate(leftmid, topmid) ||
        checkCoordinate(right, topmid) ||
        checkCoordinate(left, bottom) ||
        checkCoordinate(leftmid, bottom) ||
        checkCoordinate(right, bottom)
      );
    };

    // look for any cards that we overlap with
    let cardOverlap = determineOverlap();
    while (cardOverlap) {
      cardTop += 15;
      cardOverlap = determineOverlap();
    }

    // place the card
    currentCard.style.top = `${cardTop}px`;
    currentCard.style.left = `${cardLeft}px`;
  });
</script>

<style>
  .card {
    position: absolute;
    left: 0;
    top: 0;
    border: 2px solid var(--border);
    border-left: 10px solid var(--border);
    background-color: var(--bg);
    border-radius: 8px;
    padding: 15px;
    box-sizing: border-box;
    width: 300px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .text {
    font-size: 1.4vw;
    font-family: "Mukta", sans-serif;
    color: #292f36;
    word-break: break-word;
  }
</style>

<div
  class="card"
  bind:this={currentCard}
  style="--border:{highlightColor};--bg:{Theme.colors.white}">
  <span class="text" style="--color:{Theme.colors.black}">{text}</span>
</div>
