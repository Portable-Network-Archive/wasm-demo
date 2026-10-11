"use client";
import styles from "./page.module.css";
import Button from "@/components/Button";
import React, { useEffect, useMemo, useRef, useState } from "react";
import DropArea from "@/components/DropArea";
import dynamic from "next/dynamic";
import Card from "@/components/Card";
import bytes from "bytes";
import { formatError } from "@/lib/formatError";
import type {
  CreateWorkerRequest,
  CreateWorkerResponse,
} from "@/lib/createWorker";

export default dynamic(async () => Create, {
  ssr: false,
  loading: () => (
    <main className={styles["main"]}>
      <p style={{ textAlign: "center" }}>Loading WebAssembly module...</p>
    </main>
  ),
});

function formatRatio(original: number, compressed: number): string {
  if (original <= 0) return "";
  if (compressed <= original) {
    return `${Math.round((1 - compressed / original) * 100)}% smaller`;
  }
  return `${Math.round((compressed / original - 1) * 100)}% overhead`;
}

type Algorithm = "aes" | "camellia";

function Create() {
  const inputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const startTimeRef = useRef<number>(0);
  const originalSizeRef = useRef<number>(0);
  const [archive, setArchive] = useState<Uint8Array | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useSolid, setUseSolid] = useState(false);
  const [useEncryption, setUseEncryption] = useState(false);
  const [password, setPassword] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("aes");
  const [stats, setStats] = useState<{
    originalSize: number;
    archiveSize: number;
    duration: number;
  } | null>(null);
  const [progress, setProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

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

  useEffect(() => {
    const worker = new Worker(
      new URL("@/lib/createWorker.ts", import.meta.url),
    );
    worker.addEventListener(
      "message",
      (e: MessageEvent<CreateWorkerResponse>) => {
        const data = e.data;
        if (data[0] === "progress") {
          setProgress({ done: data[1], total: data[2] });
          if (data[1] >= data[2]) setIsCompressing(true);
          return;
        }
        if (data[0] === "error") {
          setError(data[1]);
          setIsProcessing(false);
          setProgress(null);
          setIsCompressing(false);
          return;
        }
        const result = new Uint8Array(data[1]);
        const duration = performance.now() - startTimeRef.current;
        setArchive(result);
        setStats({
          originalSize: originalSizeRef.current,
          archiveSize: result.length,
          duration,
        });
        setProgress(null);
        setIsCompressing(false);
        setIsProcessing(false);
      },
    );
    worker.addEventListener("error", (event) => {
      setIsProcessing(false);
      workerRef.current = null;
      setProgress(null);
      setIsCompressing(false);
      setError(
        `Worker error: ${event.message ?? "An unknown error occurred in the creation worker."}`,
      );
    });
    worker.addEventListener("messageerror", () => {
      setIsProcessing(false);
      workerRef.current = null;
      setProgress(null);
      setIsCompressing(false);
      setError("Failed to deserialize message from creation worker.");
    });
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

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
        aria-label="Files to archive"
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
      <div className={styles["encryption-options"]}>
        <label className={styles["encryption-toggle"]}>
          <input
            type="checkbox"
            checked={useSolid}
            onChange={(e) => setUseSolid(e.target.checked)}
          />
          Solid mode (compress all files together)
        </label>
        <label className={styles["encryption-toggle"]}>
          <input
            type="checkbox"
            checked={useEncryption}
            onChange={(e) => {
              setUseEncryption(e.target.checked);
              if (!e.target.checked) setPassword("");
            }}
          />
          Encrypt archive
        </label>
        {useEncryption && (
          <div className={styles["encryption-fields"]}>
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
              aria-label="Encryption algorithm"
            >
              <option value="aes">AES-256</option>
              <option value="camellia">Camellia-256</option>
            </select>
          </div>
        )}
      </div>
      <Button
        title={isProcessing ? "Creating..." : "Create"}
        disabled={
          files.length === 0 ||
          isProcessing ||
          (useEncryption && !password.trim())
        }
        onClick={() => {
          if (isProcessing) return;
          const w = workerRef.current;
          if (!w) {
            setError(
              "Creation worker is not available. Please reload the page.",
            );
            return;
          }
          setIsProcessing(true);
          setError(null);
          setArchive(null);
          setStats(null);
          setProgress({ done: 0, total: files.length });
          setIsCompressing(false);
          startTimeRef.current = performance.now();
          originalSizeRef.current = files.reduce((sum, f) => sum + f.size, 0);
          const trimmedPassword = password.trim();
          const request: CreateWorkerRequest = [
            files,
            useEncryption
              ? { solid: useSolid, password: trimmedPassword, algorithm }
              : { solid: useSolid },
          ];
          try {
            w.postMessage(request);
          } catch (e) {
            setError(formatError(e));
            setIsProcessing(false);
            setProgress(null);
          }
        }}
      />
      {isProcessing && (
        <div className={styles["progress"]}>
          {isCompressing ? (
            <p role="progressbar" aria-label="Compressing archive">
              Compressing archive...
            </p>
          ) : (
            progress && (
              <>
                <div
                  role="progressbar"
                  aria-label="Creating archive"
                  aria-valuemin={0}
                  aria-valuemax={progress.total}
                  aria-valuenow={progress.done}
                  className={styles["progress-bar"]}
                >
                  <div
                    className={styles["progress-fill"]}
                    style={{
                      width: `${progress.total === 0 ? 0 : Math.round((progress.done / progress.total) * 100)}%`,
                    }}
                  />
                </div>
                <p>
                  Processing {progress.done} of {progress.total} files...
                </p>
              </>
            )
          )}
        </div>
      )}
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
