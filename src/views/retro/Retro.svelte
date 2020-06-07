<script>
  import {
    FindParamByKey,
    Theme,
    CreateID,
    CopyToClipboard
  } from "./../../utilities";
  import FlexContainer from "./../../components/FlexContainer.svelte";
  import Button from "./../../components/Button.svelte";
  import Slider from "./../../components/Slider.svelte";
  import Input from "./../../components/Input.svelte";
  import RetroCards from "./../../components/RetroCards.svelte";
  import Card from "./../../components/Card.svelte";

  // State
  let inviteButtonText = "Invite To Session";
  let currentRetroItem = "";
  let retroItemsArray = [];

  // Websocket
  let socket = "";

  // Get the session if it exists, create it if it doesn't
  let sessionId = FindParamByKey("si");
  if (!sessionId) {
    // Generate a Session
    window.location.search = `?si=${CreateID()}`;
  } else {
    // Have a session
    const socketUrl = process.env.SOCKET_URL || "ws://localhost:5500";
    if (socketUrl) {
      let connectionAttempts = 1;

      const connectToSocket = () => {
        socket = new WebSocket(socketUrl);

        // On connect, ask for any existing items
        socket.addEventListener("open", event => {
          // Reset connectionAttempts
          connectionAttempts = 1;

          // Request any data other clients might have
          const data = {
            id: sessionId,
            payload: "",
            request: "initial"
          };
          socket.send(JSON.stringify(data));
        });

        // On close try reconnecting
        socket.addEventListener("close", event => {
          setTimeout(() => {
            connectToSocket();
          }, 1000 * connectionAttempts);
        });

        // Listen for messages
        socket.addEventListener("message", event => {
          const socketData = JSON.parse(event.data);
          if (socketData.id === sessionId) {
            // This relates to us
            if (socketData.request === "initial" && retroItems.length > 0) {
              // A client joined the session, send them what we have
              updateSession();
            } else {
              // Must be receiving information about our session
              if (socketData.payload !== retroItems) {
                // We have new stuff
                retroItems = socketData.payload;
              }
            }
          }
        });
      };

      // Do it!
      connectToSocket();
    }
  }

  const updateSession = () => {
    if (socket) {
      const data = {
        id: sessionId,
        payload: retroItemsArray
      };
      socket.send(JSON.stringify(data));
    }
  };

  const handleInviteClick = () => {
    CopyToClipboard(window.location.href);
    inviteButtonText = "URL Copied To Clipboard!";
    setTimeout(() => {
      inviteButtonText = "Invite To Session";
    }, 2500);
  };

  function handleSubmit(newRetroItem) {
    retroItemsArray = [...retroItemsArray, newRetroItem];
  }
</script>

<style>
  main {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bgColor);
    background-position: center;
    overflow-y: auto;
  }
  h1 {
    font-size: 40px;
    font-family: "Balsamiq Sans", cursive;
    color: var(--color);
    padding: 0;
    margin: 0;
    user-select: none;
  }
  h2 {
    font-family: "Mukta", sans-serif;
    font-size: 20px;
    color: var(--color);
    text-align: left;
    margin-bottom: 5px;
    width: 90%;
  }

  #cardcontainer {
    position: relative;
    width: 90%;
  }
</style>

<main style="--bgColor:{Theme.colors.white}">
  <FlexContainer
    height="unset"
    width="100%"
    direction="column"
    justifyContent="flex-start">
    <FlexContainer
      width="100%"
      alignItems="flex-start"
      justifyContent="space-between"
      height="70px"
      padding="15px 40px">
      <FlexContainer
        width="205px"
        alignItems="center"
        justifyContent="space-between"
        padding="0px">
        <img src="/favicon.svg" alt="So Retro" height="100%" />
        <h1 style="--color:{Theme.colors.black}">So Retro</h1>
      </FlexContainer>
      <Button OnClick={handleInviteClick}>{inviteButtonText}</Button>
    </FlexContainer>
    <h2 style="--color:{Theme.colors.black}">ADD A RETRO ITEM:</h2>
    <Slider OnSubmit={handleSubmit} />
    <div id="cardcontainer">
      {#each retroItemsArray as item}
        <Card text={item.itemText} percent={item.percentage} />
      {/each}
    </div>
  </FlexContainer>
</main>
