import { render, screen } from "@testing-library/react";

import { CaseStudyArticle } from "@/components/work/CaseStudyArticle";
import { WorkRegister } from "@/components/work/WorkRegister";

import { publishedStudy } from "../fixtures/content";

it("renders a truthful empty work register", () => {
  render(<WorkRegister caseStudies={[]} />);

  expect(
    screen.getByText(/engagement notes are being prepared/i),
  ).toBeVisible();
  expect(screen.queryAllByRole("article")).toHaveLength(0);
});

it("renders every case-study evidence section in order", () => {
  const { container } = render(
    <CaseStudyArticle study={publishedStudy} />,
  );

  expect(
    Array.from(container.querySelectorAll("section[data-dossier]"), (node) =>
      node.getAttribute("data-dossier"),
    ),
  ).toEqual([
    "premise",
    "context",
    "mandate",
    "constraints",
    "responsibility",
    "boundaries",
    "artifacts",
    "tradeoff",
    "validation",
    "outcome",
    "capabilities",
  ]);
  expect(screen.getByText(/not publicly disclosed/i)).toBeVisible();
});
