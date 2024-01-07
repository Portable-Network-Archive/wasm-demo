const workder = self;
workder.addEventListener(
  "message",
  async (e: MessageEvent<[File, string | undefined]>) => {
    const pna = await import("pna");
    await pna.default();
    const [archive, password] = e.data;
    let entries = await pna.Archive.extract_to_entries(archive);
    entries.array().map(async (entry, idx) => {
      const path = entry.name();
      try {
        if (entry.is_encrypted()) {
          const data = await entry.extract(password);
          const file = new File([data], path);
          workder.postMessage([idx, file]);
        } else {
          const data = await entry.extract();
          const file = new File([data], path);
          workder.postMessage([idx, file]);
        }
      } catch (e) {
        console.error(e);
      }
    });
  },
);
