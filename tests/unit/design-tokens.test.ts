import { globSync, readFileSync } from "node:fs";

// Set on the currently-hovered .glass/.tile element via a pointermove
// listener (GlassPointerTracker), not declared in any stylesheet — all are
// read with an inline var() fallback, so they never need a static definition.
const RUNTIME_ONLY_TOKENS = new Set(["--mx", "--my", "--tilt-x", "--tilt-y"]);

it("defines every CSS custom property used by the portfolio", () => {
  const css = globSync("src/**/*.css")
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
  const defined = new Set(
    Array.from(css.matchAll(/(--[\w-]+)\s*:/g), (match) => match[1]),
  );
  const used = new Set(
    Array.from(css.matchAll(/var\((--[\w-]+)/g), (match) => match[1]),
  );

  expect(
    [...used]
      .filter((token) => !defined.has(token) && !RUNTIME_ONLY_TOKENS.has(token))
      .sort(),
  ).toEqual([]);
});
