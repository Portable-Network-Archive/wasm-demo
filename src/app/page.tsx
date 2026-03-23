import styles from "./page.module.css";
import Card from "@/components/Card";

export default function Home() {
  return (
    <main className={styles["main"]}>
      <img
        src="./favicon.svg"
        alt=""
        width={64}
        height={64}
        className={styles["logo"]}
      />
      <h1 className={styles["h1"]}>
        Welcome to <span className={styles["text-gradient"]}>WASM PNA</span>
      </h1>

      <section className={styles["about"]}>
        <h2>What is PNA?</h2>
        <p>
          <strong>Portable Network Archive (PNA)</strong> is a flexible, secure,
          and cross-platform archive format inspired by the PNG data structure.
          Like PNG, PNA uses a chunk-based structure where each piece of data is
          self-contained with its own type, length, and checksum. This enables
          individual file access without full decompression, robust error
          detection, and natural streaming support.
        </p>
        <ul>
          <li>
            <strong>Compression</strong> — Multiple algorithms (zlib, ZStandard,
            xz) for speed or size optimization
          </li>
          <li>
            <strong>Encryption</strong> — Industry-standard 256-bit AES and
            Camellia to protect sensitive data
          </li>
          <li>
            <strong>Integrity</strong> — Built-in error detection with
            chunk-based CRC validation
          </li>
          <li>
            <strong>Splitting</strong> — Divide large archives into smaller
            parts for easy distribution
          </li>
        </ul>
        <p>
          This demo runs entirely in your browser via WebAssembly — no files are
          uploaded to any server.
        </p>
      </section>

      <section className={styles["why"]}>
        <h2 className={styles["section-title"]}>Why PNA?</h2>
        <div className={styles["feature-grid"]}>
          <div className={styles["feature-card"]}>
            <h3>Portability</h3>
            <p>
              Works seamlessly across Windows, Linux, macOS, and FreeBSD.
              Combines the strengths of TAR and ZIP formats.
            </p>
          </div>
          <div className={styles["feature-card"]}>
            <h3>Compression Flexibility</h3>
            <p>
              Per-file and archive-wide compression options. Access individual
              files without decompressing the entire archive.
            </p>
          </div>
          <div className={styles["feature-card"]}>
            <h3>Native Encryption</h3>
            <p>
              Encryption is built into the format — not an afterthought. 256-bit
              AES and Camellia protect your data by default.
            </p>
          </div>
          <div className={styles["feature-card"]}>
            <h3>Streamability</h3>
            <p>
              Supports serial read/write operations, making it suitable for
              streaming processing — just like TAR.
            </p>
          </div>
          <div className={styles["feature-card"]}>
            <h3>Metadata-Free by Design</h3>
            <p>
              Everything except the entry name and body is optional. Create the
              smallest possible archives with no metadata leakage.
            </p>
          </div>
          <div className={styles["feature-card"]}>
            <h3>Extensible</h3>
            <p>
              Designed for future extensions and private add-ons while
              maintaining backward compatibility with the base format.
            </p>
          </div>
        </div>
      </section>

      <section className={styles["cta"]}>
        <h2 className={styles["section-title"]}>Try it now</h2>
        <ul role="list" className={styles["link-card-grid"]}>
          <Card
            href="./create/"
            title="Create"
            body="Create PNA archive in your browser."
          />
          <Card
            href="./extract/"
            title="Extract"
            body="Extract entries from PNA in your browser."
          />
        </ul>
      </section>

      <section className={styles["get-started"]}>
        <h2 className={styles["section-title"]}>Get Started</h2>
        <div className={styles["code-block"]}>
          <p className={styles["code-label"]}>Install CLI</p>
          <pre>
            <code>cargo install portable-network-archive</code>
          </pre>
        </div>
        <div className={styles["code-block"]}>
          <p className={styles["code-label"]}>Use as Library</p>
          <pre>
            <code>cargo add libpna</code>
          </pre>
        </div>
      </section>

      <section>
        <h2 className={styles["section-title"]}>Resources</h2>
        <ul role="list" className={styles["link-card-grid"]}>
          <Card
            href="https://portable-network-archive.github.io/Portable-Network-Archive-Specification/"
            title="Specification"
            body="Learn about PNA's design philosophy and data structure."
          />
          <Card
            href="https://docs.rs/libpna/"
            title="Documentation"
            body="Explore the official libpna API docs."
          />
          <Card
            href="https://github.com/ChanTsune/Portable-Network-Archive"
            title="PNA CLI"
            body="View the PNA CLI source code and contribute."
          />
          <Card
            href="https://github.com/Portable-Network-Archive/wasm-demo"
            title="Demo Source"
            body="View this demo site's source code."
          />
          <Card
            href="https://github.com/Portable-Network-Archive/"
            title="Organization"
            body="Explore all PNA-related projects."
          />
        </ul>
      </section>
    </main>
  );
}
