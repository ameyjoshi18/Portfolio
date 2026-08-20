import { expect, test, type Page, type Request } from "@playwright/test";

const kibibyte = 1024;
const cutoverModuleMarker = "cutover-animated";

type RouteBudget = {
  route: string;
  initialJavaScript: number;
  initialTransfer?: number;
};

const routeBudgets: readonly RouteBudget[] = [
  // These real wire-transfer caps include Next 16's shared App Router runtime.
  // The lazy-loaded cutover animation module is excluded here and constrained separately below.
  {
    route: "/",
    initialJavaScript: 210 * kibibyte,
    initialTransfer: 650 * kibibyte,
  },
  {
    route: "/index",
    initialJavaScript: 210 * kibibyte,
    initialTransfer: 350 * kibibyte,
  },
  { route: "/work", initialJavaScript: 150 * kibibyte },
  { route: "/story", initialJavaScript: 150 * kibibyte },
] as const;

function finishedRequests(page: Page) {
  const requests: Request[] = [];
  page.on("requestfinished", (request) => requests.push(request));
  return requests;
}

async function responseSources(requests: readonly Request[]) {
  return Promise.all(
    requests.map(async (request) => {
      const response = await request.response();
      if (!response) return "";

      try {
        return await response.text();
      } catch {
        return "";
      }
    }),
  );
}

async function transferredBytes(
  page: Page,
  scope: "scripts" | "all",
) {
  return page.evaluate((requestedScope) => {
    const resources = performance.getEntriesByType(
      "resource",
    ) as PerformanceResourceTiming[];
    const resourceBytes = resources
      .filter(
        (entry) =>
          requestedScope === "all" || entry.initiatorType === "script",
      )
      .reduce((total, entry) => total + entry.transferSize, 0);

    if (requestedScope === "scripts") return resourceBytes;

    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;
    return resourceBytes + (navigation?.transferSize ?? 0);
  }, scope);
}

async function expectedCutoverMode(page: Page) {
  return page.evaluate(() => {
    type CapabilityNavigator = Navigator & {
      deviceMemory?: number;
    };

    const capabilities = navigator as CapabilityNavigator;
    const lowEndDevice =
      (capabilities.hardwareConcurrency ?? 8) < 2 ||
      (capabilities.deviceMemory ?? 8) < 2;

    return lowEndDevice ? "static" : "animated";
  });
}

for (const budget of routeBudgets) {
  test(`${budget.route} stays inside its initial transfer budget`, async ({
    page,
  }) => {
    const response = await page.goto(budget.route, { waitUntil: "networkidle" });
    expect(response?.ok()).toBe(true);

    const initialJavaScript = await transferredBytes(page, "scripts");

    expect(
      initialJavaScript,
      `${budget.route} loaded ${(initialJavaScript / kibibyte).toFixed(1)} KiB of encoded JavaScript`,
    ).toBeLessThanOrEqual(budget.initialJavaScript);

    if (budget.initialTransfer) {
      const initialTransfer = await transferredBytes(page, "all");
      expect(
        initialTransfer,
        `${budget.route} transferred ${(initialTransfer / kibibyte).toFixed(1)} KiB before interaction`,
      ).toBeLessThanOrEqual(budget.initialTransfer);
    }
  });
}

test("the cutover animation module is requested only near cutover and stays in budget", async ({
  page,
}) => {
  const requests = finishedRequests(page);
  await page.goto("/", { waitUntil: "networkidle" });

  const initialScripts = requests.filter(
    (request) => request.resourceType() === "script",
  );
  const initialScriptTransfer = await transferredBytes(page, "scripts");
  const initialSources = await responseSources(initialScripts);
  expect(
    initialSources.some((source) => source.includes(cutoverModuleMarker)),
  ).toBe(false);

  const cutover = page.locator('[data-scene="cutover"]');
  const mode = await expectedCutoverMode(page);
  await expect(cutover).toHaveAttribute("data-cutover", mode);
  await cutover.scrollIntoViewIfNeeded();

  if (mode === "static") {
    await expect(page.getByTestId("cutover-animated")).toHaveCount(0);
    return;
  }

  await expect(page.getByTestId("cutover-animated")).toHaveCount(1);
  await page.waitForLoadState("networkidle");

  const lateScripts = requests
    .filter((request) => request.resourceType() === "script")
    .slice(initialScripts.length);
  const lateSources = await responseSources(lateScripts);
  expect(
    lateSources.some((source) => source.includes(cutoverModuleMarker)),
  ).toBe(true);

  const lazyBytes =
    (await transferredBytes(page, "scripts")) - initialScriptTransfer;
  expect(
    lazyBytes,
    `The lazy cutover module transferred ${(lazyBytes / kibibyte).toFixed(1)} KiB`,
  ).toBeLessThanOrEqual(300 * kibibyte);
});

test("cutover never mounts more than one animated instance", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const cutover = page.locator('[data-scene="cutover"]');
  const mode = await expectedCutoverMode(page);
  await expect(cutover).toHaveAttribute("data-cutover", mode);
  await cutover.scrollIntoViewIfNeeded();

  if (mode === "animated") {
    await expect(page.locator("[data-canvas-host]")).toHaveCount(1);
    await expect(page.getByTestId("cutover-animated")).toHaveCount(1);
  } else {
    await expect(page.locator("[data-canvas-host]")).toHaveCount(0);
  }

  expect(await page.getByTestId("cutover-animated").count()).toBeLessThanOrEqual(1);

  await page.locator('[data-scene="open-line"]').scrollIntoViewIfNeeded();
  await cutover.scrollIntoViewIfNeeded();
  expect(await page.getByTestId("cutover-animated").count()).toBeLessThanOrEqual(1);
});
