"use client";
import styles from "./page.module.css";
import Button from "@/components/Button";
import BackButton from "@/components/BackButton";
import React, { useRef, useState } from "react";
import DropArea from "@/components/DripArea";
import dynamic from "next/dynamic";
import Card from "@/components/Card";
import bytes from "bytes";

export default dynamic(
  async () => {
    const init = await import("pna");
    await init.default();
    return () => Create(init);
  },
  {
    ssr: false,
  },
);

function Create(pna: typeof import("pna")) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [archive, setArchive] = useState<Uint8Array | null>(null);
  const [files, setFiles] = useState<File[]>([]);
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
    setFiles([...files, ...items]);
  }

  return (
    <main className={styles["main"]}>
      <BackButton href="../" />
      <h1 className={styles["h1"]}>Create PNA Archive</h1>
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
              <label htmlFor="file">Drop your files here!</label>
            </li>
          ) : (
            files.map((file) => (
              <li key={file.name} className={styles["li"]}>
                <span className={styles["file-name"]}>{file.name}</span>
                <span className={styles["file-size"]}>{bytes(file.size)}</span>
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
        title="Create"
        disabled={files.length === 0}
        onClick={async () => {
          const objects = await Promise.all(
            files.map(async (f) => pna.Entry.new(f)),
          );
          const a = pna.Archive.create(objects);
          setArchive(a.to_u8array());
        }}
      />
      {archive && (
        <div>
          <ul className={styles["link-card-grid"]}>
            <Card
              href={URL.createObjectURL(new Blob([archive]))}
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
