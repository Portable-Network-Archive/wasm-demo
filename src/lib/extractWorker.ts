const workder = self;
workder.addEventListener("message", async (e: MessageEvent<File>) => {
  const pna = await import("pna");
  await pna.default();
  let archive = await pna.Archive.from(e.data);
  (await archive.entries()).array().map(async (entry, idx) => {
    const path = entry.name();
    const data = await entry.extract();
    const file = new File([data], path);
    workder.postMessage([idx, file]);
  });
});
