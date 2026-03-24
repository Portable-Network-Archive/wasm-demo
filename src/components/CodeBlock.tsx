"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./CodeBlock.module.css";

type Props = {
  label: string;
  children: string;
};

const CodeBlock: React.FC<Props> = ({ label, children }) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable or permission denied
    }
  }

  return (
    <div className={styles["code-block"]}>
      <div className={styles["code-header"]}>
        <p className={styles["code-label"]}>{label}</p>
        <button
          className={styles["copy-button"]}
          onClick={handleCopy}
          aria-label={`Copy ${label} code`}
        >
          <span aria-live="polite">{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
