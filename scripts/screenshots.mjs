/** Capture the three README views from the production preview. No image editing. */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const origin = process.env.SCREENSHOT_ORIGIN || "http://127.0.0.1:4174";
await mkdir("docs/screenshots", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  for (const [file, route, theme, height] of [
    ["home-dark.jpg", "index.html", "dark", 960],
    ["library-dark.jpg", "library.html", "dark", 1160],
    ["plant-light.jpg", "plant-pothos.html", "light", 1060],
  ]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height },
      colorScheme: theme,
    });
    const page = await context.newPage();
    await page.goto(`${origin}/${route}`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `docs/screenshots/${file}`, quality: 85 });
    await context.close();
  }
} finally {
  await browser.close();
}
