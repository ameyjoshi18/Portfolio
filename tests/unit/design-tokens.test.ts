import { globSync, readFileSync } from "node:fs";

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

  expect([...used].filter((token) => !defined.has(token)).sort()).toEqual([]);
});
