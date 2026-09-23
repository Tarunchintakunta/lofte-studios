import { expect, test } from "@playwright/test";

/**
 * Two degraded modes the brief treats as non-negotiable: reduced motion, and
 * no JavaScript at all. Both have to leave a complete, readable page — not a
 * skeleton waiting for a timeline that will never run.
 */

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("no GSAP transform is written, and the field is already resolved", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);

    const transformed = await page.$$eval(
      "[data-fragment]",
      (els) => els.filter((el) => (el.getAttribute("transform") ?? "").length > 0).length,
    );
    expect(transformed, "GSAP ran despite prefers-reduced-motion").toBe(0);

    // Every fragment is present and painted.
    const count = await page.locator("[data-fragment]").count();
    expect(count).toBeGreaterThan(40);
    await expect(page.locator("[data-fragment]").first()).toBeVisible();
  });

  test("the method reads as six steps in order, unpinned", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const steps = page.locator("[data-step]");
    await expect(steps).toHaveCount(6);
    for (let i = 0; i < 6; i += 1) {
      await expect(steps.nth(i)).toBeVisible();
    }
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the homepage is complete and the hero field is resolved", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Stories that move brands forward",
    );

    // The signal field ships resolved in the markup.
    const fragments = page.locator("[data-fragment]");
    expect(await fragments.count()).toBeGreaterThan(40);
    const transformed = await page.$$eval(
      "[data-fragment]",
      (els) => els.filter((el) => (el.getAttribute("transform") ?? "").length > 0).length,
    );
    expect(transformed).toBe(0);

    // Every section still renders its content.
    for (const heading of [
      "Six ways a story gets made clear.",
      "A complete content studio, without the usual handoffs.",
      "Selected work.",
      "The Løfte method.",
      "Have a story worth lifting?",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }

    // Nothing is left hidden waiting for a timeline that will never run.
    const hidden = await page.$$eval(
      ".signal-hidden",
      (els) => els.filter((el) => getComputedStyle(el).opacity === "0").length,
    );
    expect(hidden).toBe(0);
  });

  test("work filters are real links and filter the listing", async ({ page }) => {
    await page.goto("/work", { waitUntil: "load" });
    await page.getByRole("link", { name: "Video", exact: true }).click();

    await expect(page).toHaveURL(/capability=video/);
    await expect(page.getByText(/piece(s)? in Video/)).toBeVisible();
  });

  test("navigation and the mobile menu markup are present", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "load" });

    // The panel cannot open without JS, so the primary action must not be
    // buried behind it — the header CTA stays visible at every width.
    await expect(
      page.locator("header").getByRole("link", { name: "Start a project" }),
    ).toBeVisible();

    // And every destination is reachable from the footer.
    for (const label of ["Services", "Selected work", "Our approach", "About"]) {
      await expect(
        page.locator("footer").getByRole("link", { name: label, exact: true }),
      ).toBeVisible();
    }
  });
});
