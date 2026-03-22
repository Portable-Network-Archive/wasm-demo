import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 0,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: {
    command: "npx serve out -l 3000",
    port: 3000,
    timeout: 30_000,
    stdout: "pipe",
    stderr: "pipe",
    // In CI, always start fresh. Locally, reuse existing server for speed.
    // If reusing, ensure the server is serving a current `npm run build` output.
    reuseExistingServer: !process.env.CI,
  },
});
