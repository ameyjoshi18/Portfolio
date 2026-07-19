import { Experience } from "@/components/experience/Experience";
import { ExperienceMotionProvider } from "@/components/experience/ExperienceMotionProvider";
import { SiteShell } from "@/components/shell/SiteShell";

export default function Home() {
  return (
    <SiteShell active="experience">
      <main id="main-content">
        <ExperienceMotionProvider>
          <Experience />
        </ExperienceMotionProvider>
      </main>
    </SiteShell>
  );
}
