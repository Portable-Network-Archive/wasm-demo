import { formatError } from "./formatError";

let pnaModule: typeof import("pna") | null = null;

async function getPna() {
  if (!pnaModule) {
    pnaModule = await import("pna");
    await pnaModule.default();
  }
  return pnaModule;
}

const workder = self;
workder.addEventListener(
  "message",
  async (e: MessageEvent<[File, string | undefined]>) => {
    const [archive, password] = e.data;
    try {
      const pna = await getPna();
      let entries = await pna.Archive.extract_to_entries(archive);
      entries.array().map(async (entry, idx) => {
        try {
          const path = entry.name();
          const data = await entry.extract(password);
          const file = new File([new Uint8Array(data)], path);
          workder.postMessage([idx, file]);
        } catch (e) {
          workder.postMessage([
            "error",
            `Failed to extract entry ${idx}: ${formatError(e)}`,
          ]);
        }
      });
    } catch (e) {
      workder.postMessage([
        "error",
        `Failed to read archive: ${formatError(e)}`,
      ]);
    }
  },
);
