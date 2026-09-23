import { expect, test } from "@playwright/test";
import { VIEWPORTS } from "../../playwright.config";
import { SHOT_ROUTES } from "./routes";

/**
 * Captures, not assertions. `pnpm shots` writes a full-page PNG per route per
 * viewport into `screenshots/` for review against DESIGN_BRIEF.md.
 */
for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name} · ${viewport.width}px`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of SHOT_ROUTES) {
      test(`${route.name}`, async ({ page }) => {
        await page.goto(route.path, { waitUntil: "load" });
        // Guard against capturing some other app that happens to hold the port.
        await expect(page.locator("footer")).toContainText("Løfte");
        // Let fonts settle so display type is measured, not swapped mid-capture.
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(350);
        await page.screenshot({
          path: `screenshots/${viewport.name}-${route.name}.png`,
          fullPage: true,
        });
      });
    }
  });
}
