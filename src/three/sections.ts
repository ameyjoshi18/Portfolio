export const SECTION_IDS = [
  "hero",
  "portrait",
  "now",
  "expertise",
  "building",
  "story-teaser",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

// Background each state washes the canvas AND the page to — the 3D and the page
// are one surface, not a canvas with content on top of it.
export const SECTION_BG: Record<SectionId, string> = {
  hero: "#faf4e8",
  portrait: "#f2e8d5",
  now: "#a83d0d",
  expertise: "#faf4e8",
  building: "#1c1712",
  "story-teaser": "#14663f",
  contact: "#faf4e8",
};
