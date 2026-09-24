import { test } from "@playwright/test";
import { VIEWPORTS } from "../../playwright.config";

/**
 * Review artefacts for the zoom work and the mobile menu — the states a
 * full-page capture cannot show, because they only exist mid-scroll, on hover,
 * or behind a button.
 */

const shot = (name: string) => `screenshots/zoom-${name}.png`;

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name} · ${viewport.width}px`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: "no-preference",
    });

    /**
     * Walks a pinned section and captures it at each fraction of its own pin.
     * The pin's real length is measured rather than guessed, so "end" is the
     * end of the scrub and not a point after the section has scrolled away.
     */
    const walk = async (
      page: import("@playwright/test").Page,
      id: string,
      name: string,
      marks: readonly (readonly [string, number])[],
    ) => {
      await page.goto("/", { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);

      // Unpinned (phone, reduced motion) there is no pin-spacer at all, and
      // measuring against `<main>` would walk the top of the page instead of
      // the section. Fall back to the section's own box and height.
      const { top, distance } = await page.$eval(id, (el) => {
        const spacer = el.parentElement;
        const pinned = spacer?.classList.contains("pin-spacer") ?? false;
        const box = el.getBoundingClientRect();
        const frame = pinned ? spacer!.getBoundingClientRect() : box;
        return {
          top: frame.top + window.scrollY,
          distance: pinned ? Math.max(200, frame.height - box.height) : box.height,
        };
      });

      for (const [label, fraction] of marks) {
        await page.evaluate(
          (y) => window.scrollTo({ top: y, behavior: "instant" }),
          top + distance * fraction,
        );
        // Long enough for a 0.8–1.0 scrub to finish catching up.
        await page.waitForTimeout(1000);
        await page.screenshot({ path: shot(`${viewport.name}-${name}-${label}`) });
      }
    };

    // The three beats of the portal plus the hold: the intro sheet, the sheet
    // mid-flight, the crossfade itself, and the room standing still.
    test("portal, through the aperture", async ({ page }) => {
      await walk(page, "#feature", "portal", [
        ["1-intro", 0],
        ["2-push", 0.3],
        ["3-crossfade", 0.55],
        ["4-room", 0.95],
      ]);
    });

    test("for reel, three points on the focal line", async ({ page }) => {
      await walk(page, "#for", "reel", [
        ["1-first", 0],
        ["2-middle", 0.5],
        ["3-last", 0.98],
      ]);
    });
  });
}

test.describe("navigation bar", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });

  test("at rest, and tightened on the way down", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    const strip = { x: 0, y: 0, width: 1440, height: 120 };
    await page.screenshot({ path: shot("nav-1-rest"), clip: strip });

    for (let i = 0; i < 8; i += 1) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(600);
    await page.screenshot({ path: shot("nav-2-tight"), clip: strip });

    for (let i = 0; i < 4; i += 1) {
      await page.mouse.wheel(0, -120);
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(600);
    await page.screenshot({ path: shot("nav-3-returned"), clip: strip });
  });
});

test.describe("hero settle", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });

  test("captures the oversized start and the settled state", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(160);
    await page.screenshot({
      path: shot("hero-entry"),
      clip: { x: 760, y: 60, width: 680, height: 800 },
    });
    await page.waitForTimeout(3000);
    await page.screenshot({
      path: shot("hero-settled"),
      clip: { x: 760, y: 60, width: 680, height: 800 },
    });
  });
});

test.describe("work card", () => {
  test.use({ viewport: { width: 1280, height: 900 }, reducedMotion: "no-preference" });

  test("captures the resting and hovered media", async ({ page }) => {
    await page.goto("/work", { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const frame = page.locator(".media-frame").first();

    await frame.screenshot({ path: shot("card-rest") });
    await frame.hover();
    await page.waitForTimeout(900);
    await frame.screenshot({ path: shot("card-hover") });
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("captures the menu closed and open", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: shot("mobile-nav-closed"),
      clip: { x: 0, y: 0, width: 375, height: 120 },
    });

    await page.getByTestId("menu-trigger").click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: shot("mobile-nav-open") });
  });
});
