import { act, render, screen, within } from "@testing-library/react";
import { beforeEach, vi } from "vitest";

import { CutoverScene } from "@/components/experience/scenes/CutoverScene";

const { canvasFailure } = vi.hoisted(() => ({
  canvasFailure: { current: false },
}));

vi.mock("next/dynamic", () => ({
  default: () =>
    function MockCutoverAnimated() {
      if (canvasFailure.current) throw new Error("Cutover render failed");
      return <div data-testid="cutover-animated" />;
    },
}));

let intersectionCallback: IntersectionObserverCallback;
let intersectionOptions: IntersectionObserverInit | undefined;
const disconnect = vi.fn();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin: string;
  readonly thresholds = [0];

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    intersectionCallback = callback;
    intersectionOptions = options;
    this.rootMargin = options?.rootMargin ?? "0px";
  }

  disconnect = disconnect;
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

beforeEach(() => {
  canvasFailure.current = false;
  disconnect.mockClear();
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

it("always renders workstreams and the static cutover meaning", () => {
  render(
    <CutoverScene policy={{ dom: "resolved", cutover: "static" }} />,
  );

  expect(screen.getByRole("heading", { name: /Cutover/i })).toBeVisible();
  expect(screen.getByTestId("cutover-static")).toBeVisible();
  expect(screen.queryByTestId("cutover-animated")).not.toBeInTheDocument();

  const fallback = screen.getByTestId("cutover-static");
  const svg = fallback.querySelector("svg");
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg).toHaveAttribute("focusable", "false");

  const list = screen.getByRole("list");
  expect(within(list).getByText("Business")).toBeVisible();
  expect(within(list).getByText("Vendors")).toBeVisible();
  expect(
    within(list)
      .getAllByRole("listitem")
      .map((item) => item.querySelector("h3")?.textContent),
  ).toEqual(["Business", "Engineering", "QA", "Infrastructure", "Vendors"]);
});

it("mounts exactly one nearby canvas host and removes it when no longer eligible", () => {
  const { container, rerender, unmount } = render(
    <CutoverScene policy={{ dom: "full", cutover: "animated" }} />,
  );

  expect(container.querySelectorAll("[data-canvas-host]")).toHaveLength(0);
  expect(intersectionOptions?.rootMargin).toBe("300px 0px");

  act(() => {
    intersectionCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });

  expect(container.querySelectorAll("[data-canvas-host]")).toHaveLength(1);
  expect(screen.getAllByTestId("cutover-animated")).toHaveLength(1);

  rerender(<CutoverScene policy={{ dom: "resolved", cutover: "static" }} />);
  expect(container.querySelectorAll("[data-canvas-host]")).toHaveLength(0);
  expect(screen.queryByTestId("cutover-animated")).not.toBeInTheDocument();

  unmount();
  expect(disconnect).toHaveBeenCalled();
});

it("restores the full static cutover when the animated renderer fails", () => {
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  canvasFailure.current = true;
  const { container } = render(
    <CutoverScene policy={{ dom: "full", cutover: "animated" }} />,
  );

  act(() => {
    intersectionCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });

  expect(container.querySelector('[data-scene="cutover"]')).toHaveAttribute(
    "data-cutover",
    "static",
  );
  expect(screen.getByTestId("cutover-static")).toBeVisible();
  expect(container.querySelector("[data-canvas-host]")).not.toBeInTheDocument();
  consoleError.mockRestore();
});
