import { expect, test } from "@playwright/test";

const stableRoutes = ["/", "/index", "/work", "/story"] as const;

test.describe("stable route semantics", () => {
  for (const route of stableRoutes) {
    test(`${route} has one main landmark and one visible h1`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });

      expect(response?.ok(), `${route} should return a successful response`).toBe(
        true,
      );
      await expect(page.locator("main#main-content")).toHaveCount(1);
      await expect(page.locator("main#main-content")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
    });
  }
});

test("/index serves the direct dossier rather than the immersive route", async ({
  page,
}) => {
  const response = await page.goto("/index", { waitUntil: "domcontentloaded" });

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveURL(/\/index$/);
  await expect(page).toHaveTitle(/Index — Amey Joshi/);
  await expect(page.getByText("Index / 2026", { exact: true })).toBeVisible();
  await expect(page.locator('[data-scene="unresolved"]')).toHaveCount(0);
});

for (const route of [
  {
    path: "/index",
    title: "Index — Amey Joshi",
    description: /direct register/i,
  },
  {
    path: "/work",
    title: "Work — Amey Joshi",
    description: /verified, bounded engagement notes/i,
  },
  {
    path: "/story",
    title: "Story — Amey Joshi",
    description: /Kodoli, college software/i,
  },
] as const) {
  test(`${route.path} publishes route-specific social metadata`, async ({
    page,
  }) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://ameyjoshi.in${route.path}`,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      `https://ameyjoshi.in${route.path}`,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      route.title,
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      route.title,
    );
    await expect(
      page.locator('meta[property="og:description"]'),
    ).toHaveAttribute("content", route.description);
  });
}

test("essential experience content survives with JavaScript disabled", async ({
  baseURL,
  browser,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  try {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });

    expect(response?.ok()).toBe(true);
    await expect(page.locator("main#main-content")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Amey Joshi.*Complexity in.*Clarity out/i,
      }),
    ).toBeVisible();

    for (const href of ["/index", "/work", "/story"] as const) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }

    await expect(page.locator('[data-scene="evidence"]')).toContainText(
      /The decision trail is the portfolio/i,
    );
    await expect(page.getByTestId("cutover-static")).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
  } finally {
    await context.close();
  }
});
