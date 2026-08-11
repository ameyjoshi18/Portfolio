import { CanvasStage } from "@/components/CanvasStage";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { Portrait } from "@/components/Portrait";
import { ChapterSection } from "@/components/ChapterSection";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { ContactSection } from "@/components/ContactSection";
import { chapters } from "@/content/site";

export default function Home() {
  return (
    <>
      <CanvasStage />
      <SiteHeader />
      <main id="main" className="relative z-10">
        <Hero />
        <Portrait />
        {chapters.map((chapter, i) => (
          <ChapterSection key={chapter.id} chapter={chapter} align={i % 2 === 0 ? "left" : "right"} />
        ))}
        <ExpertiseSection />
        <ContactSection />
      </main>
    </>
  );
}
