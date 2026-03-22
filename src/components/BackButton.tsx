import styles from "./BackButton.module.css";

type Props = {
  href: string;
};

const Button: React.FC<Props> = ({ href }) => {
  return (
    <a href={href} className={styles["return-link"]} aria-label="Back">
      <span aria-hidden="true">&larr;</span>
    </a>
  );
};

export default Button;
