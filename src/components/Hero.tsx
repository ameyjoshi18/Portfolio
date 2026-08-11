import { hero } from "@/content/site";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-[100dvh] flex-col justify-center px-5 sm:px-8"
    >
      <div className="max-w-3xl">
        <Reveal>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-copper sm:text-sm">
            {hero.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="font-display mt-4 text-[2.4rem] leading-[1.08] text-paper sm:text-6xl md:text-7xl">
            {hero.headline}
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-paper-dim sm:text-lg">
            {hero.sub}
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.3}>
        <div className="mt-16 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-paper-dim sm:mt-24">
          <span className="h-px w-8 bg-paper-dim/60" aria-hidden="true" />
          {hero.scrollHint}
        </div>
      </Reveal>
    </section>
  );
}
