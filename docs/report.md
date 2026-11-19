# Rootwise implementation report

## What was built

- **Home:** a botanical interface with oversized typography, orbital linework, a luminous hand-built SVG plant, scroll-growing roots/stems, four interactive care/safety nodes, auto-explore controls, featured plants, guide entry points, and an evidence-page introduction.
- **Library:** 55 illustrated cards; search by common, scientific, and alternate names; filters for light, difficulty, pet safety, size, and category; combined filters, result count, empty state, reset, and shareable query parameters.
- **Plant profiles:** 55 build-generated static detail pages with botanical names, family, origin, description, eight care fields, difficulty/size/light labels, cat/dog and child-handling safety, general benefits, three common problems/fixes, related species/cultivars, sources, and visible verification notes.
- **Care guides:** six evergreen articles on watering, light, humidity, repotting, pests, and low-light spaces. Hash links open the requested guide, with a topic navigation rail.
- **Benefits:** an evidence-aware explanation of possible wellbeing benefits, limitations of studies, and why a few potted plants do not meaningfully purify indoor air.
- **About:** source policy, source links, privacy, safety disclaimer, illustration/font credits, and every outstanding data flag.
- **404:** a custom return-to-library screen; its explicit project base also handles unknown nested URLs.

## Technical choices

Your message permitting React + TypeScript + Vite supersedes the uploaded prompt’s plain-JavaScript restriction. The site uses those tools with no backend. React and fonts are bundled; no runtime CDN is used. Native CSS, SVG, browser dialogs, requestAnimationFrame, and IntersectionObserver provide the effects. There is no WebGL, GSAP, stock photography, CMS, account system, or visitor editing.

Source lives in `src/`, articles and botanical records in `src/data/`, reusable SVGs in `src/components/`, the isolated signature feature in `src/living-plant/`, and global design tokens in `src/styles/`. The JSX/CSS/JSON is formatted for maintenance. Build and publication helpers are separate in `scripts/`.

`src/entry-server.tsx` renders the same page templates during the build. `scripts/prerender.mjs` writes **62 HTML files**, including 55 distinct plant profiles. `plant-pothos.html` is the canonical form: each species gets its own metadata, real HTML content, and a shareable URL that refreshes on GitHub Pages. The data generates these files; they are not manually maintained. The query form `plant.html?slug=pothos` remains supported by JavaScript as a compatibility path. Main sections are flat HTML files, and guides use `guides.html#watering`-style fragments.

Vite’s `base: './'` keeps assets relative. A generated sitemap includes section and plant URLs. Each static page has a unique title, description, Open Graph metadata, and canonical link; the 404 and compatibility shell are noindex. The build also creates robots.txt, .nojekyll, and bundled font-license notices.

## Living plant internals and edit points

`src/living-plant/config.ts` is the adjustment surface:

- **Structure:** `stems`/`roots` are paths in a 900 × 900 SVG coordinate system; `leaves` defines attachment, scale, and angle.
- **Content:** `plantNodes` contains positions, labels, accessible names, panel text, and guide links.
- **Speed:** `growthConfig.autoScrollPixelsPerSecond` controls auto exploration. `.living-section` height in CSS controls the manual scroll distance.
- **Growth/thickness:** `initialStem`, `initialRoot`, `minStroke`, and `maxStroke` control initial drawing and the thickness range.
- **Look:** `--hero-leaf-*`, `--hero-edge`, `--hero-vein`, `--hero-stem`, and `--root` in CSS. The leaf silhouette/veins are in the SVG renderer. Mobile node positioning has explicit CSS overrides.

A passive scroll listener schedules one frame, reads the section rectangle once, and writes normalized SVG stroke offsets, thickness, and leaf opacity without rerendering React on each scroll. IntersectionObserver gates updates offscreen. Stroke width is deliberately animated to satisfy the growing-thicker requirement; unlike transforms/opacity, SVG stroke changes can require painting. The artwork stays bounded and simple rather than simulating a complex botanical system.

Each node is a real keyboard-focusable button. A native modal dialog traps focus, supports Escape, closes on its backdrop or close button, and restores focus to the triggering node. Auto exploration stops on wheel/touch/pointer/key input, backgrounding the tab, or completing the growth section. Reduced motion shows the complete static plant and disables auto exploration.

## Themes and visual direction

Default mode follows system preference and updates with it until an explicit choice is made. The theme toggle remembers the choice locally and works if persistence is unavailable. A head script applies the selected mode before the stylesheet paints.

