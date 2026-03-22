import { test, expect } from "@playwright/test";
import { setupConsoleErrorMonitoring } from "./helpers";

setupConsoleErrorMonitoring();

test.describe("Home page", () => {
  test("renders title and navigation cards", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toContainText("WASM PNA");

    await expect(page.getByRole("link", { name: "Create" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Extract" })).toBeVisible();
  });

  test("navigates to Create page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Create" }).click();
    await expect(page).toHaveURL(/\/create\//);
  });

  test("navigates to Extract page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Extract" }).click();
    await expect(page).toHaveURL(/\/extract\//);
  });
});
