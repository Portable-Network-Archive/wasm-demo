import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import {
  setupConsoleErrorMonitoring,
  fetchBlobAsBytes,
  fetchBlobAsText,
} from "./helpers";

setupConsoleErrorMonitoring();

const EXTRACT_FIXTURE_DIR = path.join(__dirname, "fixtures", "extract");

test.beforeAll(() => {
  fs.mkdirSync(EXTRACT_FIXTURE_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(EXTRACT_FIXTURE_DIR, "worker-test.txt"),
    "worker test",
  );
});

test.describe("Extract page", () => {
  test("page renders after WASM dynamic import", async ({ page }) => {
    await page.goto("/extract/");
    await expect(page.locator("h1")).toHaveText("Extract PNA Archive");
  });

  test("Extract button is disabled when no archive is added", async ({
    page,
  }) => {
    await page.goto("/extract/");
    await expect(page.getByRole("button", { name: "Extract" })).toBeDisabled();
  });

  test("header logo navigates to home", async ({ page }) => {
    await page.goto("/extract/");
    await expect(page.locator("h1")).toBeVisible();
    await page.getByRole("link", { name: "PNA Demo" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("Worker is created only once across renders", async ({ page }) => {
    // Patch Worker constructor to count instantiations before page loads
    await page.addInitScript(() => {
      const OriginalWorker = globalThis.Worker;
      let count = 0;
      (globalThis as any).__workerCreateCount = () => count;
      globalThis.Worker = class extends OriginalWorker {
        constructor(url: string | URL, opts?: WorkerOptions) {
          super(url, opts);
          count++;
        }
      } as typeof Worker;
    });

    await page.goto("/extract/");
    await expect(page.locator("h1")).toHaveText("Extract PNA Archive");

    // Trigger a re-render by adding a file then removing focus
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(
      path.join(__dirname, "fixtures", "extract", "worker-test.txt"),
    );

    const workerCount = await page.evaluate(() =>
      (globalThis as any).__workerCreateCount(),
    );
    expect(workerCount).toBe(1);
  });

  test("can extract an encrypted archive", async ({ page }) => {
    const FIXTURE_DIR = path.join(__dirname, "fixtures", "extract");
    fs.mkdirSync(FIXTURE_DIR, { recursive: true });
    const testFile = path.join(FIXTURE_DIR, "encrypted-test.txt");
    fs.writeFileSync(testFile, "encrypted content");

    // Create encrypted archive via Create page
    await page.goto("/create/");
    await expect(page.locator("h1")).toBeVisible();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFile);

    await page.getByLabel("Encrypt archive").check();
    await page.locator('input[type="password"]').fill("e2e_password");
    await page.getByRole("button", { name: "Create" }).click();

    const downloadLink = page.locator("a[download='archive.pna']");
    await expect(downloadLink).toBeVisible({ timeout: 15_000 });

    const href = await downloadLink.getAttribute("href");
    const archiveBuffer = await fetchBlobAsBytes(page, href!);
    const archivePath = path.join(FIXTURE_DIR, "encrypted.pna");
    fs.writeFileSync(archivePath, Buffer.from(archiveBuffer));

    // Extract on Extract page with password
    await page.goto("/extract/");
    await expect(page.locator("h1")).toBeVisible();

    const extractInput = page.locator('input[type="file"]');
    await extractInput.setInputFiles(archivePath);
    await page.getByRole("button", { name: "Extract" }).click();

    // Password form should appear
    await expect(page.locator("#archive-password")).toBeVisible({
      timeout: 10_000,
    });
    await page.locator("#archive-password").fill("e2e_password");
    await page.getByRole("button", { name: "Decrypt & Extract" }).click();

    // Verify extracted entry and content
    const entryLink = page.locator("a[download='encrypted-test.txt']");
    await expect(entryLink).toBeVisible({ timeout: 15_000 });

    const extractedHref = await entryLink.getAttribute("href");
    const extractedContent = await fetchBlobAsText(page, extractedHref!);
    expect(extractedContent).toBe("encrypted content");
  });
});

test.describe("Create and Extract round-trip", () => {
  const TEST_CONTENT = "Round-trip test content";
  const FIXTURE_DIR = path.join(__dirname, "fixtures", "extract");
  const TEST_FILE = path.join(FIXTURE_DIR, "roundtrip.txt");

  test.beforeAll(() => {
    fs.rmSync(FIXTURE_DIR, { recursive: true, force: true });
    fs.mkdirSync(FIXTURE_DIR, { recursive: true });
    fs.writeFileSync(TEST_FILE, TEST_CONTENT);
  });

  test.afterAll(() => {
    fs.rmSync(FIXTURE_DIR, { recursive: true, force: true });
  });

  test("create archive then extract and verify content", async ({ page }) => {
    // --- Create phase ---
    await page.goto("/create/");
    await expect(page.locator("h1")).toHaveText("Create PNA Archive");

    const createFileInput = page.locator('input[type="file"]');
    await createFileInput.setInputFiles(TEST_FILE);
    await expect(page.getByText("roundtrip.txt")).toBeVisible();

    await page.getByRole("button", { name: "Create" }).click();

    const downloadLink = page.locator("a[download='archive.pna']");
    await expect(downloadLink).toBeVisible({ timeout: 10_000 });

    const href = await downloadLink.getAttribute("href");
    expect(href).toMatch(/^blob:/);

    const archiveBuffer = await fetchBlobAsBytes(page, href!);

    const archivePath = path.join(FIXTURE_DIR, "test.pna");
    fs.writeFileSync(archivePath, Buffer.from(archiveBuffer));

    // --- Extract phase ---
    await page.goto("/extract/");
    await expect(page.locator("h1")).toHaveText("Extract PNA Archive");

    const extractFileInput = page.locator('input[type="file"]');
    await extractFileInput.setInputFiles(archivePath);

    await page.getByRole("button", { name: "Extract" }).click();

    const entryLink = page.locator("a[download='roundtrip.txt']");
    await expect(entryLink).toBeVisible({ timeout: 15_000 });
    await expect(entryLink).toHaveCount(1);

    const extractedHref = await entryLink.getAttribute("href");
    expect(extractedHref).toMatch(/^blob:/);

    const extractedContent = await fetchBlobAsText(page, extractedHref!);
    expect(extractedContent).toBe(TEST_CONTENT);
  });
});
