import type { StoryChapter } from "./schema";

export const storyChapters = [
  {
    id: "kodoli",
    eyebrow: "The 2000s · Kodoli",
    title: "Curiosity with a keyboard.",
    body: [
      "Games came first. Then the machines running them. Weekends meant LAN cables, Counter-Strike and Dota—and a question that stayed: how does all of this actually work?",
    ],
  },
  {
    id: "college",
    eyebrow: "Bharati Vidyapeeth · BCA",
    title: "We wanted a company.",
    body: [
      "A final-year Office Automation System became something the college actually deployed. Real people depended on software Amey and his co-founder had built.",
    ],
  },
  {
    id: "zenox",
    eyebrow: "2019–2024 · Kolhapur",
    title: "Build first. Learn what the work demands.",
    body: [
      "Zenox Technologies began in a rented apartment. With no clients in year one, the team kept making—then word of mouth turned experiments into sustained delivery work.",
    ],
  },
  {
    id: "rb-esports",
    eyebrow: "2020–2021 · Two red signals",
    title: "The doors closed. The work did not.",
    body: [
      "COVID erased projects overnight. RB Esports then opened from a belief in gaming, survived a second lockdown and reopened with a broader hardware business.",
    ],
  },
  {
    id: "interchange",
    eyebrow: "Late 2023 · The interchange",
    title: "A career change that named the work already happening.",
    body: [
      "Across projects, the recurring role was asking why, structuring scattered ideas and standing between a business problem and its technical answer. Business Analysis gave that pattern a name.",
    ],
  },
  {
    id: "banking",
    eyebrow: "2024 onward · Mumbai",
    title: "Startup speed. Enterprise responsibility.",
    body: [
      "Banking added compliance, audit, security, operations and regulators to every delivery decision. The aim now is to keep the instinct to build while working at greater scale.",
    ],
  },
] as const satisfies readonly StoryChapter[];
