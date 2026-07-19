import { render, screen } from "@testing-library/react";

import { StoryArticle } from "@/components/story/StoryArticle";
import type { StoryChapter } from "@/content/schema";

const chapters: readonly StoryChapter[] = [
  {
    id: "first",
    eyebrow: "Origin",
    title: "First",
    body: ["First body"],
  },
  {
    id: "second",
    eyebrow: "Change",
    title: "Second",
    body: ["Second body"],
  },
];

it("keeps story order and omits absent media cleanly", () => {
  const { container } = render(<StoryArticle chapters={chapters} />);

  expect(
    screen
      .getAllByRole("heading", { level: 2 })
      .map((node) => node.textContent),
  ).toEqual(["First", "Second"]);
  expect(container.querySelector("img")).not.toBeInTheDocument();
});
