# Current verification evidence

- [Full browser suite](browser-tests.json): 11 tests, including keyboard/state behavior and responsive checks.
- [Desktop axe — dark](axe-dark.json), [light](axe-light.json): 11 pages/palettes per theme.
- [Mobile axe — dark](axe-mobile-dark.json), [light](axe-mobile-light.json): five states per theme.
- [Solid specimen text contrast](specimen-contrast.json): all 55 cards in both themes.
- [Content wording review](content-review.json): summary of comparisons against cited sources.
- [Live publication checks](live-check.json): exact production-file comparisons over certificate-validated HTTPS.
- [Certificate checks](certificate-check.json): default headless trust failure and successful verified retrieval through the configured environment proxy; certificate checks remain enabled.

The ROOTS naming exception from Round 2 is removed. Current axe results require zero violations; incomplete/manual-review results remain visible in the JSON. Automated checks do not establish full WCAG conformance.

Lighthouse has its own [current/historical index](../lighthouse/README.md). Publication results and environment limitations are described in the [final-polish report](../final-polish-report.md).
