const workder = self;
workder.addEventListener("message", async (e: MessageEvent<File>) => {
  const pna = await import("pna");
  await pna.default();
  let entries = await pna.Archive.extract_to_entries(e.data);
  entries.array().map(async (entry, idx) => {
    const path = entry.name();
    const data = await entry.extract();
    const file = new File([data], path);
    workder.postMessage([idx, file]);
  });
});
