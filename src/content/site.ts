// Site copy — first person, written from the facts only. No invented metrics or clients.

export const site = {
  name: "Amey Joshi",
  role: "Business Analyst — Fino Payments Bank",
  location: "Navi Mumbai",
  email: "ameyjoshi1881@gmail.com",
  linkedin: "https://linkedin.com/in/ameyjoshi180696",
  domain: "ameyjoshi.in",
};

export const hero = {
  eyebrow: "Business Analyst — Fino Payments Bank",
  headline: "Right now, I'm replacing a bank's core system while the bank stays open.",
  sub: "Amey Joshi. Navi Mumbai.",
  scrollHint: "Scroll",
};

export const now = {
  kicker: "2025 — now",
  title: "Fino Payments Bank",
  paragraphs: [
    "In 2025 I joined Fino Payments Bank. My first project was migrating the bank's core system from FIS to Finacle — while the bank stayed open. There's no maintenance window big enough to take a live bank offline; you replace the engine while it's running.",
    "Since then: AePS, Domestic Money Transfer, eKYC, mATM certification, EMV 3DS, and contactless and NCMC cards. Different rails, same question every time — does this side actually talk to that side, correctly, under load.",
  ],
};

export type ExpertiseArea = {
  id: string;
  short: string;
  title: string;
  description: string;
};

export const expertise: ExpertiseArea[] = [
  {
    id: "dmt",
    short: "DMT",
    title: "Domestic Money Transfer",
    description:
      "The agent-assisted cash-in flow, the IMPS leg that actually moves the money, NPCI switching in between, and reconciliation after — so the numbers match at the end of the day.",
  },
  {
    id: "aeps",
    short: "AePS",
    title: "Aadhaar-enabled Payments",
    description:
      "Aadhaar-based authentication through UIDAI, the hop from acquirer to NPCI to issuer, what happens when the biometric read fails, and how settlement closes it out.",
  },
  {
    id: "cards",
    short: "Cards",
    title: "Cards & EMV",
    description:
      "Contactless and NCMC transit cards, EMV 3DS for online authentication, and how PIN data stays encrypted the whole way through.",
  },
  {
    id: "rails",
    short: "Rails",
    title: "UPI, NACH, POS, mATM",
    description:
      "The rest of the plumbing — the rails most people never think about until one of them doesn't work.",
  },
  {
    id: "core",
    short: "Core",
    title: "Core Banking",
    description:
      "FIS, Finacle, and TCS BaNCS. What it takes to move a bank from one to another without anyone outside noticing.",
  },
  {
    id: "governance",
    short: "Governance",
    title: "Delivery Governance",
    description:
      "BRDs and FRDs that hold up under audit, UAT that actually catches problems before go-live, release management, and vendors who have to hit the same date you do.",
  },
];

export type BuildingProject = {
  id: string;
  name: string;
  status: string;
  paragraphs: string[];
};

export const building = {
  kicker: "Outside the job",
  title: "What I'm building",
  intro:
    "Twenty years ago it was a Nokia phone and a USB cable, teaching myself what a network connection even was. The tools change — right now it's LLMs and workflow automation — but the instinct hasn't: find whatever's new, and use it to do something that wasn't possible before. Not because I'm afraid of falling behind. Because that's the actual point.",
  projects: [
    {
      id: "reglens",
      name: "RegLens AI (Tabularium)",
      status: "Working local prototype",
      paragraphs: [
        "A copilot for the regulatory side of being a BA in banking. Right now it's a working local prototype: retrieval-augmented Q&A over RBI circulars, plus a first pass at mapping which parts of a system a new circular actually affects. Built on FastAPI, Ollama, and PostgreSQL.",
        "I built it to learn how tooling like this should actually work, not because a team asked for it. The impact-mapping isn't precise enough yet, and the interface needs a full rebuild. A recorded walkthrough and a written case study are next.",
      ],
    },
    {
      id: "node-factory",
      name: "Node Factory",
      status: "Pre-launch",
      paragraphs: [
        "Ready-made n8n automation workflows for small businesses that don't have time to build their own. The brand and the product assets are built. It hasn't launched yet.",
      ],
    },
  ] as BuildingProject[],
};

export const storyTeaser = {
  kicker: "Where this started",
  title: "There's more before this",
  body: "Before the banks, there was a software consultancy with zero clients in its first year, and a gaming café that stayed open through two lockdowns on borrowed money.",
  cta: "Read the story",
};

export const contact = {
  heading: "If you're working on banking or payments infrastructure",
  body: "I sit between the business side and the engineering side and make both of them understood. Email me, or find me on LinkedIn.",
  cta: "Email me",
};
