import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between bg-ink px-5 py-4 sm:px-8 sm:py-6">
      <a
        href="#hero"
        className="font-display text-sm tracking-wide text-paper/90 transition-colors hover:text-copper"
      >
        Amey Joshi
      </a>
      <a
        href={`mailto:${site.email}`}
        className="font-display text-xs tracking-wide text-paper-dim transition-colors hover:text-copper sm:text-sm"
      >
        {site.email}
      </a>
    </header>
  );
}
