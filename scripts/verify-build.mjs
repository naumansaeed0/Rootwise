import { readFile, readdir, stat } from "node:fs/promises";
import assert from "node:assert/strict";
import path from "node:path";
const files = (await readdir("dist")).filter((f) => f.endsWith(".html"));
let links = 0;
for (const file of files) {
  const html = await readFile(`dist/${file}`, "utf8");
  assert.ok(
    html.includes('<main id="main">'),
    `${file}: missing rendered content`,
  );
  assert.ok(html.includes("<title>"), `${file}: title missing`);
  assert.ok(!html.includes("codex-preview"));
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1].replaceAll("&amp;", "&");
    if (/^(https?:|data:|#|mailto:)/.test(url)) continue;
    if (url === "/Rootwise/") continue;
    assert.ok(!url.startsWith("/"), `${file}: root-relative URL ${url}`);
    const name = url.split(/[?#]/)[0];
    if (!name) continue;
    await stat(path.join("dist", name)).catch(() => {
      throw new Error(`${file}: broken local link ${url}`);
    });
    links++;
  }
}
const plantPages = files.filter((f) => f.startsWith("plant-"));
assert.equal(plantPages.length, 55);
const titles = await Promise.all(
  plantPages.map(
    async (p) =>
      (await readFile(`dist/${p}`, "utf8")).match(/<title>(.*?)<\/title>/)[1],
  ),
);
assert.equal(new Set(titles).size, 55);
assert.ok(
  (await readFile("dist/404.html", "utf8")).includes(
    '<base href="/Rootwise/"/>',
  ),
);
for (const f of [
  "robots.txt",
  "sitemap.xml",
  ".nojekyll",
  "assets/licenses/Manrope.txt",
  "assets/licenses/DM-Mono.txt",
  "assets/licenses/React.txt",
  "assets/licenses/React-DOM.txt",
  "assets/licenses/Scheduler.txt",
  "assets/licenses/Vite.txt",
  "LICENSE.txt",
  "THIRD_PARTY_NOTICES.md",
])
  await stat(`dist/${f}`);
console.log(
  `Verified ${files.length} pre-rendered pages, ${links} local links/assets, 55 unique plant titles, sitemap, robots, font licenses, and nested 404 base.`,
);
// Only public site files belong on the hosting branch.
const allowedRoot = new Set([
  ...files,
  "assets",
  "robots.txt",
  "sitemap.xml",
  ".nojekyll",
  "LICENSE.txt",
  "THIRD_PARTY_NOTICES.md",
]);
for (const entry of await readdir("dist"))
  assert.ok(allowedRoot.has(entry), `Unexpected publish root: ${entry}`);
for (const name of [
  "React",
  "React-DOM",
  "Scheduler",
  "Vite",
  "Manrope-OFL",
  "DM-Mono-OFL",
])
  assert.equal(
    await readFile(`dist/assets/licenses/${name}.txt`, "utf8"),
    await readFile(`docs/licenses/${name}.txt`, "utf8"),
    `Incomplete notice: ${name}`,
  );
assert.equal(
  await readFile("dist/LICENSE.txt", "utf8"),
  await readFile("LICENSE", "utf8"),
);
