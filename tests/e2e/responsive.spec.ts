import { expect, test } from "@playwright/test";

const stableRoutes = ["/", "/index", "/work", "/story"] as const;
const widths = [320, 768, 1024, 1440] as const;

for (const width of widths) {
  test(`stable routes do not overflow horizontally at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });

    for (const route of stableRoutes) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.ok()).toBe(true);

      await page.evaluate(async () => {
        await document.fonts.ready;
      });

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );

      expect(
        overflow,
        `${route} exceeds the ${width}px viewport by ${overflow}px`,
      ).toBeLessThanOrEqual(1);
    }
  });
}

test("the mobile work publication label clears its evidence heading", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/work", { waitUntil: "domcontentloaded" });
  await page.evaluate(async () => document.fonts.ready);

  const label = await page.getByText("Publication boundary", { exact: true }).boundingBox();
  const heading = await page
    .getByRole("heading", { name: "Evidence before theatre." })
    .boundingBox();

  expect(label).not.toBeNull();
  expect(heading).not.toBeNull();
  expect(label!.y + label!.height).toBeLessThanOrEqual(heading!.y);
});
