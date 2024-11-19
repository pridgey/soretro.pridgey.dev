import styles from "./RetroNote.module.css";
import { RetroStickerSVG } from "../SVG";
import { NoteRecord } from "../../types/NoteRecord";
import Pocketbase from "pocketbase";

const ROTATION_MIN = -15;
const ROTATION_MAX = 15;

export type RetroNoteProps = {
  note: NoteRecord;
};

export const RetroNote = (props: RetroNoteProps) => {
  const pb = new Pocketbase(import.meta.env.VITE_POCKETBASE_URL);

  return (
    <div
      class={styles.sticker}
      style={{
        "--position-x": props.note.x + "px",
        "--position-y": props.note.y + "px",
        "--translate": `translate(${
          props.note.horizontal === "left" ? "0%" : "-100%"
        }, ${props.note.vertical === "top" ? "0%" : "-100%"})`,
        "--sticker-rotate": `rotate(${
          Math.random() * (ROTATION_MAX - ROTATION_MIN) + ROTATION_MIN
        }deg)`,
      }}
      tabIndex={-1}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <RetroStickerSVG class={styles.icon} />
      </div>
      <div
        classList={{
          [styles.card]: true,
          [styles.cardBottom]: props.note.vertical === "bottom",
          [styles.cardRight]: props.note.horizontal === "right",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <textarea
          class={styles.textarea}
          onChange={async (e) => {
            await pb
              .collection<NoteRecord>("note")
              .update(props.note.id ?? "-1", {
                ...props.note,
                note: e.currentTarget.value,
              });
          }}
        >
          {props.note.note}
        </textarea>
      </div>
    </div>
  );
};
