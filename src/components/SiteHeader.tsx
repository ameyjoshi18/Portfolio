import Link from "next/link";
import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between bg-paper px-5 py-4 sm:px-8 sm:py-6">
      <Link
        href="/"
        className="font-display text-sm tracking-wide text-ink transition-colors hover:text-terracotta"
      >
        Amey Joshi
      </Link>
      <nav className="flex items-center gap-5 sm:gap-7">
        <Link
          href="/story"
          className="font-display text-xs tracking-wide text-ink-soft transition-colors hover:text-terracotta sm:text-sm"
        >
          Story
        </Link>
        <a
          href={`mailto:${site.email}`}
          className="font-display hidden text-xs tracking-wide text-ink-soft transition-colors hover:text-terracotta sm:inline sm:text-sm"
        >
          {site.email}
        </a>
      </nav>
    </header>
  );
}
