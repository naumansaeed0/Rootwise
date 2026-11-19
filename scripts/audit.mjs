/** Repeatable Lighthouse mobile lab runs against the verified static build.
 * Start `npm run preview -- --port 4174 --strictPort` first. */
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const origin = process.env.AUDIT_ORIGIN || "http://127.0.0.1:4174";
await mkdir("docs/audits", { recursive: true });
const results = [];
for (const [name, route] of [
  ["home", "index.html"],
  ["library", "library.html"],
  ["plant", "plant-pothos.html"],
]) {
  const output = `docs/audits/lighthouse-${name}`;
  await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        "node_modules/lighthouse/cli/index.js",
        `${origin}/${route}`,
        "--output=json",
        "--output=html",
        `--output-path=${output}`,
        "--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage",
        "--quiet",
      ],
      {
        stdio: "inherit",
        env: {
          ...process.env,
          CHROME_PATH: process.env.CHROME_PATH || "/usr/bin/chromium",
        },
      },
    );
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`Lighthouse failed: ${code}`)),
    );
  });
  const report = JSON.parse(await readFile(`${output}.report.json`, "utf8"));
  results.push({
    page: name,
    url: report.finalDisplayedUrl,
    fetchTime: report.fetchTime,
    lighthouseVersion: report.lighthouseVersion,
    formFactor: report.configSettings.formFactor,
    throttlingMethod: report.configSettings.throttlingMethod,
    scores: Object.fromEntries(
      Object.entries(report.categories).map(([k, v]) => [
        k,
        Math.round(v.score * 100),
      ]),
    ),
    metrics: Object.fromEntries(
      [
        "first-contentful-paint",
        "largest-contentful-paint",
        "total-blocking-time",
        "cumulative-layout-shift",
        "speed-index",
      ].map((k) => [
        k,
        {
          value: report.audits[k].numericValue,
          display: report.audits[k].displayValue,
        },
      ]),
    ),
    failedAudits: Object.values(report.audits)
      .filter(
        (a) =>
          a.score !== null &&
          a.score < 0.9 &&
          a.details?.type !== "opportunity",
      )
      .map((a) => ({ id: a.id, score: a.score, title: a.title })),
  });
  console.log(JSON.stringify(results.at(-1), null, 2));
}
await writeFile(
  "docs/audits/lighthouse-summary.json",
  JSON.stringify(results, null, 2) + "\n",
);
