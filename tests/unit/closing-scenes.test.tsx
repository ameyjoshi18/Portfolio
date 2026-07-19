import { render, screen, within } from "@testing-library/react";

import { EvidenceRegisterScene } from "@/components/experience/scenes/EvidenceRegisterScene";
import { OpenLine } from "@/components/experience/scenes/OpenLine";
import { OriginScene } from "@/components/experience/scenes/OriginScene";
import type { SiteProfile, StoryChapter } from "@/content/schema";

import { publishedStudy } from "../fixtures/content";

const textOnlyChapter: StoryChapter = {
  id: "origin",
  eyebrow: "Origin",
  title: "Kodoli",
  body: ["Curiosity with a keyboard."],
};

const profile: SiteProfile = {
  name: "Amey Joshi",
  headline: "Complexity in. Clarity out.",
  positioning: "A test profile.",
  role: "Business Analyst",
  location: "Navi Mumbai, India",
  email: "amey@example.com",
  linkedin: "https://www.linkedin.com/in/example",
  domains: [],
  method: [],
};

it("renders exactly the supplied verified dossiers", () => {
  const { rerender } = render(<EvidenceRegisterScene caseStudies={[]} />);

  expect(screen.queryAllByRole("article")).toHaveLength(0);
  expect(screen.getByRole("link", { name: /work register/i })).toHaveAttribute(
    "href",
    "/work",
  );

  rerender(<EvidenceRegisterScene caseStudies={[publishedStudy]} />);

  const articles = screen.getAllByRole("article");
  expect(articles).toHaveLength(1);
  expect(
    within(articles[0]).getByRole("heading", {
      name: publishedStudy.title,
    }),
  ).toBeVisible();
  expect(within(articles[0]).getByText("Premise")).toBeVisible();
  expect(within(articles[0]).getByText("Constraint")).toBeVisible();
  expect(within(articles[0]).getByText("Contribution")).toBeVisible();
  expect(within(articles[0]).getByText("Disclosure")).toBeVisible();
});

it("does not invent a media frame for a text-only origin", () => {
  const { container } = render(<OriginScene chapters={[textOnlyChapter]} />);

  expect(screen.getByText("Kodoli")).toBeVisible();
  expect(screen.getByText("Curiosity with a keyboard.")).toBeVisible();
  expect(container.querySelector("img")).not.toBeInTheDocument();
  expect(container.querySelector("figure")).not.toBeInTheDocument();
});

it("ends with direct, named contact routes", () => {
  render(<OpenLine profile={profile} />);

  expect(screen.getByRole("link", { name: profile.email })).toHaveAttribute(
    "href",
    `mailto:${profile.email}`,
  );
  expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    profile.linkedin,
  );
});
