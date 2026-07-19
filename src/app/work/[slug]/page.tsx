import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/shell/SiteShell";
import { CaseStudyArticle } from "@/components/work/CaseStudyArticle";
import {
  getCaseStudyParams,
  getPublishedCaseStudy,
} from "@/content/selectors";

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

  return {
    title: `${study.title} — Amey Joshi`,
    description: study.summary,
    alternates: { canonical: `/work/${study.slug}` },
  };
}

export default async function WorkDetailPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const study = getPublishedCaseStudy(slug);

  if (!study) notFound();

  return (
    <SiteShell active="work">
      <main id="main-content">
        <CaseStudyArticle study={study} />
      </main>
    </SiteShell>
  );
}
