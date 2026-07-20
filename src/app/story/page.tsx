import { SiteShell } from "@/components/shell/SiteShell";
import { StoryArticle } from "@/components/story/StoryArticle";
import { getStoryChapters } from "@/content/selectors";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "Story — Amey Joshi",
  description:
    "From Kodoli, college software and Zenox Technologies to RB Esports and enterprise banking.",
  path: "/story",
});

export default function StoryPage() {
  return (
    <SiteShell active="story">
      <main id="main-content" tabIndex={-1}>
        <StoryArticle chapters={getStoryChapters()} />
      </main>
    </SiteShell>
  );
}
