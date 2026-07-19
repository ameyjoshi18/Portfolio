import type { CaseStudy } from "./schema";

// Bounded engagements are added only after their public facts are confirmed.
export const caseStudies = [] as const satisfies readonly CaseStudy[];
