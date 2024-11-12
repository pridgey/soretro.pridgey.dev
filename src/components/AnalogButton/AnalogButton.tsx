import type { JSX } from "solid-js";
import style from "./AnalogButton.module.css";

export type AnalogButtonProps = {
  children: JSX.Element;
};

export const AnalogButton = (props: AnalogButtonProps) => {
  return (
    <button class={style.analogButton} role="button">
      <div class={style.analogButton__content}>
        <span
          classList={{
            [style.analogButton__text]: true,
            [style.text]: true,
          }}
        >
          {props.children}
        </span>
      </div>
    </button>
  );
};
