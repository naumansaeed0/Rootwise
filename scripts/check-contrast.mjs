/** Check solid text surfaces on every specimen. Complements axe's manual-review
 * results for SVG/artwork and deferred offscreen content; does not certify WCAG. */
import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const output = [];
try {
  for (const theme of ["dark", "light"]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1100 },
      colorScheme: theme,
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4174/library.html");
    const records = await page.evaluate(() => {
      const rgb = (s) => s.match(/[\d.]+/g)?.map(Number) || [0, 0, 0, 0];
      const luminance = (rgb) =>
        rgb
          .slice(0, 3)
          .map((v) => {
            v /= 255;
            return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          })
          .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
      return [...document.querySelectorAll(".specimen-card")].map((card) => {
        const nodes = [
          ...card.querySelectorAll(
            ".specimen-id,.specimen-category,h3,.specimen-scientific,.ui-readout-label,.ui-readout-value,.ui-status,.specimen-card-footer span",
          ),
        ];
        const pairs = nodes.map((el) => {
          const fg = getComputedStyle(el).color;
          let parent = el,
            bg = "";
          while (parent) {
            const color = getComputedStyle(parent).backgroundColor;
            const values = rgb(color);
            if (values.length === 3 || values[3] === 1) {
              bg = color;
              break;
            }
            parent = parent.parentElement;
          }
          const a = luminance(rgb(fg)),
            b = luminance(rgb(bg));
          return {
            text: el.textContent.trim(),
            foreground: fg,
            background: bg,
            ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
          };
        });
        return {
          name: card.querySelector("h3").textContent,
          palette: card.getAttribute("data-palette"),
          minimumRatio: Math.min(...pairs.map((p) => p.ratio)),
          failures: pairs.filter((p) => p.ratio < 4.5),
          checkedTextPairs: pairs.length,
        };
      });
    });
    output.push({
      theme,
      records,
      minimumRatio: Math.min(...records.map((r) => r.minimumRatio)),
    });
    await context.close();
  }
} finally {
  await browser.close();
}
await writeFile(
  "docs/audits/specimen-contrast.json",
  JSON.stringify(output, null, 2) + "\n",
);
for (const row of output)
  console.log(
    `${row.theme}: ${row.records.length} specimen cards; minimum text contrast ${row.minimumRatio.toFixed(2)}:1`,
  );
if (output.some((r) => r.records.some((p) => p.failures.length)))
  process.exitCode = 1;
