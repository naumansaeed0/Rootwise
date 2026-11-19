# Rootwise Round 2 report

## 1. What changed, page by page

- **Plant Library:** a specimen database with stable catalogue IDs, original SVG illustrations, shared light/water/care/safety readouts, and a filter console. Four segmented filter groups replace the dropdowns; category controls remain available with the same seven categories. Applied conditions can be removed individually. Results announce their count, enter with a restrained transition, and have a designed zero-match state. Grid and semantic table views share the same records.
- **Plant records:** the same code and readout components as the collection, bracketed illustration/safety/prose panels, numbered care/problem/benefit/related/source sections, and consistent metadata treatment. Botanical text is unchanged.
- **Care guides:** indexed protocol cards, a common page intro, instrument-style topic navigation, and shared reading panels. Guide content and hash links are unchanged.
- **Benefits:** an evidence-file introduction, shared evidence panels and numbered labels; the evidence and claims remain unchanged.
- **About/credits:** numbered field-note panels and the shared page intro. The privacy note now acknowledges the saved library-view preference.
- **404:** a shared bracketed panel and a record-not-located label, preserving return links and the existing static-host base behavior.
- **Navigation/footer:** technical index labels, current-page keylines, shared readout typography, and improved footer contrast. Mobile navigation behavior is retained, with an explicit `aria-controls` relationship.
- **Home:** the header/footer, supporting section headings, and featured cards use the common system. **`src/living-plant/` is unchanged**, including its SVG, content, timings, motion behavior, and focus/dialog logic.

## 2. Shared design system

The implementation and usage examples are in [design-system.md](design-system.md).

| Location                              | Responsibility                                                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `src/styles/system.css`               | Surface/text aliases, spacing/type scale, radius/brackets, status colors, focus/motion tokens, and shared primitives |
| `src/components/ui/Instrument.tsx`    | Panel, ReadoutLabel, PageIntro, SectionHeading, ToggleGroup, Meter, SafetyStatus                                     |
| `src/components/ui/PlantReadouts.tsx` | Specimen code, watering-text summary, and the exact readouts shared by cards/records                                 |
| `src/styles/instruments.css`          | Responsive application of that system to every page                                                                  |
| `src/pages/Library.tsx`               | Collection presentation and control layout                                                                           |
| `src/library/preferences.ts`          | Guarded grid/list storage                                                                                            |

The existing canopy/forest/desert/bloom variables remain the color source. Solid surfaces and scoped aliases inherit both mode and plant accent. Safety states have explicit light-mode colors and are distinguished by text and symbols, not color alone. New interaction states are available on keyboard focus as well as hover.

## 3. Library behavior and preserved contracts

- Search still matches common, scientific, and alternate names through the **unchanged** `filterPlants` function. All filters continue to combine with AND semantics.
- Existing `q`, `light`, `difficulty`, `pets`, `size`, and `category` parameters are read/written exactly as before. Plant and guide URLs are unchanged.
- “Any” clears a segmented group; category has “All plants.” Reset clears the search and every condition. Applied conditions have explicit removal buttons. The result count uses a live region **around** a real H2, retaining heading semantics.
- Grid/list is the only new persisted preference, using `rootwise-library-view`; only `grid` and `list` are accepted. Reset preserves view and theme. Search/filters remain in the URL, and panel expansion remains transient. Denied or corrupt storage falls back safely.
- Wide screens place the console beside the collection. At tablet widths it moves above the results and can collapse; phones use a single readable card column. The list is a semantic table within a named, keyboard-focusable horizontal scroll region.
- Catalogue IDs derive from the unchanged original dataset order, so filtering never renumbers plants. Water readouts summarize existing advice, not invented daily/weekly schedules. Unknown water-text patterns fall back to the full record and are checked by tests.
- The result wrapper uses a brief opacity/translation entrance. At least one row is reserved. Record order is unchanged; no sort/reordering feature was added.

## 4. Measured performance and accessibility

### Lighthouse mobile

Measured against the final prerendered production build on a local static Vite preview. **Lighthouse 13.6.0, headless Chromium 156, simulated mobile throttling: 150 ms RTT, 1638.4 Kbps throughput, 4× CPU slowdown.** These are single lab runs, not field data or a physical-device benchmark. The final raw JSON and HTML reports are committed under `docs/audits/`.

| Page    | Performance | Accessibility | Best practices | SEO | Experimental agentic browsing |
| ------- | ----------: | ------------: | -------------: | --: | ----------------------------: |
| Home    |         100 |           100 |            100 | 100 |                            50 |
| Library |          97 |           100 |            100 | 100 |                            50 |
| Plant   |          99 |           100 |            100 | 100 |                            50 |

The experimental agentic category penalizes the lack of llms.txt and an ARD manifest. Those features were not requested and were not added to inflate a score. Standard Lighthouse category results are listed separately.

| Page    |   LCP | Total blocking time |   CLS |
| ------- | ----: | ------------------: | ----: |
| Home    | 1.8 s |               50 ms | 0.002 |
| Library | 1.9 s |              180 ms | 0.001 |
| Plant   | 2.0 s |               10 ms | 0.001 |

