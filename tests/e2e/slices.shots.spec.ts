import { test } from "@playwright/test";
import { SHOT_ROUTES } from "./routes";

/**
 * Full-page mobile captures are too tall to review as one image, so `pnpm
 * shots` also writes them as 1:1 slices. Review artefacts, not assertions.
 */
const WIDTH = 375;
const SLICE = 1400;

for (const route of SHOT_ROUTES) {
  test(`mobile slices · ${route.name}`, async ({ page }) => {
    await page.setViewportSize({ width: WIDTH, height: 812 });
    await page.goto(route.path, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(350);

    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const count = Math.ceil(total / SLICE);

    for (let i = 0; i < count; i += 1) {
      await page.screenshot({
        path: `screenshots/slice-${route.name}-${String(i).padStart(2, "0")}.png`,
        clip: {
          x: 0,
          y: i * SLICE,
          width: WIDTH,
          height: Math.min(SLICE, total - i * SLICE),
        },
        fullPage: true,
      });
    }
  });
}
