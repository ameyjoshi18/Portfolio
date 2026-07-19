import { render, screen } from "@testing-library/react";

import { RailsScene } from "@/components/experience/scenes/RailsScene";
import { dmtRail } from "@/content/experience";

it("keeps the route meaning in HTML beside a decorative SVG", () => {
  const { container } = render(<RailsScene model={dmtRail} />);

  expect(screen.getByRole("heading", { name: /customer sees a result/i })).toBeVisible();
  expect(screen.getByText("Agent cash-in")).toBeVisible();
  expect(screen.getByText("Reconciliation")).toBeVisible();
  expect(screen.getByText(dmtRail.reconciliationQuestion)).toBeVisible();
  expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
});