The library’s 55 illustrations and full static dataset still cost more main-thread work than the other pages. The client bundle is approximately 103 KB gzip and CSS 13 KB gzip; fonts total approximately 40 KB. Cards use no backdrop-filter, heavy blur, event-driven pointer loop, or animation library. Offscreen rendering can be deferred through content-visibility, with ordinary-grid fallback. Lighthouse still identifies render-blocking/dependency/reflow opportunities; a high score is not proof that no work remains.

### Tests and audits

- **7 unit tests pass:** existing dataset/search/filter/safety invariants plus stable specimen IDs, water summary coverage, and view-storage validation/failure handling.
- **11 browser tests pass:** six behavior tests, desktop axe audits for both themes, mobile axe audits for both themes, and responsive screenshot/overflow checks. They cover every filter, reset, parameter refresh, unverified safety, no matches, individual condition removal, view persistence across navigation/reload, denied storage, keyboard actions, mobile navigation, exact record readouts, theme persistence, reduced motion, and existing hero dialog Escape/focus restoration.
- **32 axe scans:** 11 routes/record palettes × 2 themes on desktop, plus 5 states × 2 themes on mobile. The new library is checked collapsed, expanded, and in table view. **30 scans have zero violations. The two desktop home scans retain one identical pre-existing issue each.**
- **Known protected issue:** visible “ROOTS” is not included in the accessible name “Start beneath the surface: open information panel” (`label-content-name-mismatch`, `.node-roots`). The hard constraint prohibits modifying the Living Plant, so this issue is deliberately retained and reported. The test asserts this exact target/rule; it does not disable the rule globally or remove the finding from raw output.
- Axe also retains incomplete color-contrast/manual-review results, including SVG and deferred content. Automated audits do not certify WCAG conformance.
- A separate solid-surface text contrast check covers **all 55 cards in both themes**, including the four plant palettes. Minimum checked ratio: **7.19:1 dark, 5.39:1 light**, exceeding the 4.5:1 normal-text threshold for those surfaces. SVG art/gradient regions are outside this solid-surface check.
- **390 × 844 and 1440 × 1000** browser viewports: page overflow checks across home, library, record, guides, benefits, About, and 404; screenshots of home/library/record. The table contains its horizontal overflow. Additional desktop grid/list/light screenshots were saved for review.
- TypeScript, static prerender, and verification of **62 HTML pages / 1,325 local links and assets** pass. A direct diff confirms `src/data/plants.json`, `src/data/plants.ts`, and `src/living-plant/` are unchanged.

### Issues fixed from measurement

The initial audits found low-contrast home guide captions, footer text, and record metadata labels. These were corrected outside the protected hero. Lighthouse also caught the live result count losing its heading role; it now uses a separate status wrapper around its real H2. The first library accessibility score was 98; the final result is 100. Browser tests also exposed a test-environment theme assumption, which was made explicit in the harness.

## 5. Visual choices and tradeoffs

The library now reads as a collection of living specimens rather than retail products: original dataset IDs, technical labels, orbital study frames, compact readouts, restrained corner marks, and clear state indicators. Editorial pages use those same primitives rather than introducing separate visual metaphors. Light mode remains a fully designed pale-green instrument surface.

No WebGL, pointer parallax engine, complex card FLIP system, or blur per card was added. A simple border/illustration emphasis works for mouse and keyboard, and every datum is visible without hovering. These are deliberate performance/accessibility choices, not stack limitations. Filtering fades the result region rather than performing elaborate per-record motion. Reduced motion disables the new animation and transforms.

## 6. Publication

The source is pushed to `main`, and only the verified `dist/` output is published directly to `gh-pages`. The requested URL remains **https://naumansaeed0.github.io/Rootwise/**, with the redesigned collection at **https://naumansaeed0.github.io/Rootwise/library.html**. The blocked custom Actions workflow is not relied upon for this publication.

Publication and live-response confirmation are recorded after deployment. Repository Pages settings remain branch-based (`gh-pages`, `/ (root)`). The account billing lock still needs owner attention if automatic source builds are wanted.

## 7. Limitations and explicit deviations

1. **Protected hero accessibility exception:** the pre-existing desktop ROOTS label/name mismatch remains because the Living Plant may not be changed. Full site-wide AA conformance is not claimed.
2. **Audits are lab measurements.** No physical-phone thermal, GPU, battery, or assistive-technology testing was performed. Axe incomplete/manual-review entries remain in raw reports.
3. **Water summary text is an explicit presentation mapping.** If future data wording changes, update the mapping; its fallback/test prevents silently inventing guidance. The data itself was not changed.
4. **Codes follow dataset order.** A permanent independent identifier would require an authorized data-schema change.
5. **Legacy base CSS remains.** The shared primitives and new application layouts are centralized, but the original base stylesheet is retained to protect the established hero and layouts. A later cleanup could remove unused catalogue selectors.
6. **All plant data still ships to the browser.** With measured library performance 97, splitting the bundle was not necessary for this visual redesign. It remains a possible later optimization.
7. **No new sort mode or elaborate reordering motion.** Original record order and filtering behavior are preserved. New result transitions prioritize stability and reduced motion.
8. **Source automation remains blocked by GitHub billing.** Direct branch publication is implemented and used as instructed.

Next improvements would be permission to correct the isolated hero accessible name, physical-device/screen-reader review, and selective cleanup/splitting guided by further measurement.
