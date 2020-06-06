<script>
  import { Theme } from "./../utilities";

  export let text;
  export let percent;
  export let width;

  console.log(width);

  let highlightColor = `rgb(${190 * percent || 0}, ${190 - 190 * percent ||
    0}, 0)`;

  let left = `${width * percent}px`;

  // determine overlapping cards and move them down the top
  // determine cards overflowing the right and move them in
</script>

<style>
  #card {
    position: absolute;
    left: var(--left);
    border: 2px solid var(--border);
    border-left: 10px solid var(--border);
    background-color: var(--bg);
    border-radius: 8px;
    padding: 15px;
    width: 300px;
    margin: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  #text {
    font-size: 1.4vw;
    font-family: "Mukta", sans-serif;
    color: var(--color);
  }
</style>

<div
  id="card"
  style="--border:{highlightColor};--left:{left};--bg:{Theme.colors.white}">
  <span id="text" style="--color:{Theme.colors.black}">{text}</span>
</div>
