import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
const routes = [
  "index.html",
  "library.html",
  "plant-pothos.html",
  "plant-snake-plant.html",
  "plant-african-violet.html",
  "plant-boston-fern.html",
  "guides.html",
  "guides.html#light",
  "benefits.html",
  "about.html",
  "404.html",
];
for (const theme of ["dark", "light"])
  test(`WCAG AA audit: ${theme}, all sections and four plant palettes`, async ({
    page,
  }) => {
    await page.addInitScript(
      (t) => localStorage.setItem("rootwise-theme", t),
      theme,
    );
    const results = [];
    for (const route of routes) {
      await page.goto("/" + route);
      await page.evaluate(() => document.fonts.ready);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      results.push({
        route,
        theme,
        violations: result.violations,
        passes: result.passes.length,
        incomplete: result.incomplete.map((r) => ({
          id: r.id,
          nodes: r.nodes.length,
        })),
      });
    }
    await mkdir("docs/audits", { recursive: true });
    await writeFile(
      `docs/audits/axe-${theme}.json`,
      JSON.stringify(results, null, 2),
    );
    const violations = results.flatMap((r) =>
      r.violations.map((v) => ({
        route: r.route,
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    );
    // The user explicitly protects src/living-plant/. Keep this inherited
    // visible ROOTS / accessible-name mismatch in the raw report and assert its
    // exact shape instead of suppressing that rule across the site.
    const expected = [
      {
        route: "index.html",
        id: "label-content-name-mismatch",
        target: ".node-roots",
      },
    ];
    const unexpected = violations.filter(
      (v) =>
        !expected.some(
          (e) =>
            e.route === v.route &&
            e.id === v.id &&
            v.nodes.length === 1 &&
            v.nodes[0].target[0] === e.target,
        ),
    );
    expect(unexpected, JSON.stringify(unexpected, null, 2)).toEqual([]);
    expect(
      violations.filter((v) => v.id === "label-content-name-mismatch"),
    ).toHaveLength(1);
  });
test("responsive screenshots and overflow checks", async ({ page }) => {
  await mkdir("/workspace/shared/rootwise-round2", { recursive: true });
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    for (const route of [
      "index.html",
      "library.html",
      "plant-pothos.html",
      "guides.html",
      "benefits.html",
      "about.html",
      "404.html",
    ]) {
      await page.goto("/" + route);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${viewport.width}px`,
      ).toBe(true);
      if (["index.html", "library.html", "plant-pothos.html"].includes(route))
        await page.screenshot({
          path: `/workspace/shared/rootwise-round2/${route.replace(".html", "")}-${viewport.width}.png`,
          fullPage: false,
        });
    }
  }
});

for (const theme of ["dark", "light"])
  test(`Mobile WCAG AA: ${theme}, collapsed/expanded filters, list, plant, home`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(
      (t) => localStorage.setItem("rootwise-theme", t),
      theme,
    );
    const results: Array<{
      state: string;
      theme: string;
      violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"];
      passes: number;
      incomplete: { id: string; nodes: number }[];
    }> = [];
    const scan = async (state: string) => {
      const r = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      results.push({
        state,
        theme,
        violations: r.violations,
        passes: r.passes.length,
        incomplete: r.incomplete.map((v) => ({
          id: v.id,
          nodes: v.nodes.length,
        })),
      });
    };
    await page.goto("/library.html");
    await scan("library-collapsed");
    await page.getByRole("button", { name: "Filters", exact: true }).click();
    await scan("library-expanded");
    await page.getByRole("button", { name: "List view" }).click();
    await scan("library-list");
    await page.goto("/plant-pothos.html");
    await scan("plant");
    await page.goto("/");
    await scan("home");
    await writeFile(
      `docs/audits/axe-mobile-${theme}.json`,
      JSON.stringify(results, null, 2),
    );
    expect(results.flatMap((r) => r.violations)).toEqual([]);
  });
