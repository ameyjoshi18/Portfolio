import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

describe("Experience first paint", () => {
  it("renders one readable identity heading and a main landmark", () => {
    const { container } = render(<Home />);

    expect(container.querySelector("main#main-content")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Amey Joshi.*Complexity in.*Clarity out/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
