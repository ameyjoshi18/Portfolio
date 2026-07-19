import type { Metadata } from "next";

import { SiteShell } from "@/components/shell/SiteShell";
import { StoryArticle } from "@/components/story/StoryArticle";
import { getStoryChapters } from "@/content/selectors";

export const metadata: Metadata = {
  title: "Story — Amey Joshi",
  description:
    "From Kodoli, college software and Zenox Technologies to RB Esports and enterprise banking.",
  alternates: { canonical: "/story" },
};

export default function StoryPage() {
  return (
    <SiteShell active="story">
      <main id="main-content">
        <StoryArticle chapters={getStoryChapters()} />
      </main>
    </SiteShell>
  );
}
