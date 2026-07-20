import type { MetadataRoute } from "next";

import { caseStudies } from "@/content/case-studies";
import type { CaseStudy } from "@/content/schema";
import { selectPublishedCaseStudies } from "@/content/selectors";

const origin = "https://ameyjoshi.in";

const stableRoutes = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/index", changeFrequency: "monthly", priority: 0.9 },
  { path: "/work", changeFrequency: "monthly", priority: 0.8 },
  { path: "/story", changeFrequency: "yearly", priority: 0.7 },
] as const;

export function buildSitemap(
  studies: readonly CaseStudy[],
): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = stableRoutes.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${origin}${path}`,
      changeFrequency,
      priority,
    }),
  );

  const studyRoutes: MetadataRoute.Sitemap = selectPublishedCaseStudies(
    studies,
  ).map(({ slug }) => ({
    url: `${origin}/work/${slug}`,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...routes, ...studyRoutes];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(caseStudies);
}
