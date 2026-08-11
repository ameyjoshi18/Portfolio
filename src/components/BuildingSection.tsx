import { building } from "@/content/site";
import { Reveal } from "./Reveal";

export function BuildingSection() {
  return (
    <section id="building" className="px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-terracotta-light">
          {building.kicker}
        </p>
        <h2 className="font-display mt-4 max-w-2xl text-3xl text-paper sm:text-5xl">
          {building.title}
        </h2>
        <p className="measure mt-6 text-[1.05rem] leading-relaxed text-paper/85 sm:text-lg">
          {building.intro}
        </p>
      </Reveal>

      <div className="mt-16 space-y-14 sm:mt-20 sm:space-y-16">
        {building.projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.08}>
            <div className="max-w-2xl border-t border-paper/15 pt-8">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-xl text-paper sm:text-2xl">{project.name}</h3>
                <span className="font-display text-xs uppercase tracking-[0.15em] text-green-light">
                  {project.status}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {project.paragraphs.map((p, j) => (
                  <p key={j} className="text-[1rem] leading-relaxed text-paper/85 sm:text-[1.05rem]">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
