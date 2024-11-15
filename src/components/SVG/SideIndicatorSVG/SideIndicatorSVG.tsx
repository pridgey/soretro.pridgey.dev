export type SideIndicatorSVGProps = {
  class?: string;
};

export const SideIndicatorSVG = (props: SideIndicatorSVGProps) => {
  return (
    <svg
      class={props.class}
      width="100%"
      height="100%"
      viewBox="0 0 540 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 280C20 136.406 136.406 20 280 20"
        stroke="black"
        stroke-width="40"
        stroke-linecap="round"
      />
    </svg>
  );
};
