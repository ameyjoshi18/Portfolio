import Image from "next/image";
import { Reveal } from "./Reveal";

export function Portrait() {
  return (
    <section
      id="portrait"
      className="flex min-h-[100dvh] flex-col items-center justify-center px-5 py-24 sm:px-8"
    >
      <Reveal className="w-full max-w-sm sm:max-w-md">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src="/portrait.jpg"
            alt="Amey Joshi, lit against a dark background, looking off to the side."
            fill
            priority
            sizes="(max-width: 640px) 90vw, 420px"
            className="object-cover"
          />
        </div>
        <p className="mt-5 font-display text-sm tracking-wide text-ink-soft">
          Amey Joshi — Navi Mumbai
        </p>
      </Reveal>
    </section>
  );
}
