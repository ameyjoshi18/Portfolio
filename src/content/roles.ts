import type { Role } from "./schema";

export const roles = [
  {
    id: "zenox-technologies",
    organisation: "Zenox Technologies",
    title: "Project Manager & Technical Consultant",
    period: "Jun 2019 — Mar 2024",
    location: "Kolhapur, India",
    summary:
      "Ran delivery end to end across digital builds, from scope and clients to teams and release dates.",
    publication: "published",
  },
  {
    id: "idfc-first-bank",
    organisation: "IDFC FIRST Bank",
    title: "Business Test Analyst · via Honeybee Tech Solutions",
    period: "Apr 2024 — Jan 2025",
    location: "Mumbai, India",
    summary:
      "Worked across wealth-management technology, integrations, UAT, regression and defensible release sign-offs.",
    publication: "published",
  },
  {
    id: "fino-payments-bank",
    organisation: "Fino Payments Bank",
    title: "Business Analyst · Enterprise Programs",
    period: "Jan 2025 — Present",
    location: "Navi Mumbai, India",
    summary:
      "Aligns business, engineering and vendors across payments and core-banking delivery.",
    publication: "published",
  },
] as const satisfies readonly Role[];
