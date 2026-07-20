import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OpeningSequence } from "@/components/experience/scenes/OpeningSequence";
import { TranslationExplorer } from "@/components/experience/scenes/TranslationExplorer";

it("keeps identity and stakeholder fragments readable before enhancement", () => {
  render(<OpeningSequence />);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: /Amey Joshi.*Complexity in.*Clarity out/i,
    }),
  ).toBeVisible();
  expect(screen.getAllByTestId("stakeholder-fragment")).toHaveLength(4);
});

it("lets keyboard users inspect every translation stage", async () => {
  const user = userEvent.setup();
  const { container } = render(<TranslationExplorer />);

  expect(screen.getAllByRole("button")).toHaveLength(5);
  expect(container.querySelector('[data-active-rule="horizontal"]')).toBeInTheDocument();
  expect(container.querySelector('[data-active-rule="vertical"]')).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /acceptance/i }));
  expect(screen.getByRole("button", { name: /acceptance/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.getByText(/shared definition of done/i)).toBeVisible();
});
