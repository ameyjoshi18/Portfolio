import { expertise } from "@/content/site";
import { Reveal } from "./Reveal";

export function ExpertiseSection() {
  return (
    <section id="expertise" className="px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-copper">
          Six areas, deepest first
        </p>
        <h2 className="font-display mt-4 max-w-2xl text-3xl text-paper sm:text-5xl">
          What I actually know
        </h2>
      </Reveal>

      <ol className="mt-14 divide-y divide-paper/10 sm:mt-20">
        {expertise.map((area, i) => (
          <li key={area.id} id={`expertise-${area.id}`}>
            <Reveal delay={i * 0.04}>
              <div className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 gap-y-2 py-6 sm:grid-cols-[5rem_14rem_1fr] sm:gap-x-8 sm:py-8">
                <span
                  className="font-display text-lg text-paper-dim sm:text-2xl"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display col-start-2 text-xl text-paper sm:col-start-2 sm:text-2xl">
                  {area.title}
                </h3>
                <p className="col-span-2 measure text-[1rem] leading-relaxed text-paper-dim sm:col-span-1 sm:col-start-3 sm:text-[1.05rem]">
                  {area.description}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
