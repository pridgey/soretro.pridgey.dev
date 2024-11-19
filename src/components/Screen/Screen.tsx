import { createSignal, For, onCleanup, onMount } from "solid-js";
import { ScreenAxis } from "../ScreenAxis";
import styles from "./Screen.module.css";
import { NoteRecord } from "../../types/NoteRecord";
import { RetroNote } from "../RetroNote";
import Pocketbase from "pocketbase";
import { createAndSaveUserId } from "../../utilities";

type ScreenProps = {
  session: string;
};

/**
 * UI Component that renders a "retro" style screen and displays the UI notes
 */
export const Screen = (props: ScreenProps) => {
  // Holds data about the current retro notes
  const [notes, updateNotes] = createSignal<NoteRecord[]>([]);
  // Displays the UI cursor
  const [screenCursor, setScreenCursor] = createSignal({ x: 0, y: 0 });
  // Grab user-id from local storage, if it doesn't exist, create one
  const [userId] = createSignal(
    localStorage.getItem("userId") ?? createAndSaveUserId()
  );

  const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

  onMount(async () => {
    console.log("Mount", props.session);
    // Get any current notes for the session
    const allNotes = await pb.collection<NoteRecord>("note").getFullList({
      filter: `session = "${props.session}"`,
    });

    // Set state
    updateNotes(allNotes);

    // Listen for any further notes
    pb.collection<NoteRecord>("note").subscribe("*", (data) => {
      if (
        data.record.session === props.session &&
        data.record.user !== userId()
      ) {
        switch (data.action) {
          case "create":
          default:
            updateNotes([...notes(), data.record]);
            break;
          case "update":
            updateNotes(
              notes().map((note) =>
                note.id === data.record.id ? data.record : note
              )
            );
            break;
          case "delete":
            updateNotes(notes().filter((note) => note.id !== data.record.id));
            break;
        }
      }
    });
  });

  onCleanup(async () => {
    await pb.collection("note").unsubscribe("*");
  });

  return (
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
        // Prevent further events
        e.preventDefault();
        e.stopPropagation();
        // Get size of UI screen
        const glassRect = e.currentTarget.getBoundingClientRect();

        // Get x and y via the rect as it seems to be more effective than the event's clientX/Y
        const x = e.clientX - glassRect.left;
        const y = e.clientY - glassRect.top;

        // Default vertical and horizontal
        let vertical: NoteRecord["vertical"] = "top" as "top";
        let horizontal: NoteRecord["horizontal"] = "left" as "left";

        // If over half of the screen, shift things to the right side
        if (x > glassRect.width / 2) {
          horizontal = "right" as "right";
        }
        // If over half the height of the screen, shift things to the bottom
        if (y > glassRect.height / 2) {
          vertical = "bottom" as "bottom";
        }

        // Construct note record
        const newNote: NoteRecord = {
          horizontal,
          note: "",
          session: props.session,
          user: userId(),
          vertical,
          x,
          y,
        };

        // Add the note to the db
        const createdNote = await pb
          .collection<NoteRecord>("note")
          .create(newNote);

        // Update state with the new note after creation to include id
        updateNotes([...notes(), createdNote]);
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
      <For each={notes()}>{(note) => <RetroNote note={note} />}</For>
    </div>
  );
};
