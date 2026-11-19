/** Verify live bytes over HTTPS with certificate checks enabled.
 * Honor the execution environment's proxy instead of attempting direct egress.
 */
import { request } from "@playwright/test";
import { readFile, writeFile, readdir } from "node:fs/promises";
import assert from "node:assert/strict";
const base = "https://naumansaeed0.github.io/Rootwise/";
const configured =
  process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY;
const options = {};
if (configured) {
  const url = new URL(configured);
  options.proxy = { server: `${url.protocol}//${url.host}` };
  if (url.username) options.proxy.username = decodeURIComponent(url.username);
  if (url.password) options.proxy.password = decodeURIComponent(url.password);
}
const client = await request.newContext(options);
const assets = (await readdir("dist/assets"))
  .filter((f) => /\.(js|css)$/.test(f))
  .map((f) => "assets/" + f);
const paths = [
  "index.html",
  "library.html",
  "plant-pothos.html",
  "guides.html",
  "benefits.html",
  "about.html",
  "404.html",
  "LICENSE.txt",
  "THIRD_PARTY_NOTICES.md",
  ...assets,
  ...[
    "React",
    "React-DOM",
    "Scheduler",
    "Vite",
    "Manrope-OFL",
    "DM-Mono-OFL",
  ].map((n) => `assets/licenses/${n}.txt`),
];
const results = [];
try {
  for (const path of paths) {
    const response = await client.get(base + path);
    assert.equal(response.status(), 200, path);
    assert.deepEqual(
      await response.body(),
      await readFile("dist/" + path),
      `Published bytes differ: ${path}`,
    );
    results.push({ path, status: response.status(), matchesBuild: true });
  }
} finally {
  await client.dispose();
}
await writeFile(
  "docs/audits/live-check.json",
  JSON.stringify(
    {
      base,
      certificateVerificationEnabled: true,
      checkedAt: new Date().toISOString(),
      results,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Verified ${results.length} live pages/assets/notices over certificate-validated HTTPS; all match the production build.`,
);
