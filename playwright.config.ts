import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "docs/audits/browser-tests.json" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:4174",
    colorScheme: "dark",
    launchOptions: {
      executablePath: process.env.CHROME_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    },
    viewport: { width: 1440, height: 1000 },
  },
  webServer: {
    command: "npm run preview -- --port 4174 --strictPort",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: true,
    timeout: 30000,
  },
});
