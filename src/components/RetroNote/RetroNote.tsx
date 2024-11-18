import { RiCommunicationChat1Fill } from "solid-icons/ri";
import { RiDesignEditCircleLine } from "solid-icons/ri";
import styles from "./RetroNote.module.css";
import { RetroStickerSVG, SideIndicatorSVG } from "../SVG";
import { createSignal, Show } from "solid-js";

const ROTATION_MIN = -15;
const ROTATION_MAX = 15;

export type RetroNoteProps = {
  Anchor: { Vertical: "top" | "bottom"; Horizontal: "left" | "right" };
  Position: { x: number; y: number };
};

export const RetroNote = (props: RetroNoteProps) => {
  const [showCard, setShowCard] = createSignal(false);

  return (
    <div
      class={styles.sticker}
      onBlur={() => setShowCard(false)}
      style={{
        "--position-x": props.Position.x + "px",
        "--position-y": props.Position.y + "px",
        "--translate": `translate(${
          props.Anchor.Horizontal === "left" ? "0%" : "-100%"
        }, ${props.Anchor.Vertical === "top" ? "0%" : "-100%"})`,
        "--sticker-rotate": `rotate(${
          Math.random() * (ROTATION_MAX - ROTATION_MIN) + ROTATION_MIN
        }deg)`,
      }}
      tabIndex={-1}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setShowCard(!showCard());
        }}
      >
        <RetroStickerSVG class={styles.icon} />
      </div>
      <Show when={showCard()}>
        <div
          classList={{
            [styles.card]: true,
            [styles.cardBottom]: props.Anchor.Vertical === "bottom",
            [styles.cardRight]: props.Anchor.Horizontal === "right",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div contentEditable={true}>Testing</div>
        </div>
      </Show>
    </div>
  );
};
