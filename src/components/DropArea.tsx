import type { JSX } from "react";
import styles from "./DropArea.module.css";

type Props = {} & JSX.IntrinsicElements["div"];

const DropArea: React.FC<Props> = ({ onKeyDown, onClick, ...props }) => {
  return (
    <div
      {...props}
      className={styles["drop-area"]}
      role="group"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.currentTarget.click();
        }
        onKeyDown?.(e);
      }}
    />
  );
};

export default DropArea;
