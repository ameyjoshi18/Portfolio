import { now } from "@/content/site";
import { Reveal } from "./Reveal";

export function NowSection() {
  return (
    <section
      id="now"
      className="flex min-h-[100dvh] items-center px-5 py-24 sm:px-8"
    >
      <div className="max-w-2xl">
        <Reveal>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-paper">
            <span className="h-px w-8 bg-paper/60" aria-hidden="true" />
            {now.kicker}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display mt-4 text-3xl text-paper sm:text-5xl">{now.title}</h2>
        </Reveal>
        <div className="measure mt-6 space-y-4">
          {now.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.12 + i * 0.06}>
              <p className="text-[1.05rem] leading-relaxed text-paper sm:text-[1.15rem]">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
