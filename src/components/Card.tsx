import React from "react";
import styles from "./Card.module.css";

type Props = {
  href: string;
  title: string;
  body: string;
  download?: string;
  rightIcon?: string | React.ReactElement;
};

const Card: React.FC<Props> = ({ body, href, title, download, rightIcon }) => {
  return (
    <li className={styles["link-card"]}>
      <a href={href} download={download}>
        <h2 className={styles["h2"]}>
          {title}
          {rightIcon || <span>&rarr;</span>}
        </h2>
        <p className={styles["p"]}>{body}</p>
      </a>
    </li>
  );
};

export default Card;
