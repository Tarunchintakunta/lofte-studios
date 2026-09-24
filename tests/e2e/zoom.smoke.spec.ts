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
  // The portal scrubs at 0.55 and the reel at 0.45, so roughly half a second
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

  test("portal: the sheet scales 1 → 45, and does it exponentially", async ({
    page,
  }) => {
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

  test("the pins are the length they say they are", async ({ page }) => {
    await ready(page);
    // Both are deliberately bounded: together they already hold the visitor for
    // a quarter of the homepage, and a pin that overstays reads as a page that
    // has stopped responding.
    const portal = await pinDistance(page, "#feature"); // +=180% of 900
    expect(portal).toBeGreaterThan(1530);
    expect(portal).toBeLessThan(1710);

    const reel = await pinDistance(page, "#for"); // +=200% of 900
    expect(reel).toBeGreaterThan(1710);
    expect(reel).toBeLessThan(1890);
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
      page.locator("#feature").getByRole("link", { name: "Selected work", exact: true }),
    ).toBeVisible();
  });

  test("reel: every audience takes the focal line, in order", async ({ page }) => {
    await ready(page);
    const top = await pinTop(page, "#for");
    const distance = await pinDistance(page, "#for");

    const count = await page.locator("[data-audience]").count();
    expect(count, "the reel lost its audiences").toBeGreaterThan(5);

    const seen: string[] = [];
    for (let i = 0; i < count; i += 1) {
      await scrollTo(page, top + (distance * i) / (count - 1));

      expect(
        Math.abs(await page.$eval("#for", (el) => el.getBoundingClientRect().top)),
        `the reel unpinned at item ${i}`,
      ).toBeLessThan(4);

      const active = page.locator('[data-audience][data-focus="true"]');
      await expect(active, `no single item held the line at step ${i}`).toHaveCount(1);

      // The focused item is the one crossing the middle of the viewport.
      const centre = await active.evaluate((el) => {
        const box = el.getBoundingClientRect();
        return box.top + box.height / 2;
      });
      expect(
        Math.abs(centre - 450),
        `item ${i} took focus ${Math.round(centre - 450)}px off the focal line`,
      ).toBeLessThan(40);

      seen.push((await active.innerText()).split("\n")[0]);
    }

    // Every audience, each exactly once, in document order.
    const labels = await page.$$eval("[data-audience]", (els) =>
      els.map((el) => (el as HTMLElement).innerText.split("\n")[0]),
    );
    expect(seen).toEqual(labels);
  });

  /**
   * Responsiveness, not correctness: the other reel tests scroll, wait, and read
   * a resting value, which a badly lagging scrub still passes. This one scrolls
   * *continuously* at a normal flick speed and measures how far the track is
   * running behind the scroll that is driving it.
   *
   * Note what is deliberately NOT measured: the distance from the focused item
   * to the focal line. Focus is a rounded index, so an item legitimately owns
   * the line from half a spacing before it to half a spacing after — roughly
   * ±70px here. That number looks like lag and is not.
   */
  test("reel: the track keeps up with a continuous scroll", async ({ page }) => {
    await ready(page);
    const top = await pinTop(page, "#for");

    const result = await page.evaluate(async (startY) => {
      const reel = document.getElementById("for")!;
      const track = document.querySelector<HTMLElement>(".reel-track")!;
      const spacer = reel.parentElement!;
      const distance =
        spacer.getBoundingClientRect().height - reel.getBoundingClientRect().height;
      const items = Array.from(
        document.querySelectorAll<HTMLElement>("[data-audience]"),
      );

      // The same centres the component interpolates across, so "where the track
      // ought to be for this scroll position" is computed the same way.
      const centres = items.map((el) => el.offsetTop + el.offsetHeight / 2);
      const idealY = (p: number) => {
        const span = p * (centres.length - 1);
        const i = Math.min(centres.length - 2, Math.floor(span));
        return -(centres[i] + (centres[i + 1] - centres[i]) * (span - i));
      };
      const actualY = () =>
        new DOMMatrixReadOnly(getComputedStyle(track).transform).f;

      window.scrollTo({ top: startY - 400, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 900));

      const lag: number[] = [];
      const behind: number[] = [];
      let y = startY;
      for (let i = 0; i < 100; i += 1) {
        y += 18; // ≈1080px/s at 60fps — an ordinary trackpad flick
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => requestAnimationFrame(r));

        const p = Math.min(1, Math.max(0, (y - startY) / distance));
        lag.push(Math.abs(actualY() - idealY(p)));

        const actual = items.findIndex((el) => el.dataset.focus === "true");
        if (actual >= 0) behind.push(Math.abs(Math.round(p * (items.length - 1)) - actual));
      }
      const avg = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
      return {
        samples: lag.length,
        spacing: Math.round((centres.at(-1)! - centres[0]) / (centres.length - 1)),
        maxLagPx: Math.round(Math.max(...lag)),
        avgLagPx: Math.round(avg(lag)),
        avgBehind: Number(avg(behind).toFixed(2)),
        maxBehind: Math.max(...behind),
      };
    }, top);

    expect(result.samples).toBeGreaterThan(50);
    expect(
      result.avgLagPx,
      `the track ran an average of ${result.avgLagPx}px behind the scroll ` +
        `(worst ${result.maxLagPx}px, item spacing ${result.spacing}px) — ` +
        `the scrub is too long`,
    ).toBeLessThan(45);
    expect(
      result.avgBehind,
      `the wrong audience held the line for much of the sweep ` +
        `(avg ${result.avgBehind} items behind, worst ${result.maxBehind})`,
    ).toBeLessThan(0.35);
  });

  test("reel: the item on the line is coral and the rest are dimmed", async ({
    page,
  }) => {
    await ready(page);
    await scrollTo(page, await pinTop(page, "#for"));

    const active = page.locator('[data-audience][data-focus="true"]');
    await expect(active).toHaveCSS("color", "rgb(255, 115, 93)"); // --color-coral
    await expect(active).toHaveCSS("opacity", "1");

    const dimmed = page.locator('[data-audience][data-focus="false"]').first();
    await expect(dimmed).toHaveCSS("opacity", "0.22");
    await expect(dimmed).toHaveCSS("color", "rgb(184, 198, 213)"); // --color-mist
  });

  test("reel: every audience is a link to a service that exists", async ({
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

  test("neither section pins on a phone, and both read in full", async ({ page }) => {
    await ready(page);

    for (const id of ["#for", "#feature"]) {
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

    // Nothing in the reel is dimmed when there is no focal line to be off.
    const dimmed = await page.$$eval(
      "[data-audience]",
      (els) => els.filter((el) => Number(getComputedStyle(el).opacity) < 0.9).length,
    );
    expect(dimmed, "audiences were dimmed with no reel to dim them for").toBe(0);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });

  test("no zoom anywhere — hero, portal, reel, or card", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(1200);
    expect(await scaleOf(page, "[data-signal-frame] svg")).toBeCloseTo(1, 2);

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

  test("the reel reads as a plain list of links", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const items = page.locator("[data-audience]");
    const count = await items.count();
    expect(count).toBeGreaterThan(5);

    for (let i = 0; i < count; i += 1) {
      await expect(items.nth(i)).toBeVisible();
    }

    // No pin-spacer was ever built, so nothing is holding anyone anywhere.
    // (`pinDistance` cannot answer this: with no spacer it measures the section
    // against `<main>` and returns the rest of the page.)
    for (const id of ["#for", "#feature"]) {
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
