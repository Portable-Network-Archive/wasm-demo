import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import {
  setupConsoleErrorMonitoring,
  fetchBlobAsBytes,
  fetchBlobAsText,
} from "./helpers";

setupConsoleErrorMonitoring();

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

  test("back button navigates to home", async ({ page }) => {
    await page.goto("/extract/");
    await expect(page.locator("h1")).toBeVisible();
    await page.getByText("\u2190").click();
    await expect(page).toHaveURL(/\/$/);
  });

  // TODO: Add encrypted archive test — requires generating encrypted .pna fixtures
  // from Rust/CLI tooling. Skipped until fixture generation is available.
  test.skip("can extract an encrypted archive", async () => {});
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
