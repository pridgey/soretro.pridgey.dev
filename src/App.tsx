import { createEffect, createSignal, For, type Component } from "solid-js";
import styles from "./App.module.css";
import { AnalogButton } from "./components/AnalogButton";
import { ScreenAxis } from "./components/ScreenAxis";
import { BsMusicNoteBeamed } from "solid-icons/bs";

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
          let x_left = "unset";
          let x_right = "unset";
          let y_top = "unset";
          let y_bottom = "unset";
          if (x > glassRect.width / 2) {
            x_right = `${glassRect.right - e.clientX}px`;
          } else {
            x_left = `${x}px`;
          }
          if (y > glassRect.height / 2) {
            y_bottom = `${glassRect.bottom - e.clientY}px`;
          } else {
            y_top = `${y}px`;
          }
          console.log("Note", { x_left, x_right, y_top, y_bottom, x, y });
          updateNotes([...notes(), { x_left, x_right, y_top, y_bottom, x, y }]);
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
            <div
              class={styles.note}
              style={{
                "--note-x-left": `${note.x_left}`,
                "--note-x-right": `${note.x_right}`,
                "--note-y-top": `${note.y_top}`,
                "--note-y-bottom": `${note.y_bottom}`,
                "--note-rotation": `${Math.random() * 20 - 10}deg`,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Note Click", note);
              }}
            ></div>
          )}
        </For>
      </div>
      <div class={styles.buttonBar}>
        <AnalogButton
          IndicatorLight={musicPlay()}
          OnClick={() => setMusicPlay(!musicPlay())}
        >
          <BsMusicNoteBeamed />{" "}
        </AnalogButton>
      </div>
    </div>
  );
};

export default App;
