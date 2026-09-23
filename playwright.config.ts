import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PW_PORT ?? 4319);
export const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * Two projects:
 *  - `smoke`  — behaviour, accessibility and console-error checks (Chromium, laptop).
 *  - `shots`  — full-page captures at the four viewports named in MASTER_PROMPT.md,
 *               run via `pnpm shots` and reviewed by eye against DESIGN_BRIEF.md.
 *
 * Both run against the production build, not the dev server, so what is
 * reviewed is what ships.
 */
export const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1536, height: 960 },
] as const;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  timeout: 45_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    // Deterministic captures. `reducedMotion` is emulated through CDP — the
    // --force-prefers-reduced-motion launch flag silently did nothing, and the
    // first round of screenshots caught the hero field mid-timeline because of
    // it. Reduced motion is also the state the resolved composition must look
    // correct in, so this is the right default for review.
    reducedMotion: "reduce",
    launchOptions: { args: ["--hide-scrollbars"] },
  },

  projects: [
    {
      name: "smoke",
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "shots",
      testMatch: /.*\.shots\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: BASE_URL,
    // Never reuse: an unrelated dev server squatting on this port would be
    // screenshotted as if it were ours. Playwright owns the lifecycle instead.
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
