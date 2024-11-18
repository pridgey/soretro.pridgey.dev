import {
  createEffect,
  createSignal,
  For,
  onMount,
  type Component,
} from "solid-js";
import Pocketbase from "pocketbase";
import styles from "./App.module.css";
import { AnalogButton } from "./components/AnalogButton";
import { ScreenAxis } from "./components/ScreenAxis";
import { BsMusicNoteBeamed } from "solid-icons/bs";
import { RetroNote } from "./components/RetroNote";
import { CreateID } from "./utilities";

const App: Component = () => {
  const session = new URLSearchParams(window.location.search).get("s");

  const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

  const createAndSaveUserId = () => {
    // Generate a random user id
    const userID = Math.random().toString(36).substring(2, 9);
    localStorage.setItem("userId", userID);
    return userID;
  };

  const [screenCursor, setScreenCursor] = createSignal({ x: 0, y: 0 });
  const [notes, updateNotes] = createSignal<any[]>([]);
  // Grab user-id from local storage, if it doesn't exist, create one
  const [userId] = createSignal(
    localStorage.getItem("userId") ?? createAndSaveUserId()
  );

  onMount(async () => {
    // If there is no session, create one
    if (!session) {
      window.location.search = `?s=${CreateID()}`;
    }
    // Get any current notes for the session
    const allNotes = await pb.collection("note").getFullList({
      filter: `session = "${session}"`,
    });
    updateNotes(allNotes);
    // Listen for any further notes
    pb.collection("note").subscribe("*", (data) => {
      if (data.record.session === session && data.record.user !== userId()) {
        switch (data.action) {
          case "create":
          default:
            console.log("Create:", data.record);
            updateNotes([...notes(), data.record]);
            break;
          case "update":
            console.log("Update:", data.record);
            updateNotes(
              notes().map((note) =>
                note.id === data.record.id ? data.record : note
              )
            );
            break;
          case "delete":
            console.log("Delete:", data.record);
            updateNotes(notes().filter((note) => note.id !== data.record.id));
            break;
        }
      }
    });
  });

  createEffect(() => {
    console.log("Notes:", JSON.stringify(notes()));
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
        onClick={async (e) => {
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
          await pb.collection("note").create({
            session: session,
            user: userId(),
            note: "",
            x,
            y,
            vertical,
            horizontal,
          });
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
