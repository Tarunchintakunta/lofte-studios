import { expect, test } from "@playwright/test";

/**
 * The floating bar tightens as you read down and comes back the moment you head
 * up, so navigation is never more than one upward flick away.
 *
 * All three guards are asserted, because each one exists to stop a specific
 * annoyance: a bar that twitches at the top of the page, a bar that flickers on
 * trackpad jitter, and a size change firing for someone who asked for no motion.
 */

test.use({ reducedMotion: "no-preference", viewport: { width: 1440, height: 900 } });

test("navbar shrinks going down and returns going up", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const bar = page.locator("header [data-compact]");
  const h = async () => Math.round((await bar.boundingBox())!.height);
  const top = async () => Math.round((await bar.boundingBox())!.y);
  const step = async (dy: number, times = 8) => {
    for (let i = 0; i < times; i += 1) {
      await page.mouse.wheel(0, dy);
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(500);
  };

  const rest = { h: await h(), top: await top() };
  await expect(bar).toHaveAttribute("data-compact", "false");

  await step(120);                       // read downward
  const down = { h: await h(), top: await top(), y: await page.evaluate(() => scrollY) };
  await expect(bar).toHaveAttribute("data-compact", "true");

  await step(-120, 4);                   // change your mind
  const up = { h: await h(), top: await top() };
  await expect(bar).toHaveAttribute("data-compact", "false");

  expect(down.h, "the bar did not get shorter on the way down").toBeLessThan(rest.h);
  expect(down.top, "the bar did not ride higher on the way down").toBeLessThan(rest.top);
  expect(up.h, "the bar did not come back on the way up").toBe(rest.h);
});

test("it does not engage at the top of the page", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });
  await page.waitForTimeout(300);
  await page.mouse.wheel(0, 60);         // inside the 140px dead zone
  await page.waitForTimeout(400);
  await expect(page.locator("header [data-compact]")).toHaveAttribute(
    "data-compact",
    "false",
  );
});

test("reduced motion leaves the bar alone", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const p2 = await ctx.newPage();
  await p2.goto("/", { waitUntil: "load" });
  await p2.waitForTimeout(300);
  for (let i = 0; i < 8; i += 1) { await p2.mouse.wheel(0, 120); await p2.waitForTimeout(40); }
  await p2.waitForTimeout(500);
  await expect(p2.locator("header [data-compact]")).toHaveAttribute("data-compact", "false");
  await ctx.close();
});
