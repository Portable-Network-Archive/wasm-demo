import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import { setupConsoleErrorMonitoring, fetchBlobAsBytes } from "./helpers";

setupConsoleErrorMonitoring();

const FIXTURE_DIR = path.join(__dirname, "fixtures", "create");
const TEST_FILE_PATH = path.join(FIXTURE_DIR, "hello.txt");
const TEST_FILE_2_PATH = path.join(FIXTURE_DIR, "world.txt");

test.beforeAll(() => {
  fs.rmSync(FIXTURE_DIR, { recursive: true, force: true });
  fs.mkdirSync(FIXTURE_DIR, { recursive: true });
  fs.writeFileSync(TEST_FILE_PATH, "Hello, PNA!");
  fs.writeFileSync(TEST_FILE_2_PATH, "World!");
});

test.afterAll(() => {
  fs.rmSync(FIXTURE_DIR, { recursive: true, force: true });
});

test.describe("Create page", () => {
  test("page renders after WASM dynamic import", async ({ page }) => {
    await page.goto("/create/");
    await expect(page.locator("h1")).toHaveText("Create PNA Archive");
  });

  test("Create button is disabled when no files are added", async ({
    page,
  }) => {
    await page.goto("/create/");
    await expect(page.getByRole("button", { name: "Create" })).toBeDisabled();
  });

  test("can add a file and create an archive", async ({ page }) => {
    await page.goto("/create/");
    await expect(page.locator("h1")).toBeVisible();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_FILE_PATH);

    await expect(page.getByText("hello.txt")).toBeVisible();

    const createButton = page.getByRole("button", { name: "Create" });
    await expect(createButton).toBeEnabled();
    await createButton.click();

    const downloadLink = page.locator("a[download='archive.pna']");
    await expect(downloadLink).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("archive.pna")).toBeVisible();

    const href = await downloadLink.getAttribute("href");
    expect(href).toMatch(/^blob:/);
  });

  test("can add multiple files and create a valid archive", async ({
    page,
  }) => {
    await page.goto("/create/");
    await expect(page.locator("h1")).toBeVisible();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([TEST_FILE_PATH, TEST_FILE_2_PATH]);

    await expect(page.getByText("hello.txt")).toBeVisible();
    await expect(page.getByText("world.txt")).toBeVisible();

    const createButton = page.getByRole("button", { name: "Create" });
    await createButton.click();

    const downloadLink = page.locator("a[download='archive.pna']");
    await expect(downloadLink).toBeVisible({ timeout: 10_000 });

    const href = await downloadLink.getAttribute("href");
    expect(href).toMatch(/^blob:/);

    const archiveBuffer = await fetchBlobAsBytes(page, href!);

    // Round-trip: extract the multi-file archive and verify both files
    const archivePath = path.join(FIXTURE_DIR, "multi.pna");
    fs.writeFileSync(archivePath, Buffer.from(archiveBuffer));

    await page.goto("/extract/");
    await expect(page.locator("h1")).toHaveText("Extract PNA Archive");

    const extractFileInput = page.locator('input[type="file"]');
    await extractFileInput.setInputFiles(archivePath);

    await page.getByRole("button", { name: "Extract" }).click();

    await expect(page.locator("a[download='hello.txt']")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("a[download='world.txt']")).toBeVisible();
  });

  test("can create an encrypted archive", async ({ page }) => {
    await page.goto("/create/");
    await expect(page.locator("h1")).toBeVisible();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_FILE_PATH);

    await page.getByLabel("Encrypt archive").check();
    await page.locator('input[type="password"]').fill("test_password");

    const createButton = page.getByRole("button", { name: "Create" });
    await createButton.click();

    const downloadLink = page.locator("a[download='archive.pna']");
    await expect(downloadLink).toBeVisible({ timeout: 15_000 });
  });

  test("header logo navigates to home", async ({ page }) => {
    await page.goto("/create/");
    await expect(page.locator("h1")).toBeVisible();
    await page.getByRole("link", { name: "PNA Demo" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
