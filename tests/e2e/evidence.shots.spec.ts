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

    test("feature zoom, start and end of the scrub", async ({ page }) => {
      await page.goto("/", { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);

      const top = await page.$eval(
        "#feature",
        (el) => el.getBoundingClientRect().top + window.scrollY,
      );

      // The pin's real length, so "end" is the end of the scrub rather than
      // a guess that lands after the section has already scrolled away.
      const distance = await page.$eval("#feature", (el) => {
        const spacer = el.parentElement;
        if (!spacer) return 400;
        return Math.max(
          200,
          spacer.getBoundingClientRect().height - el.getBoundingClientRect().height,
        );
      });

      for (const [label, fraction] of [
        ["start", 0],
        ["end", 0.98],
      ] as const) {
        await page.evaluate(
          (y) => window.scrollTo({ top: y, behavior: "instant" }),
          top + distance * fraction,
        );
        await page.waitForTimeout(600);
        await page.screenshot({ path: shot(`${viewport.name}-feature-${label}`) });
      }
    });
  });
}

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
