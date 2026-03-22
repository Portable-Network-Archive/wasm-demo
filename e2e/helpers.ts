import { test, expect, type Page } from "@playwright/test";

export function setupConsoleErrorMonitoring() {
  let errors: string[] = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      errors.push(err.message);
    });
  });

  test.afterEach(async () => {
    expect(errors, "Unexpected browser console errors detected").toEqual([]);
  });
}

export async function fetchBlobAsBytes(
  page: Page,
  blobUrl: string,
): Promise<number[]> {
  const bytes = await page.evaluate(async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Blob fetch failed: ${res.status} ${res.statusText}`);
    }
    const buf = await res.arrayBuffer();
    if (buf.byteLength === 0) {
      throw new Error("Blob returned empty buffer");
    }
    return Array.from(new Uint8Array(buf));
  }, blobUrl);
  return bytes;
}

export async function fetchBlobAsText(
  page: Page,
  blobUrl: string,
): Promise<string> {
  const text = await page.evaluate(async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Blob fetch failed: ${res.status} ${res.statusText}`);
    }
    return await res.text();
  }, blobUrl);
  return text;
}
