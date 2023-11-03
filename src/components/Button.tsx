import styles from "./Button.module.css";

type Props = {
  title: string;
} & JSX.IntrinsicElements["input"];

const Button: React.FC<Props> = ({ title, ...props }) => {
  return (
    <input
      className={styles["button"]}
      type="button"
      value={title}
      {...props}
    />
  );
};

export default Button;
