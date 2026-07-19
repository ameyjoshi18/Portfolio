import { render, screen } from "@testing-library/react";

import { IndexDossier } from "@/components/index/IndexDossier";

import { publishedStudy } from "../fixtures/content";

it("renders a complete evidence path without JavaScript-only disclosure", () => {
  render(<IndexDossier caseStudies={[publishedStudy]} roles={[]} />);

  expect(
    screen.getByRole("heading", { level: 1, name: /Amey Joshi/i }),
  ).toBeVisible();
  expect(
    screen.getByRole("heading", { name: /Selected work/i }),
  ).toBeVisible();
  expect(
    screen.getByRole("link", { name: /A verified engagement/i }),
  ).toHaveAttribute("href", "/work/verified-engagement");
  expect(
    screen.getByRole("heading", { name: /Domain register/i }),
  ).toBeVisible();
  expect(
    screen.getByRole("heading", { name: /Working method/i }),
  ).toBeVisible();
  expect(screen.getByRole("heading", { name: /Career/i })).toBeVisible();
  expect(screen.getByRole("link", { name: /Read the story/i })).toHaveAttribute(
    "href",
    "/story",
  );
});
