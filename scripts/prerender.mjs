import { build } from "vite";
import { readFile, writeFile, mkdir, rm, copyFile } from "node:fs/promises";
const base = "https://naumansaeed0.github.io/Rootwise/";
const plants = JSON.parse(await readFile("src/data/plants.json", "utf8"));
await build({
  build: { ssr: "src/entry-server.tsx", outDir: ".ssr", emptyOutDir: true },
});
const { render } = await import("../.ssr/entry-server.js");
const shell = await readFile("dist/index.html", "utf8");
const pages = [
  [
    "index.html",
    "A little knowledge. A lot of growth.",
    "Know your plants. Grow your confidence. Explore 55 indoor plants, thoughtful care guides, and the science behind greener spaces.",
  ],
  [
    "library.html",
    "Find your kind of green",
    "Explore 55 indoor plants. Search common and scientific names, then filter by light, care level, pet safety, size, and category.",
  ],
  [
    "guides.html",
    "Care guides for happier plants",
    "Six evergreen indoor plant guides: watering, light, humidity, repotting, pests, and low-light spaces.",
  ],
  [
    "benefits.html",
    "The real benefits of indoor plants",
    "An honest look at houseplant benefits, wellbeing evidence, and the myth that a few plants purify indoor air.",
  ],
  [
    "about.html",
    "About, sources & credits",
    "How Rootwise is researched, our botanical sources, safety guidance, open verification notes, and illustration credits.",
  ],
  [
    "404.html",
    "Page not found",
    "This page has not put down roots. Return to the Rootwise indoor plant library.",
  ],
  [
    "plant.html",
    "Find a plant",
    "Choose a plant from the Rootwise library for its full care profile.",
  ],
  ...plants.map((p) => [
    `plant-${p.slug}.html`,
    `${p.commonName} — ${p.scientificName}`,
    p.description,
  ]),
];
const escape = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
for (const [file, title, description] of pages) {
  let html = shell
    .replace(
      '<div id="root"></div>',
      `<div id="root">${render(base + file)}</div>`,
    )
    .replace(
      /<title>.*?<\/title>/,
      `<title>${escape(title)} | Rootwise</title>`,
    )
    .replace(
      /(<meta name="description" content=")[^"]*/,
      `$1${escape(description)}`,
    )
    .replace(
      /(<meta property="og:title" content=")[^"]*/,
      `$1${escape(title)} | Rootwise`,
    )
    .replace(
      /(<meta property="og:description" content=")[^"]*/,
      `$1${escape(description)}`,
    );
  if (file !== "404.html" && file !== "plant.html")
    html = html.replace(
      "</head>",
      `<link rel="canonical" href="${base + file}"/><meta property="og:url" content="${base + file}"/></head>`,
    );
  else
    html = html.replace(
      "</head>",
      '<meta name="robots" content="noindex"/></head>',
    );
  if (file === "404.html")
    html = html.replace("</head>", '<base href="/Rootwise/"/></head>');
  await writeFile(`dist/${file}`, html);
}
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages
    .filter(([p]) => p !== "404.html" && p !== "plant.html")
    .map(([p]) => `<url><loc>${base + p}</loc></url>`)
    .join("")}</urlset>\n`,
);
await writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`,
);
await writeFile("dist/.nojekyll", "");
await mkdir("dist/assets/licenses", { recursive: true });
for (const name of [
  "React",
  "React-DOM",
  "Scheduler",
  "Vite",
  "Manrope-OFL",
  "DM-Mono-OFL",
])
  await copyFile(
    `docs/licenses/${name}.txt`,
    `dist/assets/licenses/${name}.txt`,
  );
// Preserve the existing font notice URLs for links/bookmarks from earlier releases.
await copyFile(
  "docs/licenses/Manrope-OFL.txt",
  "dist/assets/licenses/Manrope.txt",
);
await copyFile(
  "docs/licenses/DM-Mono-OFL.txt",
  "dist/assets/licenses/DM-Mono.txt",
);
await copyFile("LICENSE", "dist/LICENSE.txt");
const notices = (await readFile("THIRD_PARTY_NOTICES.md", "utf8"))
  .replaceAll("docs/licenses/", "assets/licenses/")
  .replace("[LICENSE](LICENSE)", "[LICENSE](LICENSE.txt)")
  .replace(
    "[the data review](docs/data-review.md)",
    "[the data review](https://github.com/naumansaeed0/Rootwise/blob/main/docs/data-review.md)",
  )
  .replace(
    "[the content wording review](docs/content-review.md)",
    "[the content wording review](https://github.com/naumansaeed0/Rootwise/blob/main/docs/content-review.md)",
  );
await writeFile("dist/THIRD_PARTY_NOTICES.md", notices);
await rm(".ssr", { recursive: true, force: true });
console.log(
  `Prerendered ${pages.length} static pages, including ${plants.length} plant profiles.`,
);
