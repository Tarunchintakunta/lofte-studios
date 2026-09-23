import { expect, test, type Page } from "@playwright/test";

/**
 * The three deliberate zoom moments, each asserted at both ends of its range
 * and in its degraded state. A scale that silently stops scrubbing, or one
 * that keeps firing under reduced motion, looks fine in a screenshot.
 */

/** Horizontal scale factor from an element's computed transform matrix. */
async function scaleOf(page: Page, selector: string): Promise<number> {
  return page.$eval(selector, (el) => {
    const { transform } = getComputedStyle(el);
    if (!transform || transform === "none") return 1;
    return new DOMMatrixReadOnly(transform).a;
  });
}

/** How far the pin actually holds the visitor — the pin-spacer's extra height. */
async function pinDistance(page: Page): Promise<number> {
  return page.$eval("#feature", (el) => {
    const spacer = el.parentElement;
    if (!spacer) return 0;
    return spacer.getBoundingClientRect().height - el.getBoundingClientRect().height;
  });
}

async function scrollTo(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  // Two frames: one for the scroll, one for ScrollTrigger's scrub to catch up.
  await page.waitForTimeout(500);
}

test.describe("with motion allowed", () => {
  test.use({ reducedMotion: "no-preference", viewport: { width: 1440, height: 900 } });

  test("hero: the field settles from an oversized start to exactly 1", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(150);

    const early = await scaleOf(page, "[data-signal-frame] svg");
    expect(early, "the hero plate never started oversized").toBeGreaterThan(1.01);
    expect(early, "the hero start is outside the 1.08–1.12 brief").toBeLessThanOrEqual(
      1.12,
    );

    await page.waitForTimeout(3000);
    const settled = await scaleOf(page, "[data-signal-frame] svg");
    expect(settled).toBeCloseTo(1, 2);
  });

  test("feature: the frame scrubs 0.86 → 1.03 while the section is pinned", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);

    const sectionTop = await page.$eval(
      "#feature",
      (el) => el.getBoundingClientRect().top + window.scrollY,
    );

    // At the top of the pin the frame is at its smallest.
    await scrollTo(page, sectionTop);
    const atStart = await scaleOf(page, "[data-feature-frame]");
    expect(atStart).toBeGreaterThan(0.84);
    expect(atStart).toBeLessThan(0.93);

    const pinnedTop = await page.$eval(
      "#feature",
      (el) => el.getBoundingClientRect().top,
    );
    expect(Math.abs(pinnedTop), "section did not pin to the top").toBeLessThan(4);

    const distance = await pinDistance(page);

    // Halfway through the pin it is still pinned, and larger.
    await scrollTo(page, sectionTop + distance * 0.5);
    const midTop = await page.$eval("#feature", (el) => el.getBoundingClientRect().top);
    expect(Math.abs(midTop), "section unpinned partway through").toBeLessThan(4);

    const atMid = await scaleOf(page, "[data-feature-frame]");
    expect(atMid, "the frame did not grow during the scrub").toBeGreaterThan(atStart);

    // By the end of the pin it has reached the top of the range.
    await scrollTo(page, sectionTop + distance * 0.99);
    const atEnd = await scaleOf(page, "[data-feature-frame]");
    expect(atEnd).toBeGreaterThan(atMid);
    expect(atEnd, "the frame exceeded the 1.03 cap").toBeLessThanOrEqual(1.035);
  });

  test("feature: the pin is short — well under two viewports", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    // The pin-spacer's extra height is how long the visitor is held.
    const extra = await page.$eval("#feature", (el) => {
      const spacer = el.parentElement;
      if (!spacer) return 0;
      return spacer.getBoundingClientRect().height - el.getBoundingClientRect().height;
    });
    expect(extra, "nobody should be trapped for more than a viewport").toBeLessThan(900);
  });

  test("feature: the copy stays readable at every point in the scrub", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load" });
    const sectionTop = await page.$eval(
      "#feature",
      (el) => el.getBoundingClientRect().top + window.scrollY,
    );

    // Sample inside the pin. Past its end the section scrolls away like any
    // other, and testing there would prove nothing about the scrub.
    const distance = await pinDistance(page);
    expect(distance).toBeGreaterThan(100);

    for (const fraction of [0, 0.35, 0.7, 0.98]) {
      await scrollTo(page, sectionTop + distance * fraction);

      // Still pinned at this point in the scrub.
      const top = await page.$eval("#feature", (el) => el.getBoundingClientRect().top);
      expect(Math.abs(top)).toBeLessThan(4);

      // Heading, standfirst, supporting line and the placeholder label all
      // have to be on screen — not just the ones above the fold.
      await expect(
        page.getByRole("heading", { name: /One story, cut for/ }),
      ).toBeInViewport({ ratio: 0.99 });
      await expect(page.getByText(/survive a boardroom projector/)).toBeInViewport({
        ratio: 0.99,
      });
      await expect(page.getByText(/one edit, not three/)).toBeInViewport({ ratio: 0.99 });
      await expect(page.getByText(/abstract composition from L/)).toBeInViewport({
        ratio: 0.99,
      });
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

  test("feature: no pin on mobile, and the frame ends at 1", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);

    const sectionTop = await page.$eval(
      "#feature",
      (el) => el.getBoundingClientRect().top + window.scrollY,
    );

    await scrollTo(page, sectionTop - 200);
    const topA = await page.$eval("#feature", (el) => el.getBoundingClientRect().top);
    await scrollTo(page, sectionTop + 200);
    const topB = await page.$eval("#feature", (el) => el.getBoundingClientRect().top);

    // A pinned section would hold its position; this one must move with the page.
    expect(topA - topB, "the section pinned on mobile").toBeGreaterThan(300);

    await scrollTo(page, sectionTop + 400);
    expect(await scaleOf(page, "[data-feature-frame]")).toBeCloseTo(1, 1);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });

  test("no zoom anywhere — hero, feature, or card", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(1200);
    expect(await scaleOf(page, "[data-signal-frame] svg")).toBeCloseTo(1, 2);

    const sectionTop = await page.$eval(
      "#feature",
      (el) => el.getBoundingClientRect().top + window.scrollY,
    );
    await scrollTo(page, sectionTop + 300);
    expect(await scaleOf(page, "[data-feature-frame]")).toBeCloseTo(1, 2);

    await page.goto("/work", { waitUntil: "load" });
    await page.locator(".media-frame").first().hover();
    await page.waitForTimeout(500);
    expect(
      await scaleOf(page, ".media-frame:first-of-type .media-zoom"),
      "the card still zoomed under reduced motion",
    ).toBeCloseTo(1, 2);
  });
});
