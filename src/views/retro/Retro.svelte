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

  // State
  let inviteButtonText = "Invite To Session";
  let input = {
    x: -1000,
    y: -1000,
    show: false
  };
  let currentRetroItem = "";
  let retroItems = [];

  // Websocket
  let socket = "";

  // Get the session if it exists, create it if it doesn't
  let sessionId = FindParamByKey("si");
  if (!sessionId) {
    // Generate a Session
    window.location.search = `?si=${CreateID()}`;
  } else {
    // Have a session
    socket = new WebSocket(process.env.SOCKET_URL);

    // On connect, ask for any existing items
    socket.addEventListener("open", event => {
      const data = {
        id: sessionId,
        payload: "",
        request: "initial"
      };
      socket.send(JSON.stringify(data));
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
  }

  const updateSession = () => {
    if (socket) {
      const data = {
        id: sessionId,
        payload: retroItems
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
  }

  #inputPlacement {
    position: absolute;
    left: var(--x);
    top: var(--y);
    display: var(--show);
  }
</style>

<main style="--bgColor:{Theme.colors.white}">
  <FlexContainer width="100%" direction="column" justifyContent="flex-start">
    <FlexContainer
      width="100%"
      alignItems="flex-start"
      justifyContent="space-between"
      height="70px"
      padding="15px 40px">
      <h1 style="--color:{Theme.colors.black}">So Retro</h1>
      <Button OnClick={handleInviteClick}>{inviteButtonText}</Button>
    </FlexContainer>
    <h2 style="--color:{Theme.colors.black}">
      Click along the range to add a retro item
    </h2>
    <Slider
      OnClick={event => {
        const top = event.target.getBoundingClientRect().top + event.target.getBoundingClientRect().height + 15;
        input = { x: event.offsetX + 50, y: top, show: true };
      }} />
    <div
      id="inputPlacement"
      style="--x:{input.x}px; --y:{input.y}px; --show:{input.show ? 'block' : 'none'}">
      <Input
        Placeholder="Enter Retro Item"
        OnChange={event => {
          currentRetroItem = event.target.value;
        }}
        OnEnter={() => {
          retroItems = [...retroItems, { text: currentRetroItem, scale: (input.x / window.innerWidth) * 100 }];
          currentRetroItem = '';
          input = { ...input, show: false };
          updateSession();
        }} />
    </div>
    <RetroCards Columns={6} RetroItems={retroItems} />
  </FlexContainer>
</main>
