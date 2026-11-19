<p align="center"><img src="public/assets/cover.svg" alt="Rootwise — A little knowledge. A lot of growth." width="100%" /></p>

# Rootwise

An independent indoor plant field guide: **55 plant profiles, six care guides, and an interactive living plant.** React + TypeScript + Vite, built into static HTML for GitHub Pages. No backend, analytics, runtime CDN, or visitor editing.

[Visit Rootwise](https://naumansaeed0.github.io/Rootwise/) · [Implementation report](docs/report.md) · [Data review](docs/data-review.md)

## Run locally

Use Node.js 24 or later.

```sh
npm ci
npm run dev
```

Vite prints the development URL. The dev server serves the app shell for named HTML routes. The production build generates the real files:

```sh
npm run verify
npm run preview
```

Or serve the **built files** with a simple static server, without any Node runtime:

```sh
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080/`. Build-time React rendering makes plant and information pages readable before JavaScript loads; client-side React enables search, theme choice, panels, and the living plant.

## Source map

| File or directory                  | Purpose                                                    |
| ---------------------------------- | ---------------------------------------------------------- |
| `src/App.tsx`                      | Navigation and page templates; route selection             |
| `src/data/plants.json`             | All 55 structured botanical records                        |
| `src/data/plants.ts`               | Types, source links, shared filtering                      |
| `src/data/guides.ts`               | Six evergreen guide articles                               |
| `src/living-plant/config.ts`       | SVG paths, leaves, information nodes, growth settings      |
| `src/living-plant/LivingPlant.tsx` | Isolated scroll-driven SVG controller                      |
| `src/components/PlantArt.tsx`      | Reusable, theme-driven SVG illustrations                   |
| `src/components/Modal.tsx`         | Native modal dialog, Escape, focus restoration             |
| `src/styles/main.css`              | Responsive layout and theme/palette tokens                 |
| `src/entry-server.tsx`             | Build-time React renderer                                  |
| `scripts/prerender.mjs`            | Static HTML, metadata, sitemap, robots, licenses           |
| `scripts/verify-build.mjs`         | Production page/link/metadata checks                       |
| `scripts/check-sources.py`         | Optional source URL review; stores excerpts only in `/tmp` |
| `scripts/deploy.mjs`               | Manual verified publishing fallback                        |
| `.github/workflows/deploy.yml`     | On push to main: verify and publish dist to gh-pages       |

## Add or edit a plant

1. Add a record to `src/data/plants.json`, following an existing schema. Keep slugs unique and URL-safe.
2. Include common/scientific/alternate names, family, origin, category, theme, illustration shape, light, difficulty, size, safety, care, related names, problems, and source links.
3. Verify species-specific toxicity. If unsure, use `toxicity.pets: "Unverified"`, set `needsVerification: true`, and explain in `verificationNotes`. An unresolved care or identity question can also carry notes without changing a known safety label.
4. Choose a palette: `canopy`, `forest`, `desert`, or `bloom`. Shapes: `heart`, `split`, `oval`, `round`, `sword`, `grass`, `palm`, `fern`, `zz`, `rosette`, `bloom`. These are illustrative families, not botanical identification drawings.
5. Run `npm run verify`. Update the deliberately fixed 55-record checks when intentionally growing the library.

The template generates `plant-<slug>.html` for every record. No handwritten per-plant HTML is needed. Search includes alternate taxonomic names. Query-string filters preserve shareable library views. Legacy `plant.html?slug=pothos` still renders a profile, but canonical library links use prerendered files.

Images are isolated in `PlantArt.tsx` and `PlantCard.tsx`. To replace SVGs with owned photographs, add an image field to the schema and use a local `<img>` in these two views, with width, height, alt, and lazy loading for below-fold cards. No remote photos are fetched.

## Tweak the living plant

Edit **`src/living-plant/config.ts`**:

- `stems` and `roots`: SVG path strings in a 900 × 900 coordinate system.
- `leaves`: attachment coordinates, angle in degrees, and scale.
- `plantNodes`: labels, short/full text, guide links, icons, and percentage positions.
- `growthConfig.minStroke` / `maxStroke`: thickness range.
- `initialStem` / `initialRoot`: how much is visible before scrolling.
- `autoScrollPixelsPerSecond`: exploration speed.

The actual leaf silhouette and vein geometry live in `LivingPlant.tsx`. The `.living-section` height in CSS controls how much scrolling completes the growth. Hero colors are `--hero-leaf-*`, `--hero-stem`, and `--root` in CSS. Adjust mobile node overrides alongside artwork changes. Change information node wording without touching the renderer.

Passive scroll listeners schedule a single animation frame. That frame reads section geometry once, then sets normalized `stroke-dashoffset`, stroke width, and leaf opacity. An IntersectionObserver avoids offscreen work. Auto exploration is a separate frame loop and stops on wheel, touch, pointer, key, tab visibility change, or the end of the growth section. Reduced-motion users get a fully drawn static plant and disabled auto exploration.

## Themes

The default follows `prefers-color-scheme`; a toggle saves an explicit choice in `localStorage` under `rootwise-theme`. Storage failure does not stop the interface. The head script sets the initial mode before paint. CSS also provides a dark fallback.

Global surface/text colors live on `:root` and `:root[data-theme=light]`. Each card and detail view scopes `data-palette` with independent art colors and a contrast-conscious accent; light variants are defined explicitly. No runtime font request leaves the site. Manrope and DM Mono licenses are published at `assets/licenses/`.

## Deploy

**main contains source. gh-pages contains only the built website.** Never merge these branches together.

On every push to `main`, the workflow installs pinned dependencies with `npm ci`, runs data/filter tests, builds and prerenders, verifies local links, and force-updates the generated `gh-pages` branch. Only `dist/` is published; documentation, tests, dependencies, and workflows stay out of the hosted branch.

Manual fallback after committing your work:

```sh
npm run deploy
```

This also verifies and builds before replacing the generated branch. It requires Git push access and refuses a dirty source checkout.

Set these repository settings:

- **Settings → Pages → Build and deployment → Source: Deploy from a branch**
- **Branch: `gh-pages` · Folder: `/ (root)`**
- If the workflow reports insufficient permission: **Settings → Actions → General → Workflow permissions → Read and write permissions**. The workflow already requests `contents: write`; organization policy may override it.

All normal links/assets are relative; Vite uses `base: './'`. Pages are flat files, so deep links and refreshes do not require a server rewrite. The custom 404 has `/Rootwise/` as its base so links also work for unknown nested paths. If the repository moves, update the base URL in `scripts/prerender.mjs`, the 404 base, index Open Graph image, source link, and this README.

## Verification limits

Unit tests cover common/scientific/alternate-name search, combined filters, safety exclusions, record completeness, and verification notes. Build checks verify 62 pages, local links/assets, unique plant titles, crawler files, licenses, and the 404 base. These do not replace a browser accessibility or performance audit. See `docs/report.md` for the actual checks completed in this environment and remaining limitations.

## Round 2: specimen interface

The library now has a shared instrument design system, stable specimen codes, visual care/safety readouts, a filter console, and a persistent grid/list switch. The same primitives are used by plant records, care guides, evidence, credits, navigation, and the 404 screen. Plant data, filtering rules, routes, and `src/living-plant/` remain unchanged.

- [Design system and component examples](docs/design-system.md)
- [Round 2 implementation, measurements, and publication report](docs/round-2-report.md)
- [Raw browser/accessibility/Lighthouse reports](docs/audits/)

`src/pages/Library.tsx` owns the library presentation; `src/library/preferences.ts` owns the guarded `rootwise-library-view` storage key. Search/filters still live in the URL. Reset clears those conditions while keeping the chosen view and theme. Only `grid`/`list` and theme are stored locally; storage denial does not prevent use.

With system Chromium installed (or `CHROME_PATH` pointing to your executable):

```sh
npm run verify
npm run test:browser
```

The browser suite starts the production preview on port 4174 if needed. For the mobile Lighthouse runs, keep that preview running:

```sh
npm run preview -- --port 4174 --strictPort
# In another terminal:
npm run audit:mobile
```

Audit outputs are written to `docs/audits/`. Browser screenshots are saved under `/workspace/shared/rootwise-round2/` in the managed environment. The suite documents one inherited desktop hero naming exception rather than silently treating the entire site as conformant.
