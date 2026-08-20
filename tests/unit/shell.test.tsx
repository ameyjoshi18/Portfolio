import { render, screen, within } from "@testing-library/react";

import { SiteShell } from "@/components/shell/SiteShell";

it("provides skip navigation, ordinary route links and stable contact", () => {
  render(
    <SiteShell active="index">
      <main id="main-content">
        <h1>Index</h1>
      </main>
    </SiteShell>,
  );

  expect(
    screen.getByRole("link", { name: /skip to main content/i }),
  ).toHaveAttribute("href", "#main-content");
  expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute(
    "href",
    "/",
  );
  expect(screen.getByRole("link", { name: "Index" })).toHaveAttribute(
    "href",
    "/index",
  );
  expect(screen.getByRole("link", { name: "Index" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(screen.getByRole("contentinfo")).toHaveAttribute("id", "contact");
  expect(
    screen.getByRole("navigation", { name: "Portfolio view" }),
  ).toBeVisible();
  expect(
    within(screen.getByRole("banner"))
      .getAllByRole("link")
      .map((link) => link.textContent?.replace(/\s+/g, " ").trim()),
  ).toEqual([
    "Amey Joshi",
    "Experience",
    "Index",
    "Work",
    "Story",
    "Contact",
  ]);
  expect(
    screen.getByRole("link", { name: /ameyjoshi1881@gmail.com/i }),
  ).toBeVisible();
});
