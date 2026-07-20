import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

describe("Experience first paint", () => {
  it("renders one readable identity heading and a main landmark", () => {
    const { container } = render(<Home />);

    expect(container.querySelector("main#main-content")).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Amey Joshi.*Complexity in.*Clarity out/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getAllByRole("heading", {
        level: 2,
        name: /Bring me the complicated version/i,
      }),
    ).toHaveLength(1);
    expect(container.querySelector('[data-scene="open-line"]')).toHaveAttribute(
      "id",
      "contact",
    );
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
  });
});
