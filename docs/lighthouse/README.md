# Lighthouse mobile reports

Reports use simulated mobile throttling against a local production preview. Scores are lab observations, not real-user/physical-phone measurements. Raw JSON retains all categories, metrics, warnings, and manual audit entries.

| Page         | Current HTML                                   | Current JSON                                   | Round 2 HTML                                   | Round 2 JSON                                   |
| ------------ | ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| Home         | [HTML](current/lighthouse-home.report.html)    | [JSON](current/lighthouse-home.report.json)    | [HTML](round-2/lighthouse-home.report.html)    | [JSON](round-2/lighthouse-home.report.json)    |
| Library      | [HTML](current/lighthouse-library.report.html) | [JSON](current/lighthouse-library.report.json) | [HTML](round-2/lighthouse-library.report.html) | [JSON](round-2/lighthouse-library.report.json) |
| Plant record | [HTML](current/lighthouse-plant.report.html)   | [JSON](current/lighthouse-plant.report.json)   | [HTML](round-2/lighthouse-plant.report.html)   | [JSON](round-2/lighthouse-plant.report.json)   |

[Current summary](current/lighthouse-summary.json) · [Round 2 summary](round-2/lighthouse-summary.json).

Run `npm run audit:mobile` with the production preview on port 4174. The script writes to `docs/lighthouse/current/`; the Round 2 snapshot is retained unchanged for the historical report.