The design uses deep forest surfaces, lime accents, fine technical labels, expressive Manrope typography, a dotted coordinate field, orbital guides, restrained glows, and original leaf/root artwork. Light mode uses pale green surfaces and darker text/accent colors. Plants carry `canopy`, `forest`, `desert`, or `bloom` palettes applied through scoped CSS variables; cards and detail pages change art and accent together. Explicit light variants keep the per-plant accent legible.

This uses the organic/scientific principles of the brief, without reproducing a particular Dribbble design. The result is a stylized living field instrument, not a 3D render. No custom cursor, canvas particle simulation, or elaborate parallax was added: those were optional and would add interaction/performance cost without improving the main reference task. Illustrations are decorative, not accurate species identification plates.

## Botanical content

**55 profiles, seven categories, six guides.** All 55 primary source links were reachable during review. Four profiles use clearly labeled genus-level background sources and remain flagged. The reference list, exact open issues, and source-access summary are in `docs/data-review.md` and `docs/source-checks.json`.

The nine flagged profiles are:

1. Peace lily — genus-level care source; species-level details need direct review.
2. Velvet-leaf philodendron — genus-level care source; species-level details need direct review.
3. Chinese evergreen — genus-level care source; species-level details need direct review, with a Kew identity link provided.
4. Elephant ear — hybrid nomenclature/parentage and nursery labels need taxonomic review.
5. Prayer plant — exact cat/dog safety not confirmed; labeled Unverified.
6. Chinese money plant — exact cat/dog safety not confirmed; labeled Unverified.
7. Christmas cactus — nursery identity can be confused with Thanksgiving cactus.
8. Maidenhair fern — exact cat/dog safety not confirmed; labeled Unverified.
9. Moth orchid — genus-level care source; species-level details need direct review, with Smithsonian care and ASPCA genus safety links provided.

The three Unverified safety labels never pass the pet-friendly filter. Source access is not presented as complete fact validation. Some care paragraphs and benefit statements are shared by suitable care groups; difficulty and indoor size labels are practical editorial estimates. A professional botanical/toxicological review is still a worthwhile next step.

## Verification

- Four data/filter tests pass, covering schema completeness/flags, scientific and alternate-name search, combined filters, and safety exclusions.
- TypeScript checks and the production build pass.
- The production check verifies 62 rendered HTML pages, 55 unique plant titles, all local links and assets, crawler files, font licenses, and the nested-404 project base.
- All 55 primary source URLs were reachable after broken species URLs were replaced with explicitly labeled genus/hybrid references.
- The managed preview relay failed to open the browser port, so checks continued against the published GitHub Pages site. Live Chrome checks passed for alternate-name search, combined pet/light filters, plant detail links and refresh, guide deep links, theme switching/persistence, mobile navigation, and native dialog Escape/focus restoration. Desktop and narrow-window layouts were inspected; a narrow-screen spacing issue was corrected. Automated accessibility scans, Lighthouse scores, and physical-phone smoothness remain unverified. No 90+ score is claimed.

## Deployment

The source is prepared for `naumansaeed0/Rootwise`, with `main` containing source and `gh-pages` containing only the generated site. `.github/workflows/deploy.yml` builds and publishes on each push to main and supports manual dispatch. It requests `contents: write`, serializes publication, and runs tests/build/link checks before updating the generated branch. `npm run deploy` provides a verified manual publishing fallback.

**Publication result:** Source was pushed to main and the verified static build was published directly to gh-pages. The public site at https://naumansaeed0.github.io/Rootwise/ returned HTTP 200 and rendered successfully in Chrome. The Actions workflow exists, but run 44476191201 was refused before any step started: GitHub reported “The job was not started because your account is locked due to a billing issue.” This is an account-level blocker, not a failed site build. Resolve the GitHub billing lock and rerun the workflow to restore automatic publication.

The GitHub integration denied Pages administration with HTTP 403, so its settings could not be confirmed through the API. The site nevertheless served the published build successfully. Check the branch/source settings below if hosting stops or future updates do not appear.

Repository settings, if not already enabled:

- Settings → Pages → Source: **Deploy from a branch** → **gh-pages** → **/ (root)**.
- If workflow writes are denied: Settings → Actions → General → Workflow permissions → **Read and write permissions**. Organization policy can override workflow permissions.

## Remaining improvements

Automated accessibility and performance audits remain outstanding. Next priorities are a real mobile performance audit, species-specific botanical/safety review of flagged records, more plant-specific problem guidance and illustrations, and user-owned photographs if desired. The initial JavaScript bundle includes the whole static plant dataset; splitting library/detail data could reduce the first load on slow devices if measurement justifies it. No analytics or external application integrations are installed.
