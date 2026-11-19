# Third-party notices

Rootwise's original code, written plant content, and original SVG illustrations are MIT licensed; see [LICENSE](LICENSE.txt). Third-party software and fonts retain their own licenses below. Botanical references supply facts and attribution; their text, images, and website assets are not redistributed as Rootwise assets.

## What ships to visitors

| Software or asset                              | Installed version                  | Copyright / attribution                                                  | License and complete notice                                                                                                                      |
| ---------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| React, including the JSX runtime               | 19.3.1                             | Meta Platforms, Inc. and affiliates                                      | MIT · [full text](assets/licenses/React.txt) · [upstream](https://github.com/facebook/react)                                                       |
| React DOM client                               | 19.3.1                             | Meta Platforms, Inc. and affiliates                                      | MIT · [full text](assets/licenses/React-DOM.txt) · [upstream](https://github.com/facebook/react)                                                   |
| Scheduler, bundled by React DOM                | 0.28.0                             | Meta Platforms, Inc. and affiliates                                      | MIT · [full text](assets/licenses/Scheduler.txt) · [upstream](https://github.com/facebook/react)                                                   |
| Vite-generated module-preload helper           | Vite 6.4.6                         | VoidZero Inc. and Vite contributors, 2019–present                        | MIT · [core license](assets/licenses/Vite.txt) · [upstream](https://github.com/vitejs/vite)                                                        |
| Manrope Latin variable font (unmodified WOFF2) | @fontsource-variable/manrope 5.3.0 | Copyright 2019 The Manrope Project Authors; designed by Mikhail Sharanda | SIL Open Font License 1.1 · [complete copyright and license](assets/licenses/Manrope-OFL.txt) · [upstream](https://github.com/sharanda/manrope)    |
| DM Mono Latin Regular font (unmodified WOFF2)  | @fontsource/dm-mono 5.3.0          | Copyright 2020 The DM Mono Project Authors; Colophon Foundry             | SIL Open Font License 1.1 · [complete copyright and license](assets/licenses/DM-Mono-OFL.txt) · [upstream](https://github.com/googlefonts/dm-mono) |

The copied license files retain the upstream copyright notices and full license terms. Font files remain under OFL, including any reserved-name restrictions; the project MIT license does not relicense them. The font packages provide files for self-hosting; no font CDN is contacted at runtime.

The build publishes these complete notices at `assets/licenses/`, alongside `LICENSE.txt` and this notice. React's retained bundle license comments supplement, rather than replace, the full notice files.

## Assets created in this project

`public/assets/mark.svg`, `public/assets/cover.svg`, the SVG artwork in `src/components/PlantArt.tsx`, the living plant SVG, and the inline icons were created for Rootwise. No stock photography, third-party icon set, WebGL assets, or remotely hosted image library is shipped. Repository screenshots depict Rootwise and its bundled fonts; they are project documentation.

## Research references

Plant facts and care guidance cite university extensions, ASPCA, RHS, Kew, Smithsonian Gardens, and research papers. References are documented in [the data review](https://github.com/naumansaeed0/Rootwise/blob/main/docs/data-review.md) and individual profiles. A source link is not a license to republish that source's text or photos. See [the content wording review](https://github.com/naumansaeed0/Rootwise/blob/main/docs/content-review.md) for the scope and limits of the originality check.

## Build/test dependencies

TypeScript, tsx, Playwright, axe, Lighthouse, Vite's other build-time dependencies, and type declarations run during development or verification; their implementation code and test reports are not published in `gh-pages`. Their upstream licenses remain with their packages in `node_modules` and are identifiable through `package-lock.json`. The Vite helper above is listed separately because that small generated helper does ship in the client bundle.

No unclear license was found among the bundled fonts or browser-runtime dependencies reviewed. Recheck this inventory and copy new notices when adding runtime code, photographs, fonts, or other assets.
