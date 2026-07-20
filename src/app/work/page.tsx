import { SiteShell } from "@/components/shell/SiteShell";
import { WorkRegister } from "@/components/work/WorkRegister";
import { getPublishedCaseStudies } from "@/content/selectors";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "Work — Amey Joshi",
  description:
    "Verified, bounded engagement notes from Amey Joshi's banking and delivery work.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <SiteShell active="work">
      <main id="main-content" tabIndex={-1}>
        <WorkRegister caseStudies={getPublishedCaseStudies()} />
      </main>
    </SiteShell>
  );
}
