import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export type SectionRange = { id: string; start: number; end: number };

/**
 * Mutable, non-reactive scroll state. The R3F render loop reads this directly
 * every frame via useFrame — it must never go through React state, or every
 * scroll tick would trigger a full component re-render.
 */
export const scrollState = {
  progress: 0,
  sections: [] as SectionRange[],
};

let lenis: Lenis | null = null;
let trigger: ScrollTrigger | null = null;
let tickerFn: ((time: number) => void) | null = null;

export function currentSectionProgress(id: string): number {
  const range = scrollState.sections.find((s) => s.id === id);
  if (!range) return 0;
  if (range.end <= range.start) return 0;
  const p = (scrollState.progress - range.start) / (range.end - range.start);
  return Math.min(1, Math.max(0, p));
}

export function initScrollEngine(sectionIds: string[]): () => void {
  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  tickerFn = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  const measureSections = () => {
    const doc = document.documentElement;
    const total = doc.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    scrollState.sections = sectionIds.map((id, i) => {
      const el = document.getElementById(id);
      const top = el ? el.offsetTop : 0;
      const nextEl = sectionIds[i + 1] ? document.getElementById(sectionIds[i + 1]) : null;
      // The last section has no sibling to bound it — use max scroll, not full
      // document height (which overshoots by one viewport and pins progress at ~0).
      const bottom = nextEl ? nextEl.offsetTop : total;
      return { id, start: top / total, end: bottom / total };
    });
  };

  trigger = ScrollTrigger.create({
    trigger: document.documentElement,
    start: "top top",
    end: "bottom bottom",
    scrub: 0,
    onUpdate: (self) => {
      scrollState.progress = self.progress;
    },
    onRefresh: measureSections,
  });

  measureSections();
  window.addEventListener("resize", measureSections);

  // Fonts/images can still shift layout after this first measurement; a couple
  // of follow-up refreshes keep the trigger's "bottom" honest without needing
  // to wire up per-asset load listeners.
  const refreshSoon = () => ScrollTrigger.refresh();
  window.addEventListener("load", refreshSoon);
  const settleTimer = window.setTimeout(refreshSoon, 500);

  return () => {
    window.removeEventListener("resize", measureSections);
    window.removeEventListener("load", refreshSoon);
    window.clearTimeout(settleTimer);
    trigger?.kill();
    trigger = null;
    if (tickerFn) gsap.ticker.remove(tickerFn);
    tickerFn = null;
    lenis?.destroy();
    lenis = null;
  };
}
