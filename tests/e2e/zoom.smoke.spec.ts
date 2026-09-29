import { expect, test, type Page } from "@playwright/test";

/**
 * The deliberate zoom moments, each asserted at both ends of its range and in
 * its degraded state. A scale that silently stops scrubbing, or one that keeps
 * firing under reduced motion, looks fine in a screenshot.
 *
 * The portal is the long one: it pins for 180% of a viewport and takes the paper
 * sheet from scale 1 to 45. Both ends of that, the crossfade in the middle, and
 * the fact that it does not exist at all on a phone, are checked below.
 */

/** Horizontal scale factor from an element's computed transform matrix. */
async function scaleOf(page: Page, selector: string): Promise<number> {
  return page.$eval(selector, (el) => {
    const { transform } = getComputedStyle(el);
    if (!transform || transform === "none") return 1;
    return new DOMMatrixReadOnly(transform).a;
  });
}

async function opacityOf(page: Page, selector: string): Promise<number> {
  return page.$eval(selector, (el) => Number(getComputedStyle(el).opacity));
}

/** How far a pin actually holds the visitor — the pin-spacer's extra height. */
async function pinDistance(page: Page, selector: string): Promise<number> {
  return page.$eval(selector, (el) => {
    const spacer = el.parentElement;
    if (!spacer) return 0;
    return spacer.getBoundingClientRect().height - el.getBoundingClientRect().height;
  });
}

/** Document offset of a pinned section's spacer — where its pin begins. */
async function pinTop(page: Page, selector: string): Promise<number> {
  return page.$eval(selector, (el) => {
    const spacer = el.parentElement ?? el;
    return spacer.getBoundingClientRect().top + window.scrollY;
  });
}

async function scrollTo(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  // The portal scrubs at 0.55, so roughly half a second
  // of wall clock is enough to catch up with an instant jump. The margin is
  // generous on purpose — these assert the resting values, not the lag.
  await page.waitForTimeout(750);
}

