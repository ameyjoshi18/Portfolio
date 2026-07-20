import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/shell/SiteShell";
import { CaseStudyArticle } from "@/components/work/CaseStudyArticle";
import {
  getCaseStudyParams,
  getPublishedCaseStudy,
} from "@/content/selectors";
import { createPageMetadata } from "@/lib/pageMetadata";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCaseStudyParams();
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getPublishedCaseStudy(slug);
  if (!study) return {};

  return createPageMetadata({
    title: `${study.title} — Amey Joshi`,
    description: study.summary,
    path: `/work/${study.slug}`,
  });
}

export default async function WorkDetailPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const study = getPublishedCaseStudy(slug);

  if (!study) notFound();

  return (
    <SiteShell active="work">
      <main id="main-content" tabIndex={-1}>
        <CaseStudyArticle study={study} />
      </main>
    </SiteShell>
  );
}
