"use client";
import styles from "./page.module.css";
import Button from "@/components/Button";
import BackButton from "@/components/BackButton";
import DropArea from "@/components/DripArea";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Card from "@/components/Card";
import bytes from "bytes";

export default dynamic(
  async () => {
    const init = await import("pna");
    init.default();
    return () => Extract(init);
  },
  {
    ssr: false,
  },
);

function Extract(pna: typeof import("pna")) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [archives, setArchives] = useState<File[]>([]);
  const [entries, setEntries] = useState<File[]>([]);
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
    setArchives([...archives, ...files]);
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
            archives.map((archive) => (
              <li key={archive.name} className={styles["li"]}>
                {archive.name}
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
          let a = archives.at(0);
          if (a === undefined) {
            return;
          }
          let archive = await pna.Archive.from(a);
          let result = await Promise.all(
            (await archive.entries()).array().map(async (entry) => {
              let path = entry.name();
              let data = await entry.extract();
              return new File([data], path);
            }),
          );
          setEntries(result);
        }}
      />
      <div>
        <ul role="list" className={styles["link-card-grid"]}>
          {entries.map((entry) => {
            let path = entry.name;
            return (
              <Card
                key={path}
                href={URL.createObjectURL(entry)}
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
