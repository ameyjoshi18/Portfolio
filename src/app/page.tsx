import { CanvasStage } from "@/components/CanvasStage";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { Portrait } from "@/components/Portrait";
import { NowSection } from "@/components/NowSection";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { BuildingSection } from "@/components/BuildingSection";
import { StoryTeaserSection } from "@/components/StoryTeaserSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <CanvasStage />
      <SiteHeader />
      <main id="main" className="relative z-10">
        <Hero />
        <Portrait />
        <NowSection />
        <ExpertiseSection />
        <BuildingSection />
        <StoryTeaserSection />
        <ContactSection />
      </main>
    </>
  );
}
