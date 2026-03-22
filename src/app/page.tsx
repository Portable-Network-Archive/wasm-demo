import styles from "./page.module.css";
import Card from "@/components/Card";

export default function Home() {
  return (
    <main className={styles["main"]}>
      <h1 className={styles["h1"]}>
        Welcome to <span className={styles["text-gradient"]}>WASM PNA</span>
      </h1>
      <section className={styles["about"]}>
        <h2>What is PNA?</h2>
        <p>
          <strong>Portable Network Archive (PNA)</strong> is an extensible file
          format for the lossless, portable, well-compressed archive of files.
          Inspired by the PNG data structure, PNA provides:
        </p>
        <ul>
          <li>
            <strong>Compression</strong> — Deflate, ZStandard, LZMA
          </li>
          <li>
            <strong>Encryption</strong> — AES, Camellia with CBC/CTR modes
          </li>
          <li>
            <strong>Integrity</strong> — Chunk-based structure with CRC
            validation
          </li>
          <li>
            <strong>Splitting</strong> — Multi-part archive support
          </li>
        </ul>
        <p>
          This demo runs entirely in your browser via WebAssembly — no files are
          uploaded to any server.
        </p>
      </section>
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
