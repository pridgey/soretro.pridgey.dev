import { createEffect, createSignal, onMount, type Component } from "solid-js";
import styles from "./App.module.css";
import { AnalogButton } from "./components/AnalogButton";
import { BsMusicNoteBeamed } from "solid-icons/bs";
import { Screen } from "./components/Screen";
import { CreateID } from "./utilities";

const App: Component = () => {
  const session = new URLSearchParams(window.location.search).get("s");

  onMount(async () => {
    // If there is no session, create one
    if (!session) {
      window.location.search = `?s=${CreateID()}`;
    }
  });

  const [musicPlay, setMusicPlay] = createSignal(false);
  const lobbyMusic = new Audio("gingersweet by massobeats.mp3");
  lobbyMusic.loop = true;

  createEffect(() => {
    if (musicPlay()) {
      lobbyMusic.play();
    } else {
      lobbyMusic.pause();
    }
  });

  return (
    <div class={styles.background}>
      <Screen session={session ?? ""} />
      <div class={styles.buttonBar}>
        <AnalogButton
          IndicatorLight={musicPlay()}
          OnClick={() => {
            setMusicPlay(!musicPlay());
          }}
        >
          <BsMusicNoteBeamed />{" "}
        </AnalogButton>
      </div>
    </div>
  );
};

export default App;
