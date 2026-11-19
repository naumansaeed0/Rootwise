import { test, expect, type Page } from "@playwright/test";
const group = (page: Page, name: string) =>
  page.getByRole("group", { name, exact: true });
test("existing scientific and alternate search, every filter, reset, and URLs", async ({
  page,
}) => {
  await page.goto("/library.html");
  await expect(page.locator(".specimen-card")).toHaveCount(55);
  await page
    .getByRole("textbox", { name: "Search plants" })
    .fill("SANSEVIERIA");
  await expect(page.locator(".specimen-card h3")).toHaveText(["Snake plant"]);
  await expect(page).toHaveURL(/q=SANSEVIERIA/);
  await page.getByRole("button", { name: "Clear search" }).click();
  await group(page, "Pet safety")
    .getByRole("button", { name: "Pet-friendly", exact: true })
    .click();
  await group(page, "Light")
    .getByRole("button", { name: "Low", exact: true })
    .click();
  await group(page, "Care level")
    .getByRole("button", { name: "Easy", exact: true })
    .click();
  await group(page, "Size")
    .getByRole("button", { name: "Medium", exact: true })
    .click();
  await group(page, "Plant category")
    .getByRole("button", { name: "Foliage plants", exact: true })
    .click();
  await expect(page.locator(".specimen-card h3")).toHaveText([
    "Cast iron plant",
  ]);
  await expect(page.getByRole("status")).toContainText("01 specimen found");
  await expect(page).toHaveURL(/pets=Non-toxic/);
  await page.reload();
  await expect(page.locator(".specimen-card h3")).toHaveText([
    "Cast iron plant",
  ]);
  await page.getByRole("button", { name: "Reset all", exact: true }).click();
  await expect(page.locator(".specimen-card")).toHaveCount(55);
  await expect(page).toHaveURL("/library.html");
  await expect(page.getByRole("button", { name: "Reset all" })).toBeDisabled();
});
test("unverified status, empty result design, and active filter removal", async ({
  page,
}) => {
  await page.goto("/library.html?pets=Unverified");
  await expect(page.locator(".specimen-card")).toHaveCount(3);
  await expect(
    page.locator('.specimen-card [data-status="unknown"]'),
  ).toHaveCount(3);
  await expect(page.locator('.specimen-card [data-status="safe"]')).toHaveCount(
    0,
  );
  await page
    .getByRole("button", { name: "Remove pet safety filter: Unverified" })
    .click();
  await expect(page.locator(".specimen-card")).toHaveCount(55);
  await page
    .getByRole("textbox", { name: "Search plants" })
    .fill("no-such-specimen");
  await expect(
    page.getByRole("heading", { name: /different combination/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset the scan" }).click();
  await expect(page.locator(".specimen-card")).toHaveCount(55);
});
test("grid/list toggle remembers preference across reloads and visits", async ({
  page,
}) => {
  await page.goto("/library.html");
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await expect(page.getByRole("button", { name: "List view" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator("tbody tr")).toHaveCount(55);
  await expect(page.locator(".specimen-card")).toHaveCount(0);
  await page.reload();
  await expect(page.locator("tbody tr")).toHaveCount(55);
  await page.goto("/about.html");
  await page.goto("/library.html?light=Low");
  await expect(page.locator("tbody tr")).toHaveCount(4);
  await page.getByRole("button", { name: "Grid view" }).click();
  await page.reload();
  await expect(page.locator(".specimen-card")).toHaveCount(4);
});
test("view remains usable when storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage unavailable");
      },
    });
  });
  await page.goto("/library.html");
  await page.getByRole("button", { name: "List view" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(55);
  await page.getByRole("button", { name: "Grid view" }).click();
  await expect(page.locator(".specimen-card")).toHaveCount(55);
});
test("narrow screen controls, keyboard actions, and no horizontal page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/library.html");
  const toggle = page.getByRole("button", { name: "Filters", exact: true });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(group(page, "Light")).not.toBeVisible();
  await toggle.click();
  await expect(group(page, "Light")).toBeVisible();
  await group(page, "Light")
    .getByRole("button", { name: "Low", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".specimen-card")).toHaveCount(4);
  await page.getByRole("button", { name: /^Filters/ }).click();
  await expect(group(page, "Light")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Remove light filter: Low" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "List view" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(
    page.getByRole("region", { name: /Specimen records table/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Care guides" })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Good habits.",
  );
});
test("record readouts, theme persistence, reduced motion, and living panel behavior", async ({
  page,
}) => {
  await page.goto("/plant-pothos.html");
  await expect(
    page.getByText("RW–001", { exact: false }).first(),
  ).toBeVisible();
  await expect(page.locator(".detail-intro .ui-readout-value")).toHaveText([
    "Low",
    "Top 2–3 cm dry",
    "Easy",
  ]);
  await expect(
    page.locator('.detail-intro [data-status="caution"]'),
  ).toContainText("Toxic / irritating");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.goto("/");
  await page
    .getByRole("button", { name: "Follow the light: open information panel" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", {
      name: "Follow the light: open information panel",
    }),
  ).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "MOTION REDUCED" }),
  ).toBeDisabled();
  await page.goto("/library.html");
  expect(
    await page
      .locator(".database-results")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
