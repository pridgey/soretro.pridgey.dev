import { createEffect, createSignal, For, type Component } from "solid-js";
import styles from "./App.module.css";
import { AnalogButton } from "./components/AnalogButton";
import { ScreenAxis } from "./components/ScreenAxis";
import { BsMusicNoteBeamed } from "solid-icons/bs";
import { RetroNote } from "./components/RetroNote";

const App: Component = () => {
  const [screenCursor, setScreenCursor] = createSignal({ x: 0, y: 0 });
  const [notes, updateNotes] = createSignal<any[]>([]);

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
      <div
        class={styles.glass}
        onMouseMove={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const glassRect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - glassRect.left;
          const y = e.clientY - glassRect.top;
          setScreenCursor({ x, y });
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const glassRect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - glassRect.left;
          const y = e.clientY - glassRect.top;
          let vertical = "top";
          let horizontal = "left";
          if (x > glassRect.width / 2) {
            horizontal = "right";
          }
          if (y > glassRect.height / 2) {
            vertical = "bottom";
          }
          updateNotes([...notes(), { x, y, vertical, horizontal }]);
        }}
      >
        <ScreenAxis />
        <div
          class={styles.cursor}
          style={{
            "--cursor-x": `${screenCursor().x}px`,
            "--cursor-y": `${screenCursor().y}px`,
          }}
        ></div>
        <For each={notes()}>
          {(note) => (
            <RetroNote
              Anchor={{
                Vertical: note.vertical,
                Horizontal: note.horizontal,
              }}
              Position={{ x: note.x, y: note.y }}
            />
          )}
        </For>
      </div>
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
