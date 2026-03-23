"use client";
import styles from "./page.module.css";
import Button from "@/components/Button";
import React, { useEffect, useMemo, useRef, useState } from "react";
import DropArea from "@/components/DropArea";
import dynamic from "next/dynamic";
import Card from "@/components/Card";
import bytes from "bytes";
import { formatError } from "@/lib/formatError";

export default dynamic(
  async () => {
    const init = await import("pna");
    await init.default();
    return () => Create(init);
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

function formatRatio(original: number, compressed: number): string {
  if (original <= 0) return "";
  if (compressed <= original) {
    return `${Math.round((1 - compressed / original) * 100)}% smaller`;
  }
  return `${Math.round((compressed / original - 1) * 100)}% overhead`;
}

function Create(pna: typeof import("pna")) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [archive, setArchive] = useState<Uint8Array | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<{
    originalSize: number;
    archiveSize: number;
    duration: number;
  } | null>(null);

  const archiveUrl = useMemo(() => {
    if (!archive) return null;
    try {
      return URL.createObjectURL(new Blob([new Uint8Array(archive)]));
    } catch {
      return null;
    }
  }, [archive]);

  useEffect(() => {
    return () => {
      if (archiveUrl) URL.revokeObjectURL(archiveUrl);
    };
  }, [archiveUrl]);

  function preventDefaults<E, C, T>(event: React.BaseSyntheticEvent<E, C, T>) {
    event.preventDefault();
    event.stopPropagation();
  }
  function handleDrop<E>(event: React.DragEvent<E>) {
    preventDefaults(event);
    const files = event.dataTransfer.files;
    addItems(files);
  }
  function addItems(fileList: FileList) {
    let items = Array.from(fileList);
    setError(null);
    setFiles((prev) => [...prev, ...items]);
  }

  return (
    <main className={styles["main"]}>
      <h1 className={styles["h1"]}>Create PNA Archive</h1>
      <p className={styles["steps"]}>
        1. Drop files &rarr; 2. Click Create &rarr; 3. Download
      </p>
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
          {files.length === 0 ? (
            <li>
              <label htmlFor="file">Drop files here or click to browse</label>
            </li>
          ) : (
            files.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${index}`}
                className={styles["li"]}
              >
                <span className={styles["file-name"]}>{file.name}</span>
                <span className={styles["file-size"]}>{bytes(file.size)}</span>
                <button
                  className={styles["remove-button"]}
                  onClick={(e) => {
                    e.stopPropagation();
                    setError(null);
                    setFiles((prev) => prev.filter((_, i) => i !== index));
                  }}
                  aria-label={`Remove ${file.name}`}
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
          multiple
          onChange={(event) => {
            const files = event.target.files;
            files && addItems(files);
          }}
        />
      </DropArea>
      <Button
        title={isProcessing ? "Creating..." : "Create"}
        disabled={files.length === 0 || isProcessing}
        onClick={async () => {
          setIsProcessing(true);
          setError(null);
          setArchive(null);
          setStats(null);
          const startTime = performance.now();
          try {
            const objects = await Promise.all(
              files.map(async (f) => pna.Entry.new(f)),
            );
            const a = pna.Archive.create(objects);
            const result = a.to_u8array();
            const duration = performance.now() - startTime;
            const originalSize = files.reduce((sum, f) => sum + f.size, 0);
            setArchive(result);
            setStats({
              originalSize,
              archiveSize: result.length,
              duration,
            });
          } catch (e) {
            setError(formatError(e));
          } finally {
            setIsProcessing(false);
          }
        }}
      />
      {error && (
        <p className={styles["error"]} role="alert">
          {error}
        </p>
      )}
      {stats && (
        <div className={styles["stats"]}>
          <span>
            {bytes(stats.originalSize)} → {bytes(stats.archiveSize)}
          </span>
          <span>{formatRatio(stats.originalSize, stats.archiveSize)}</span>
          <span>{Math.round(stats.duration)}ms</span>
        </div>
      )}
      {archiveUrl && archive && (
        <div>
          <ul className={styles["link-card-grid"]}>
            <Card
              href={archiveUrl}
              title="Download"
              rightIcon={<span>&darr;</span>}
              body={"archive.pna" + " : " + bytes(archive.length)}
              download="archive.pna"
            />
          </ul>
        </div>
      )}
    </main>
  );
}
