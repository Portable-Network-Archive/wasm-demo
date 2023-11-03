import styles from "./DropArea.module.css";

type Props = {} & JSX.IntrinsicElements["div"];

const DropArea: React.FC<Props> = ({ ...props }) => {
  return <div className={styles["drop-area"]} {...props} />;
};

export default DropArea;
