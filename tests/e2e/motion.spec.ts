import { expect, test } from "@playwright/test";

test.describe("reduced-motion experience", () => {
  test.use({
    viewport: { width: 1440, height: 900 },
  });

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("keeps every scene resolved, readable and free of the animated canvas", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const opening = page.locator('[data-scene="unresolved"]');
    const cutover = page.locator('[data-scene="cutover"]');

    await expect(opening).toHaveAttribute("data-motion", "resolved");
    await expect(cutover).toHaveAttribute("data-motion", "resolved");
    await expect(cutover).toHaveAttribute("data-cutover", "static");

    const sceneHeadings = page.locator('[data-scene] :is(h1, h2)');
    await expect(sceneHeadings).toHaveCount(7);
    for (let index = 0; index < (await sceneHeadings.count()); index += 1) {
      await expect(sceneHeadings.nth(index)).toBeVisible();
    }

    const pinnedFrames = await page
      .locator(
        '[data-scene="unresolved"] > div, [data-scene="cutover"] > div',
      )
      .evaluateAll((frames) =>
        frames.map((frame) => ({
          position: getComputedStyle(frame).position,
          transform: getComputedStyle(frame).transform,
        })),
      );

    expect(pinnedFrames).toEqual([
      { position: "relative", transform: "none" },
      { position: "relative", transform: "none" },
    ]);

    await cutover.scrollIntoViewIfNeeded();
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator("[data-canvas-host]")).toHaveCount(0);
  });
});

test("mobile resolves the opening and moves the translation rule vertically", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const opening = page.locator('[data-scene="unresolved"]');
  await expect(opening).toHaveAttribute("data-motion", "resolved");
  await expect(opening.locator('[aria-hidden="true"]').last()).toHaveCSS(
    "transform",
    "none",
  );

  const verticalRule = page.locator('[data-active-rule="vertical"]');
  await expect(verticalRule).toBeVisible();
  await page.getByRole("button", { name: /04 acceptance/i }).click();
  await expect
    .poll(async () =>
      verticalRule.evaluate((rule) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(rule).transform);
        return Math.abs(matrix.m41) < 1 && matrix.m42 > 0;
      }),
    )
    .toBe(true);
});
