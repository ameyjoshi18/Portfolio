import type { Chapter } from "@/content/site";
import { Reveal } from "./Reveal";

export function ChapterSection({ chapter, align }: { chapter: Chapter; align: "left" | "right" }) {
  return (
    <section
      id={chapter.id}
      className={`flex ${chapter.id === "fino" ? "min-h-[160dvh]" : "min-h-[100dvh]"} items-center px-5 py-24 sm:px-8 ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-xl text-left">
        <Reveal>
          <div
            className={`flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-copper ${
              align === "right" ? "flex-row-reverse" : ""
            }`}
          >
            <span className="h-px w-8 bg-copper/70" aria-hidden="true" />
            {chapter.kicker}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display mt-4 text-3xl text-paper sm:text-5xl">{chapter.title}</h2>
        </Reveal>
        <div className="measure mt-6 space-y-4">
          {chapter.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.12 + i * 0.06}>
              <p className="text-[1.05rem] leading-relaxed text-paper/90 sm:text-[1.15rem]">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
