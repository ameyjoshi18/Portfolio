import { caseStudies } from "./case-studies";
import { roles } from "./roles";
import type { CaseStudy, Role } from "./schema";
import { storyChapters } from "./story";

const requiredStudyStrings: readonly (keyof CaseStudy)[] = [
  "slug",
  "title",
  "summary",
  "premise",
  "context",
  "mandate",
  "responsibility",
  "tradeoff",
  "validationAndRelease",
];

export function selectPublishedCaseStudies(
  input: readonly CaseStudy[],
): readonly CaseStudy[] {
  return input.filter((study) => study.publication === "published");
}

export function assertContentIntegrity(input: {
  caseStudies: readonly CaseStudy[];
  roles: readonly Role[];
}): void {
  const slugs = new Set<string>();

  for (const study of input.caseStudies) {
    if (slugs.has(study.slug)) {
      throw new Error(`Duplicate case-study slug: ${study.slug}`);
    }
    slugs.add(study.slug);

    if (study.publication === "published") {
      for (const key of requiredStudyStrings) {
        const value = study[key];
        if (typeof value === "string" && value.trim().length === 0) {
          throw new Error(`Published case study is missing ${key}`);
        }
      }

      if (
        study.constraints.length === 0 ||
        study.processAndArtifacts.length === 0
      ) {
        throw new Error(
          "Published case study requires constraints and artifacts",
        );
      }
    }
  }

  const roleIds = new Set<string>();
  for (const role of input.roles) {
    if (roleIds.has(role.id)) {
      throw new Error(`Duplicate role id: ${role.id}`);
    }
    roleIds.add(role.id);
  }
}

assertContentIntegrity({ caseStudies, roles });

export function getPublishedCaseStudies(): readonly CaseStudy[] {
  return selectPublishedCaseStudies(caseStudies);
}

export function getPublishedCaseStudy(slug: string): CaseStudy | undefined {
  return getPublishedCaseStudies().find((study) => study.slug === slug);
}

export function getPublishedRoles(): readonly Role[] {
  return roles.filter((role) => role.publication === "published");
}

export function getStoryChapters() {
  return storyChapters;
}

export function getCaseStudyParams(): Array<{ slug: string }> {
  return getPublishedCaseStudies().map(({ slug }) => ({ slug }));
}
