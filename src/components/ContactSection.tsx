import { contact, site } from "@/content/site";
import { Reveal } from "./Reveal";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="flex min-h-[100dvh] flex-col justify-center px-5 py-24 sm:px-8"
    >
      <Reveal>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-green">
          <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true" />
          Open to hearing about new work
        </div>
        <h2 className="font-display mt-5 max-w-2xl text-3xl text-ink sm:text-5xl">
          {contact.heading}
        </h2>
        <p className="measure mt-6 text-[1.05rem] leading-relaxed text-ink-soft sm:text-lg">
          {contact.body}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-wrap items-center gap-4 sm:mt-14 sm:gap-6">
          <a
            href={`mailto:${site.email}`}
            className="font-display rounded-full bg-terracotta px-7 py-3.5 text-sm text-paper transition-transform hover:scale-[1.03] focus-visible:scale-[1.03] sm:text-base"
          >
            {contact.cta}
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="font-display text-sm text-ink-soft underline decoration-ink-soft/40 underline-offset-4 transition-colors hover:text-terracotta sm:text-base"
          >
            LinkedIn
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-24 text-xs tracking-wide text-ink-soft sm:mt-32">
          {site.domain} — Navi Mumbai
        </p>
      </Reveal>
    </section>
  );
}
