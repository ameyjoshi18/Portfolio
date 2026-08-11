import Link from "next/link";
import { storyTeaser } from "@/content/site";
import { Reveal } from "./Reveal";

export function StoryTeaserSection() {
  return (
    <section
      id="story-teaser"
      className="flex min-h-[80dvh] flex-col justify-center px-5 py-24 sm:px-8"
    >
      <div className="max-w-xl">
        <Reveal>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-paper">
            {storyTeaser.kicker}
          </p>
          <h2 className="font-display mt-4 text-3xl text-paper sm:text-5xl">
            {storyTeaser.title}
          </h2>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-paper/90 sm:text-lg">
            {storyTeaser.body}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Link
            href="/story"
            className="font-display mt-8 inline-flex items-center gap-2 text-base text-paper underline decoration-paper/40 underline-offset-4 transition-colors hover:decoration-paper sm:text-lg"
          >
            {storyTeaser.cta}
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
