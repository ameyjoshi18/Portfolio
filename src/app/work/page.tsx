import type { Metadata } from "next";

import { SiteShell } from "@/components/shell/SiteShell";
import { WorkRegister } from "@/components/work/WorkRegister";
import { getPublishedCaseStudies } from "@/content/selectors";

export const metadata: Metadata = {
  title: "Work — Amey Joshi",
  description:
    "Verified, bounded engagement notes from Amey Joshi's banking and delivery work.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <SiteShell active="work">
      <main id="main-content">
        <WorkRegister caseStudies={getPublishedCaseStudies()} />
      </main>
    </SiteShell>
  );
}
