import type { Metadata } from "next";

import { IndexDossier } from "@/components/index/IndexDossier";
import { SiteShell } from "@/components/shell/SiteShell";
import {
  getPublishedCaseStudies,
  getPublishedRoles,
} from "@/content/selectors";

export const metadata: Metadata = {
  title: "Index — Amey Joshi",
  description:
    "A direct register of Amey Joshi's banking domains, working method and career.",
  alternates: { canonical: "/index" },
};

export default function IndexPage() {
  return (
    <SiteShell active="index">
      <main id="main-content">
        <IndexDossier
          caseStudies={getPublishedCaseStudies()}
          roles={getPublishedRoles()}
        />
      </main>
    </SiteShell>
  );
}
