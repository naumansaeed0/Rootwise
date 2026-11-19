# Final polish report

## README and documentation

The README was rewritten around the finished React/TypeScript/Vite project: live URL, three repository screenshots (home/library dark and a light plant record), features, actual stack, source map, run/build/test commands, full record schema and maintenance steps, Living Plant configuration, design system, nine verification notes, safety limits, quality numbers, publication, licensing, and report links.

`docs/README.md` is the documentation index. Design/data guides and the Round 1/2 reports remain. Lighthouse artifacts moved to `docs/lighthouse/round-2/`, with new final measurements in `docs/lighthouse/current/`. Every retained report/notice/screenshot has an index or document link. No dist, node_modules, secrets, or editor files were tracked; ignore rules were expanded for local artifacts.

## License and content

The project license is **MIT, copyright 2026 naumansaeed0**. Both the public GitHub profile and connected profile return no display name, so the profile handle was used rather than inventing a legal name. The package license field is MIT. Original written plant content and SVG illustrations use that same license unless the owner later changes the policy.

`THIRD_PARTY_NOTICES.md` lists React, React DOM, Scheduler, the Vite-generated module-preload helper (MIT), and the unmodified Manrope/DM Mono fonts (SIL OFL 1.1). Full copyright/license files are retained in `docs/licenses/` and copied into the published site, alongside the project license and notices. No unclear bundled-asset license was found.

The wording review covered 55 descriptions, all care fields, and six guide introductions/sections: **525 fields against 63 accessible cited URLs**. No potential copied/closely matching passage was found using the documented checks; the longest identical run was six ordinary care words. No descriptions/guides were rewritten. This is not an exhaustive originality or legal guarantee; see `content-review.md`.

## Repository and workflow

Remote branches checked: **main and gh-pages only**. No stale branches were present, so none were deleted. History was not rewritten or squashed.

The deployment script now uses a worktree based on the existing gh-pages commit, replaces only published files, and makes a normal fast-forward push. Force-push behavior was removed. The custom Actions workflow is now **manual-trigger only**, with a billing-lock explanation; source pushes no longer spawn failing custom jobs. Existing failed-run history was not erased.

Repository metadata writes were attempted but denied by the GitHub integration with **HTTP 403**. Set these manually in the repository About/settings UI:

- **Description:** An indoor plant field guide with a living SVG plant, 55 searchable specimen records, and evidence-aware care guides. Built with React, TypeScript, and Vite.
- **Website:** https://naumansaeed0.github.io/Rootwise/
- **Topics:** react, typescript, vite, indoor-plants, houseplants, accessibility, svg, github-pages.

The account owner must resolve GitHub billing if custom Actions jobs are wanted. Local `npm run deploy` remains usable; do not dispatch the optional workflow while the lock remains.

## Accessibility and measurements

The only Living Plant edit adds the visible node tag to its accessible name, including **ROOTS**. Its configuration, visuals, and animation/dialog behavior were not changed. The old audit exception was removed.

- **7 unit tests pass.**
- **11 browser/audit tests pass.**
- **32 axe scans report zero violations** across desktop/mobile, both modes, four plant palettes, and library states. Incomplete/manual-review entries remain; full WCAG conformance is not claimed.
- Production build/TypeScript/link checks pass for **62 HTML files and 1,325 local links/assets**, plus published license text integrity and hosting-file allowlisting.
- Final mobile Lighthouse: **home 100/100/100/100, library 99/100/100/100, plant record 99/100/100/100** (performance/accessibility/best practices/SEO). The separate experimental agentic category is 50 on each. These are local simulated lab runs, not real-user or physical-device measurements.
- Solid specimen text contrast remains at least **7.19:1 dark / 5.39:1 light** over all 55 cards.

## Live certificate check

The environment routes HTTPS through a proxy whose issued certificate was observed as `CN=openai.com`, OpenAI, LLC. Curl's configured CA bundle reports **SSL certificate verify ok** and HTTP 200. Direct Node/Playwright requests without the configured proxy attempted unavailable network routes; passing the configured environment proxy to Playwright's HTTPS request client returned **HTTP 200 with certificate verification enabled**.

Default system headless Chromium still returns `ERR_CERT_AUTHORITY_INVALID`; its trust setup does not accept that environment proxy chain. No ignore-HTTPS-errors option, certificate bypass flag, custom browser trust-store modification, or network-policy change was used. Local production browser tests pass. The final live network checks use the correctly configured HTTPS client. The remaining browser-only limitation belongs to this managed execution environment, not a demonstrated failure of GitHub Pages public TLS.

## Publication

The verified site is published to gh-pages without force-pushing. The main source and published branch retain their earlier commits as ancestors. Live response and branch checks are recorded after publication below.
