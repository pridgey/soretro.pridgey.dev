<script>
  import { Theme } from "./../utilities";
  import { onMount, afterUpdate } from "svelte";

  // Exports
  export let text;
  export let percent;
  export let OnDelete;

  // State
  const maxColor = 100; // The max color hue we can have
  let hue = maxColor - maxColor * percent; // Determine the hue based on the percentage up the bar
  let highlightColor = `hsla(${hue}, 56%, 55%, 1)`; // Use the hue to create a color state
  let currentCard; // Represents this current card
  // let cardText = `${text.substring(0, 1).toUpperCase()}${text.substring(1)}`;

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
      // Build an array of all card elements on screen
      // and their top left, top right, bottom left, and bottom right values
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

      // Setup a function to check given x and y against the array of cards coordinates
      // and see if the x and y fall between them
      const checkCoordinate = (x, y) => {
        return cardsArray.some(card => {
          return x >= card.x1 && x <= card.x2 && y >= card.y1 && y <= card.y2;
        });
      };

      // Setup top left, top middle, top right, middle left, middle, middle right, bottom left, bottom middle, and bottom right of the current card
      let left = containerRect.left + cardLeft;
      let leftmid = containerRect.left + cardLeft + currentCardRect.width / 2;
      let right = containerRect.left + cardLeft + currentCardRect.width;
      let top = containerRect.top + cardTop;
      let topmid = containerRect.top + cardTop + currentCardRect.height / 2;
      let bottom = containerRect.top + cardTop + currentCardRect.height;

      // Check all of those coordinates against the array of cards
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
    // keep pushing the current card down until we no longer overlap
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
    align-items: flex-start;
    justify-content: space-between;
  }

  .text {
    font-size: 1.2vw;
    font-family: "Mukta", sans-serif;
    color: #292f36;
    word-break: break-word;
  }

  .delete {
    font-size: 1.2vw;
    color: #292f36;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    margin: 0;
  }

  .delete:hover {
    color: #ff6b6b;
  }
</style>

<div
  class="card"
  bind:this={currentCard}
  style="--border:{highlightColor};--bg:{Theme.colors.white}">
  <span class="text" style="--color:{Theme.colors.black}">{text}</span>
  <!-- <button class="delete" type="button" on:click={OnDelete}>
    <svg
      stroke="currentColor"
      fill="none"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg">
      <polyline points="3 6 5 6 21 6" />
      <path
        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0
        0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  </button> -->
</div>
