import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const stableRoutes = ["/", "/index", "/work", "/story"] as const;

for (const route of stableRoutes) {
  test(`${route} has no automatically detectable accessibility violations`, async ({
    page,
  }) => {
    await page.goto(route, { waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page }).analyze();
    const summary = results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      targets: violation.nodes.flatMap((node) => node.target),
    }));

    expect(results.violations, JSON.stringify(summary, null, 2)).toEqual([]);
  });

  test(`${route} skip link moves keyboard focus to main content`, async ({
    page,
  }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await page.keyboard.press("Tab");

    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/#main-content$/);
    await expect(page.locator("main#main-content")).toBeFocused();
  });
}

test("mobile header focus follows its visual reading order", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const wordmark = page.getByRole("link", { name: "Amey Joshi — home" });
  await wordmark.focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Experience" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Index", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Work", exact: true }),
  ).toBeFocused();
});