/** Settle fonts and let ScrollTrigger measure a stable page before sampling. */
async function ready(page: Page) {
  await page.goto("/", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
}

test.describe("with motion allowed", () => {
  test.use({ reducedMotion: "no-preference", viewport: { width: 1440, height: 900 } });

  test("portal: the sheet scales 1 → 45, and does it exponentially", async ({ page }) => {
    await ready(page);
    const top = await pinTop(page, "#feature");
    const distance = await pinDistance(page, "#feature");

    // Sampled at even scroll intervals, so the *shape* of the curve is
    // measurable and not just its endpoints.
    const fractions = [0, 0.15, 0.3, 0.45, 0.62, 0.84];
    const scales: number[] = [];
    for (const fraction of fractions) {
      await scrollTo(page, top + distance * fraction);
      expect(
        Math.abs(await page.$eval("#feature", (el) => el.getBoundingClientRect().top)),
        `section unpinned at ${fraction} of the scrub`,
      ).toBeLessThan(4);
      scales.push(await scaleOf(page, "[data-portal-plane]"));
    }

    expect(scales[0], "the sheet did not start at 1").toBeCloseTo(1, 1);
    expect(scales.at(-1), "the sheet never reached 45").toBeGreaterThan(43);

    // Exponential, not linear: over equal scroll steps each jump must be larger
    // than the one before it. A linear ramp would give identical differences.
    const steps = scales.slice(1).map((value, i) => value - scales[i]);
    for (let i = 1; i < steps.length; i += 1) {
      expect(
        steps[i],
        `step ${i} (${steps[i].toFixed(2)}) was not larger than step ${i - 1} ` +
          `(${steps[i - 1].toFixed(2)}) — the scale is not compounding`,
      ).toBeGreaterThan(steps[i - 1]);
    }
  });

  test("portal: the light field crossfades out as the aperture passes 7 → 13", async ({
    page,
  }) => {
    await ready(page);
    const top = await pinTop(page, "#feature");
    const distance = await pinDistance(page, "#feature");

    // Below the crossfade window the paper is still whole.
    await scrollTo(page, top + distance * 0.45);
    expect(await scaleOf(page, "[data-portal-plane]")).toBeLessThan(7);
    expect(
      await opacityOf(page, ".portal-layer-light"),
      "the sheet started dissolving before the aperture reached 7",
    ).toBeCloseTo(1, 1);

    // Midway it is genuinely mid-fade rather than snapping.
    await scrollTo(page, top + distance * 0.58);
    const mid = await opacityOf(page, ".portal-layer-light");
    expect(mid).toBeGreaterThan(0.05);
    expect(mid).toBeLessThan(0.95);

    // Past it, the room is all there is.
    await scrollTo(page, top + distance * 0.65);
    expect(await scaleOf(page, "[data-portal-plane]")).toBeGreaterThan(13);
    expect(
      await opacityOf(page, ".portal-layer-light"),
      "the sheet was still visible after the aperture passed 13",
    ).toBeCloseTo(0, 1);
    expect(await opacityOf(page, ".portal-ambient")).toBeCloseTo(1, 1);
  });

  test("the portal pin is the length it says it is", async ({ page }) => {
    await ready(page);
    // Deliberately bounded: a pin that overstays reads as a page that has
    // stopped responding.
    const portal = await pinDistance(page, "#feature"); // +=180% of 900
    expect(portal).toBeGreaterThan(1530);
    expect(portal).toBeLessThan(1710);
  });

  test("portal: the room is unreachable by keyboard until it is visible", async ({
    page,
  }) => {
    await ready(page);
    const top = await pinTop(page, "#feature");
    const distance = await pinDistance(page, "#feature");
    const gate = page.locator("#feature [data-room-item]").first().locator("..");

    await scrollTo(page, top);
    await expect(
      gate,
      "the room was tabbable while it was still behind the sheet",
    ).toHaveAttribute("inert", "");

    await scrollTo(page, top + distance * 0.8);
    await expect(gate, "the room never became reachable").not.toHaveAttribute(
      "inert",
      "",
    );

    // …and closes again on the way back up, rather than latching open.
    await scrollTo(page, top);
    await expect(gate).toHaveAttribute("inert", "");
  });

  test("portal: the intro reads at the start and the room reads at the end", async ({
    page,
  }) => {
    await ready(page);
    const top = await pinTop(page, "#feature");
    const distance = await pinDistance(page, "#feature");

    await scrollTo(page, top);
    await expect(
      page.getByRole("heading", { name: "The work, brought into focus." }),
    ).toBeInViewport({ ratio: 0.99 });

    await scrollTo(page, top + distance * 0.95);
    const room = page.getByRole("heading", { name: "Built for clarity under scrutiny." });
    await expect(room).toBeInViewport({ ratio: 0.99 });
    await expect(page.getByText(/boardroom projector/)).toBeInViewport({ ratio: 0.99 });
    // Both routes into the work are live: the call to action and the frame.
    // Distinct names, so a link list does not read the same phrase twice.
    await expect(
      page.locator("#feature").getByRole("link", { name: "See selected work" }),
    ).toBeVisible();
    await expect(
      page.locator("#feature").locator("[data-feature-frame] a"),
    ).toBeVisible();
  });

  test("for: every audience is a link to a service that exists", async ({
    page,
    request,
  }) => {
    await page.goto("/", { waitUntil: "load" });
    const hrefs = await page.$$eval("[data-audience]", (els) =>
      els.map((el) => el.getAttribute("href") ?? ""),
    );

    expect(hrefs.length).toBeGreaterThan(5);
    for (const href of hrefs) {
      expect(href, "an audience linked nowhere").toMatch(/^\/services\/.+/);
      expect((await request.get(href)).ok(), `${href} did not resolve`).toBe(true);
    }
  });

  test("work card: media grows to 1.04 on hover and on keyboard focus", async ({
    page,
  }) => {
    await page.goto("/work", { waitUntil: "load" });
    const card = page.locator(".media-frame").first();
    const plate = ".media-frame:first-of-type .media-zoom";

    expect(await scaleOf(page, plate)).toBeCloseTo(1, 2);

    await card.hover();
    await page.waitForTimeout(800);
    expect(await scaleOf(page, plate), "hover did not zoom the media").toBeCloseTo(
      1.04,
      2,
    );

    // Keyboard users get the same state, not a hover-only affordance.
    await page.mouse.move(0, 0);
    await page.waitForTimeout(800);
    await card.focus();
    await page.waitForTimeout(800);
    expect(await scaleOf(page, plate), "focus did not zoom the media").toBeCloseTo(
      1.04,
      2,
    );
  });

  test("work card: the zoom is clipped and never widens the page", async ({ page }) => {
    await page.goto("/work", { waitUntil: "load" });
    await page.locator(".media-frame").first().hover();
    await page.waitForTimeout(800);

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});

test.describe("narrow viewport", () => {
  test.use({ reducedMotion: "no-preference", viewport: { width: 375, height: 812 } });

  test("the portal does not pin on a phone, and reads in full", async ({ page }) => {
    await ready(page);

    for (const id of ["#feature"]) {
      const sectionTop = await page.$eval(
        id,
        (el) => el.getBoundingClientRect().top + window.scrollY,
      );

      await scrollTo(page, sectionTop - 200);
      const before = await page.$eval(id, (el) => el.getBoundingClientRect().top);
      await scrollTo(page, sectionTop + 200);
      const after = await page.$eval(id, (el) => el.getBoundingClientRect().top);

      // A pinned section would hold its position; these must move with the page.
      expect(before - after, `${id} pinned on mobile`).toBeGreaterThan(300);
    }

    // The sheet is not rendered at all, so nothing can hide the room behind it.
    await expect(page.locator("[data-portal-plane]")).toBeHidden();
    await expect(
      page.getByRole("heading", { name: "Built for clarity under scrutiny." }),
    ).toBeVisible();
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });

  test("no zoom anywhere — portal or card", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(1200);

    const sectionTop = await page.$eval(
      "#feature",
      (el) => el.getBoundingClientRect().top + window.scrollY,
    );
    await scrollTo(page, sectionTop + 300);
    expect(await scaleOf(page, "[data-portal-plane]")).toBeCloseTo(1, 2);
    expect(
      await opacityOf(page, ".portal-layer-light"),
      "the light field faded with motion turned off",
    ).toBeCloseTo(1, 2);

    // The room content is not left waiting on a timeline that will never run.
    const hidden = await page.$$eval(
      "[data-room-item]",
      (els) => els.filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length,
    );
    expect(hidden, "room content stayed hidden under reduced motion").toBe(0);

    await page.goto("/work", { waitUntil: "load" });
    await page.locator(".media-frame").first().hover();
    await page.waitForTimeout(500);
    expect(
      await scaleOf(page, ".media-frame:first-of-type .media-zoom"),
      "the card still zoomed under reduced motion",
    ).toBeCloseTo(1, 2);
  });

  test("the audiences read as a row of links", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const items = page.locator("[data-audience]");
    const count = await items.count();
    expect(count).toBeGreaterThan(5);

    // A scrolling row: every card is attached, the first is on screen.
    await expect(items.first()).toBeVisible();

    // No pin-spacer was ever built, so nothing is holding anyone anywhere.
    // (`pinDistance` cannot answer this: with no spacer it measures the section
    // against `<main>` and returns the rest of the page.)
    for (const id of ["#feature"]) {
      expect(
        await page.$eval(
          id,
          (el) => el.parentElement?.classList.contains("pin-spacer") ?? false,
        ),
        `${id} was pinned under reduced motion`,
      ).toBe(false);
    }
  });
});
