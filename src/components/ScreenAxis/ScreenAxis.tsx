import styles from "./ScreenAxis.module.css";

export const ScreenAxis = () => {
  return (
    <>
      <div
        classList={{
          [styles.axisLabel]: true,
          [styles.axisTop]: true,
        }}
      >
        <span>Keep Doing</span>
        <span>T</span>
        <span>|</span>
      </div>
      <div
        classList={{
          [styles.axisLabel]: true,
          [styles.axisLeft]: true,
        }}
      >
        <span>Went Bad</span>
        <span>|----</span>
      </div>
      <div
        classList={{
          [styles.axisLabel]: true,
          [styles.axisMiddle]: true,
        }}
      >
        <span>+</span>
      </div>
      <div
        classList={{
          [styles.axisLabel]: true,
          [styles.axisRight]: true,
        }}
      >
        <span>Went Great</span>
        <span>----|</span>
      </div>
      <div
        classList={{
          [styles.axisLabel]: true,
          [styles.axisBottom]: true,
        }}
      >
        <span>Stop Doing</span>
        <span>|</span>
        <span style={{ transform: "rotate(180deg)" }}>T</span>
      </div>
    </>
  );
};
