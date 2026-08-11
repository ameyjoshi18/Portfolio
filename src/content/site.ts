// Site copy — first person, written from the facts only. No invented metrics or clients.

export const site = {
  name: "Amey Joshi",
  role: "Business Analyst — Banking & Payments",
  location: "Navi Mumbai",
  email: "ameyjoshi1881@gmail.com",
  linkedin: "https://linkedin.com/in/ameyjoshi180696",
  domain: "ameyjoshi.in",
};

export const hero = {
  eyebrow: "Business Analyst — Banking & Payments",
  headline: "I make systems that can't talk to each other, talk.",
  sub: "Amey Joshi. Navi Mumbai, by way of Kodoli, near Kolhapur.",
  scrollHint: "Scroll — this whole page is one build",
};

export type Chapter = {
  id: string;
  kicker: string;
  title: string;
  years: string;
  paragraphs: string[];
};

export const chapters: Chapter[] = [
  {
    id: "origin",
    kicker: "Where it started",
    title: "Kodoli",
    years: "6th standard",
    paragraphs: [
      "It started in 6th standard, in Kodoli, near Kolhapur. We had a PC with no internet connection. I had a Nokia phone that did.",
      "I'd plug the phone into the PC with a USB cable, open PC Suite, and dial up over 2G. Watching one webpage load was the whole achievement.",
      "Twenty years later I'm still doing the same thing, just at a different scale — getting two things that don't talk to each other to talk.",
    ],
  },
  {
    id: "zenox",
    kicker: "2018 – 2024",
    title: "Zenox Technologies",
    years: "2018–2024",
    paragraphs: [
      "In 2018 I co-founded Zenox Technologies, a software consultancy in Kolhapur. We built websites, web apps, e-commerce stores, and portals for universities.",
      "Year one, we had zero clients. No sales team, no ad budget — just work that held up long enough for the next referral.",
      "By word of mouth alone, we grew past twenty clients. I ran that until 2024.",
    ],
  },
  {
    id: "rb-esports",
    kicker: "Feb 2021 – ongoing",
    title: "RB Esports",
    years: "2021–now",
    paragraphs: [
      "In February 2021, in the middle of the pandemic, I co-founded RB Esports, a gaming café in Kolhapur. It's still running.",
      "We closed for five months during one lockdown and kept paying the loan on the machines the entire time we couldn't open the doors. Those payments are still due, every month.",
      "The café made it through two lockdowns because we didn't stop paying for it when it wasn't earning anything back.",
    ],
  },
  {
    id: "idfc",
    kicker: "2024 – 2025",
    title: "IDFC First Bank",
    years: "2024–2025",
    paragraphs: [
      "In 2024 I moved into banking, as a Business Analyst at IDFC First Bank. I worked on NRI-PIS, ASBA, Demat accounts, and the API integrations that connect them.",
      "It's the same work as before, dressed differently: systems that have to pass information to each other correctly, on the first try, with someone's money on the line.",
    ],
  },
  {
    id: "fino",
    kicker: "2025 – now",
    title: "Fino Payments Bank",
    years: "2025–now",
    paragraphs: [
      "In 2025 I joined Fino Payments Bank. My first project was migrating the bank's core system from FIS to Finacle — while the bank stayed open.",
      "There's no maintenance window big enough to take a live bank offline. You replace the engine while it's running.",
      "After that: AePS, Domestic Money Transfer, eKYC, mATM certification, EMV 3DS, and contactless and NCMC cards. Different rails, same question every time — does this side actually talk to that side, correctly, under load.",
    ],
  },
];

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

export const contact = {
  heading: "If you're working on banking or payments infrastructure",
  body: "I sit between the business side and the engineering side and make both of them understood. Email me, or find me on LinkedIn.",
  cta: "Email me",
};
