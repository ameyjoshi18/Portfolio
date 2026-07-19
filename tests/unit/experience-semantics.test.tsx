import { render, screen } from "@testing-library/react";

import { Experience } from "@/components/experience/Experience";

it("renders one identity heading and seven ordered semantic scenes", () => {
  const { container } = render(<Experience />);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: /Amey Joshi.*Complexity in.*Clarity out/i,
    }),
  ).toBeVisible();
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(
    Array.from(container.querySelectorAll("[data-scene]"), (node) =>
      node.getAttribute("aria-label"),
    ),
  ).toEqual([
    "Unresolved and one truth",
    "Translation",
    "Rails",
    "Cutover",
    "Evidence register",
    "Before the bank",
    "Open line",
  ]);
});
