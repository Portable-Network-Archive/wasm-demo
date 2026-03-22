"use client";
import styles from "./page.module.css";
import Button from "@/components/Button";
import BackButton from "@/components/BackButton";
import DropArea from "@/components/DropArea";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Card from "@/components/Card";
import bytes from "bytes";
import { formatError } from "@/lib/formatError";

export default dynamic(
  async () => {
    const init = await import("pna");
    await init.default();
    return () => Extract(init);
  },
  {
    ssr: false,
    loading: () => (
      <main className={styles["main"]}>
        <p style={{ textAlign: "center" }}>Loading WebAssembly module...</p>
      </main>
    ),
  },
);

function Extract(pna: typeof import("pna")) {
  const inputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const [archives, setArchives] = useState<File[]>([]);
  const [entries, setEntries] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL("@/lib/extractWorker.ts", import.meta.url),
    );
    worker.addEventListener(
      "message",
      (e: MessageEvent<[number, File] | ["error", string]>) => {
        const data = e.data;
        if (data[0] === "error") {
          setError(data[1]);
          return;
        }
        const [index, file] = data;
        setEntries((current) => {
          const newOne = [...current];
          newOne[index] = file;
          return newOne;
        });
      },
    );
    worker.addEventListener("error", (event) => {
      setError(
        `Worker error: ${event.message ?? "An unknown error occurred in the extraction worker."}`,
      );
    });
    worker.addEventListener("messageerror", () => {
      setError("Failed to deserialize message from extraction worker.");
    });
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  const entryUrls = useMemo(() => {
    const urls = new Map<number, string>();
    entries.forEach((entry, index) => {
      if (entry) {
        try {
          urls.set(index, URL.createObjectURL(entry));
        } catch {
          // Silently skip — user already sees fewer download cards
        }
      }
    });
    return urls;
  }, [entries]);

  useEffect(() => {
    return () => {
      entryUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [entryUrls]);

  function preventDefaults<E, C, T>(event: React.BaseSyntheticEvent<E, C, T>) {
    event.preventDefault();
    event.stopPropagation();
  }
  function handleDrop<E>(event: React.DragEvent<E>) {
    preventDefaults(event);
    const files = event.dataTransfer.files;
    addItems(Array.from(files));
  }
  function addItems(files: File[]) {
    setError(null);
    setArchives((prev) => [...prev, ...files]);
  }

  return (
    <main className={styles["main"]}>
      <BackButton href="../" />
      <h1 className={styles["h1"]}>Extract PNA Archive</h1>
      <DropArea
        onDragEnter={preventDefaults}
        onDragLeave={preventDefaults}
        onDragOver={preventDefaults}
        onDrop={handleDrop}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <ul className={styles["ul"]}>
          {archives.length === 0 ? (
            <li>
              <label htmlFor="file">Drop your PNA file here!</label>
            </li>
          ) : (
            archives.map((archive, index) => (
              <li key={`${archive.name}-${index}`} className={styles["li"]}>
                <span>{archive.name}</span>
                <button
                  className={styles["remove-button"]}
                  onClick={(e) => {
                    e.stopPropagation();
                    setError(null);
                    setArchives((prev) => prev.filter((_, i) => i !== index));
                  }}
                  aria-label={`Remove ${archive.name}`}
                >
                  &times;
                </button>
              </li>
            ))
          )}
        </ul>
        <input
          ref={inputRef}
          id="file"
          type="file"
          accept=".pna"
          onChange={(event) => {
            const files = event.target.files;
            files && addItems(Array.from(files));
          }}
        />
      </DropArea>
      <Button
        title="Extract"
        disabled={archives.length === 0}
        onClick={async () => {
          setError(null);
          setEntries([]);
          const a = archives.at(0);
          if (a === undefined) {
            return;
          }
          try {
            const archive = await pna.Archive.from(a);
            const w = workerRef.current;
            if (!w) {
              setError(
                "Extraction worker is not available. Please reload the page.",
              );
              return;
            }
            if (archive.is_encrypted()) {
              const password = prompt(`Input password of archive`, "");
              w.postMessage([a, password]);
            } else {
              w.postMessage([a, undefined]);
            }
          } catch (e) {
            setError(formatError(e));
          }
        }}
      />
      {error && (
        <p className={styles["error"]} role="alert">
          {error}
        </p>
      )}
      <div>
        <ul role="list" className={styles["link-card-grid"]}>
          {entries.map((entry, index) => {
            if (!entry) return null;
            const url = entryUrls.get(index);
            if (!url) return null;
            const path = entry.name;
            return (
              <Card
                key={`${path}-${index}`}
                href={url}
                title="Download"
                rightIcon={<span>&darr;</span>}
                body={path + " : " + bytes(entry.size)}
                download={path}
              />
            );
          })}
        </ul>
      </div>
    </main>
  );
}
