import styles from "./BackButtom.module.css";

type Props = {} & JSX.IntrinsicElements["a"];

const Button: React.FC<Props> = ({ href }) => {
  return (
    <a href={href} className={styles["return-link"]}>
      <span>&larr;</span>
    </a>
  );
};

export default Button;
