import { Show, type JSX } from "solid-js";
import style from "./AnalogButton.module.css";

export type AnalogButtonProps = {
  children: JSX.Element;
  IndicatorLight?: boolean;
  OnClick: () => void;
};

export const AnalogButton = (props: AnalogButtonProps) => {
  const buttonClickSFX = new Audio("button-click.mp3");
  buttonClickSFX.volume = 0.5;

  return (
    <button
      class={style.analogButton}
      onClick={() => {
        buttonClickSFX.play();
        props.OnClick();
      }}
      role="button"
    >
      <div class={style.analogButton__content}>
        <span
          classList={{
            [style.analogButton__text]: true,
            [style.text]: true,
          }}
        >
          {props.children}
          <Show when={props.IndicatorLight !== undefined}>
            <div
              class={style.indicator}
              style={{
                "--indicator-light": props.IndicatorLight
                  ? "rgb(0, 214, 0)"
                  : "black",
                "--indicator-shadow": props.IndicatorLight
                  ? `rgba(0, 214, 0, 0.25) 0px 54px 55px,
    rgba(0, 214, 0, 0.12) 0px -12px 30px, rgba(0, 214, 0, 0.12) 0px 4px 6px,
    rgba(0, 214, 0, 0.17) 0px 12px 13px, rgba(0, 214, 0, 0.09) 0px -3px 5px;`
                  : "unset",
              }}
            ></div>
          </Show>
        </span>
      </div>
    </button>
  );
};
