import Image from "next/image";
import styles from "./page.module.css";
import Card from "@/components/Card";

export default function Home() {
  return (
    <main className={styles["main"]}>
      <h1 className={styles["h1"]}>
        Welcome to <span className={styles["text-gradient"]}>WASM PNA</span>
      </h1>
      <p className={styles["instructions"]}>
        Try <code>WASM PNA</code> which works entirely in your browser, without
        uploading files online.
        <br />
        <strong>Challenge:</strong> &quot;Create&quot; PNA in your browser.
      </p>
      <ul role="list" className={styles["link-card-grid"]}>
        <Card
          href="./create/"
          title="Create"
          body="Create PNA in your browser."
        />
        <Card
          href="./extract/"
          title="Extract"
          body="Extract entry from PNA in your browser."
        />
        <Card
          href="https://portable-network-archive.github.io/Portable-Network-Archive-Specification/"
          title="Specification"
          body="Learn about PNA's design philosophy and data structure."
        />
        <Card
          href="https://docs.rs/libpna/"
          title="Documentation"
          body="Learn how use libpna and explore the official API docs."
        />
        <Card
          href="https://github.com/Portable-Network-Archive/wasm-demo"
          title="GitHub"
          body="View source code of this demo site."
        />
        <Card
          href="https://github.com/Portable-Network-Archive/"
          title="Organization"
          body="Explore repository of our organization."
        />
      </ul>
    </main>
  );
}
