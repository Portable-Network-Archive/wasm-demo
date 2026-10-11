import { formatError } from "./formatError";

export type CreateWorkerOptions = {
  solid: boolean;
  password?: string;
  algorithm?: "aes" | "camellia";
};

export type CreateWorkerRequest = [File[], CreateWorkerOptions];

export type CreateWorkerResponse =
  | ["progress", done: number, total: number]
  | ["result", ArrayBuffer]
  | ["error", message: string];

let pnaModule: typeof import("pna") | null = null;

async function getPna() {
  if (!pnaModule) {
    pnaModule = await import("pna");
    await pnaModule.default();
  }
  return pnaModule;
}

const worker = self;
worker.addEventListener(
  "message",
  async (e: MessageEvent<CreateWorkerRequest>) => {
    const [files, options] = e.data;
    const { solid, password, algorithm } = options;
    if ((password === undefined) !== (algorithm === undefined)) {
      worker.postMessage([
        "error",
        `Failed to create archive: Password and encryption algorithm must both be provided or both be omitted.`,
      ]);
      return;
    }
    const encryption =
      password !== undefined && algorithm !== undefined
        ? { password, algorithm }
        : undefined;
    try {
      const pna = await getPna();
      const total = files.length;
      const entries = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        try {
          const entry =
            encryption && !solid
              ? await pna.Entry.new_encrypted(
                  f,
                  encryption.password,
                  encryption.algorithm,
                )
              : await pna.Entry.new(f);
          entries.push(entry);
          worker.postMessage(["progress", i + 1, total]);
        } catch (e) {
          worker.postMessage([
            "error",
            `Failed to read file ${f.name}: ${formatError(e)}`,
          ]);
          return;
        }
      }
      try {
        const archive = solid
          ? pna.Archive.create_solid(
              entries,
              encryption?.password,
              encryption?.algorithm,
            )
          : pna.Archive.create(entries);
        const bytes = archive.to_u8array();
        const buffer = bytes.buffer as ArrayBuffer;
        worker.postMessage(["result", buffer], { transfer: [buffer] });
      } catch (e) {
        worker.postMessage([
          "error",
          `Failed to create archive: ${formatError(e)}`,
        ]);
      }
    } catch (e) {
      worker.postMessage([
        "error",
        `Failed to create archive: ${formatError(e)}`,
      ]);
    }
  },
);
