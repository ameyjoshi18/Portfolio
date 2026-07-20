import { IndexDossier } from "@/components/index/IndexDossier";
import { SiteShell } from "@/components/shell/SiteShell";
import {
  getPublishedCaseStudies,
  getPublishedRoles,
} from "@/content/selectors";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
  title: "Index — Amey Joshi",
  description:
    "A direct register of Amey Joshi's banking domains, working method and career.",
  path: "/index",
});

export default function DossierPage() {
  return (
    <SiteShell active="index">
      <main id="main-content" tabIndex={-1}>
        <IndexDossier
          caseStudies={getPublishedCaseStudies()}
          roles={getPublishedRoles()}
        />
      </main>
    </SiteShell>
  );
}
