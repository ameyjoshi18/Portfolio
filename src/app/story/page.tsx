import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "The story — Amey Joshi",
  description: "Coming soon.",
};

export default function StoryPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex min-h-[100dvh] flex-col justify-center bg-paper px-5 sm:px-8">
        <div className="max-w-xl">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-terracotta">
            Coming soon
          </p>
          <h1 className="font-display mt-4 text-4xl text-ink sm:text-6xl">The story</h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink-soft sm:text-lg">
            Kodoli, Zenox Technologies, RB Esports, and how a kid with no internet
            connection ended up moving money for a living. This page is still being
            written.
          </p>
          <Link
            href="/"
            className="font-display mt-10 inline-flex items-center gap-2 text-base text-terracotta underline decoration-terracotta/40 underline-offset-4 transition-colors hover:decoration-terracotta"
          >
            <span aria-hidden="true">←</span>
            Back home
          </Link>
        </div>
      </main>
    </>
  );
}
