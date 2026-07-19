# Clarity Engine Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two monolithic static pages with a statically rendered Next.js portfolio that offers a cinematic Clarity Engine experience and a fast evidence Index from one verified content model.

**Architecture:** Next.js App Router and React Server Components render every essential fact, heading and link. Small `motion/react` client islands progressively enhance the Experience; one capability-gated React Three Fiber scene visualizes cutover workstream convergence while leaving the semantic SVG fallback mounted. Typed content selectors prevent draft or unverified case studies from leaking into published routes.

**Tech Stack:** Next.js App Router, strict TypeScript, React, CSS Modules, CSS custom properties, `motion/react`, Three.js, React Three Fiber, Vitest, Testing Library, Playwright, axe-core, Lighthouse CI, pnpm and Vercel.

## Global Constraints

- Preserve the current Git history and rebuild in the existing repository; do not patch the inline GSAP/Lenis/Three.js implementation.
- Use `import { motion } from "motion/react"`; do not install or import the legacy `framer-motion` package.
- Native scrolling only. Do not add Lenis, GSAP, ScrollTrigger, wheel interception, a custom cursor or blocking preloader.
- Motion uses only **Drift**, **Align** and **Flow**. Drift is 8–32px, Align is 480–700ms, and only one Flow may be active in a viewport.
- At most two short desktop sticky sequences. Mobile and reduced-motion render ordinary document flow.
- Warm ivory `#F2EEE5` is the majority canvas. Obsidian `#070A0D` is reserved for cutover. Signal amber `#E7A11A` is decorative on ivory; accessible accent text uses `#765000`.
- Use Instrument Serif as the display voice, IBM Plex Sans for body/navigation and IBM Plex Mono only for technical metadata.
- Do not publish a case study unless it maps to a verified bounded engagement. One or two strong studies are preferable to a padded three-column layout.
- Do not use the three current AI-styled JPG illustrations. Story media is optional and absent media produces no visual placeholder.
- The experience must work without JavaScript, with `prefers-reduced-motion`, with `Save-Data`, and without WebGL.
- `/index`, `/work/*` and `/story` initial client JavaScript: ≤100KB compressed.
- `/` initial client JavaScript before 3D: ≤180KB compressed. Lazy 3D chunk: ≤300KB compressed and outside the LCP path.
- Production mobile p75 targets: LCP ≤2.5s, INP ≤200ms and CLS ≤0.1.
- One H1 per route, visible skip link/focus, WCAG AA text contrast, 44×44px touch targets and no horizontal overflow from 320px upward.

## File Structure

```text
src/
  app/
    fonts.ts
    globals.css
    layout.tsx
    page.tsx
    not-found.tsx
    opengraph-image.tsx
    robots.ts
    sitemap.ts
    index/page.tsx
    work/page.tsx
    work/[slug]/page.tsx
    story/page.tsx
  components/
    shell/
      SiteShell.tsx
      SiteHeader.tsx
      ViewSwitcher.tsx
      ContactFooter.tsx
      TruthLine.tsx
      shell.module.css
    index/
      IndexDossier.tsx
      index-dossier.module.css
    work/
      WorkRegister.tsx
      CaseStudyArticle.tsx
      work.module.css
    story/
      StoryArticle.tsx
      story.module.css
    experience/
      Experience.tsx
      ExperienceMotionProvider.tsx
      SceneMarker.tsx
      experience.module.css
      scenes/
        OpeningSequence.tsx
        opening-sequence.module.css
        TranslationScene.tsx
        TranslationExplorer.tsx
        translation-scene.module.css
        RailsScene.tsx
        DmtRailVisual.tsx
        rails-scene.module.css
        CutoverScene.tsx
        CutoverStatic.tsx
        CutoverEnhancement.tsx
        CutoverCanvas.tsx
        CutoverErrorBoundary.tsx
        cutover-scene.module.css
        EvidenceRegisterScene.tsx
        OriginScene.tsx
        OpenLine.tsx
        closing-scenes.module.css
  content/
    schema.ts
    site.ts
    roles.ts
    case-studies.ts
    story.ts
    experience.ts
    selectors.ts
  hooks/
    useDocumentVisibility.ts
    useMotionPolicy.ts
  lib/
    motion/policy.ts
    motion/tokens.ts
    rail/geometry.ts
tests/
  fixtures/content.ts
  unit/
    content.test.ts
    shell.test.tsx
    index-dossier.test.tsx
    work.test.tsx
    story.test.tsx
    motion-policy.test.ts
    motion-tokens.test.ts
    rail-geometry.test.ts
    experience-semantics.test.tsx
  e2e/
    routes.spec.ts
    accessibility.spec.ts
    responsive.spec.ts
    motion.spec.ts
    performance.spec.ts
eslint.config.mjs
next.config.ts
package.json
playwright.config.ts
tsconfig.json
vitest.config.ts
vitest.setup.ts
```

---

### Task 1: Framework, test harness and semantic first paint

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Test: `tests/unit/home.test.tsx`

**Interfaces:**
- Produces: `RootLayout({ children }: Readonly<{ children: React.ReactNode }>)` and a server-rendered `/` with `<main id="main-content">`.
- Consumes: no application interfaces.

- [ ] **Step 1: Create the package and tool configuration**

Create `package.json`:

```json
{
  "name": "amey-joshi-portfolio",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@11.11.0",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:a11y": "playwright test tests/e2e/accessibility.spec.ts",
    "validate": "pnpm lint && pnpm typecheck && pnpm test && pnpm build",
    "analyze": "cross-env ANALYZE=true next build",
    "lighthouse": "lhci autorun"
  }
}
```

Run:

```powershell
pnpm.cmd add --save-exact next@latest react@latest react-dom@latest motion@latest three@latest @react-three/fiber@latest
pnpm.cmd add -D --save-exact typescript@latest @types/node@latest @types/react@latest @types/react-dom@latest @types/three@latest eslint@latest eslint-config-next@latest vitest@latest jsdom@latest @vitejs/plugin-react@latest vite-tsconfig-paths@latest @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest @playwright/test@latest @axe-core/playwright@latest @next/bundle-analyzer@latest @lhci/cli@latest cross-env@latest
```

Expected: dependency installation succeeds and `pnpm-lock.yaml` is created.

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next.config.ts`:

```ts
import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const config: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
};

export default withBundleAnalyzer(config);
```

Create `eslint.config.mjs`:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([".next/**", "coverage/**", "playwright-report/**", "test-results/**"]),
]);
```

Create `vitest.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 2: Write the failing semantic first-paint test**

Create `tests/unit/home.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Experience first paint", () => {
  it("renders one readable identity heading and a main landmark", () => {
    const { container } = render(<Home />);
    expect(container.querySelector("main#main-content")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Amey Joshi.*Complexity in.*Clarity out/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
```

- [ ] **Step 3: Run the unit test and verify RED**

Run: `pnpm.cmd test -- tests/unit/home.test.tsx`

Expected: FAIL because `@/app/page` does not exist.

- [ ] **Step 4: Add the minimal server-rendered app**

Create `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main id="main-content">
      <h1>
        <span>Amey Joshi</span>
        <span>Complexity in. Clarity out.</span>
      </h1>
      <p>
        I turn business intent, regulatory constraint and technical reality
        into one system teams can ship.
      </p>
    </main>
  );
}
```

Create `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ameyjoshi.in"),
  title: "Amey Joshi — Banking systems and clarity",
  description:
    "Business Analyst working across banking, fintech, requirements, testing and enterprise delivery.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Create `src/app/globals.css`:

```css
:root {
  --ivory: #f2eee5;
  --graphite: #161a1d;
  color: var(--graphite);
  background: var(--ivory);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: auto;
}

body {
  margin: 0;
  min-width: 320px;
  background: var(--ivory);
  color: var(--graphite);
}
```

- [ ] **Step 5: Verify GREEN and baseline build**

Run:

```powershell
pnpm.cmd test -- tests/unit/home.test.tsx
pnpm.cmd typecheck
pnpm.cmd build
```

Expected: one passing test, zero TypeScript errors and a successful production build.

- [ ] **Step 6: Commit the foundation**

```powershell
git add package.json pnpm-lock.yaml tsconfig.json next.config.ts eslint.config.mjs vitest.config.ts vitest.setup.ts src/app tests/unit/home.test.tsx
git commit -m "build: establish the Next.js portfolio foundation"
```

---

### Task 2: Typed content and publication boundary

**Files:**
- Create: `src/content/schema.ts`
- Create: `src/content/site.ts`
- Create: `src/content/roles.ts`
- Create: `src/content/case-studies.ts`
- Create: `src/content/story.ts`
- Create: `src/content/experience.ts`
- Create: `src/content/selectors.ts`
- Create: `tests/fixtures/content.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Produces: `getPublishedCaseStudies()`, `getPublishedCaseStudy(slug)`, `getPublishedRoles()`, `getStoryChapters()`, `getCaseStudyParams()` and `assertContentIntegrity(input)`.
- Consumes: no application interfaces.

- [ ] **Step 1: Write publication-boundary tests**

Create `tests/unit/content.test.ts`:

```ts
import {
  assertContentIntegrity,
  selectPublishedCaseStudies,
} from "@/content/selectors";
import { draftStudy, publishedStudy } from "../fixtures/content";

describe("content publication boundary", () => {
  it("excludes draft case studies", () => {
    expect(selectPublishedCaseStudies([draftStudy, publishedStudy])).toEqual([
      publishedStudy,
    ]);
  });

  it("rejects duplicate case-study slugs", () => {
    expect(() =>
      assertContentIntegrity({
        caseStudies: [publishedStudy, { ...publishedStudy }],
        roles: [],
      }),
    ).toThrow(/duplicate case-study slug/i);
  });

  it("rejects an incomplete published dossier", () => {
    expect(() =>
      assertContentIntegrity({
        caseStudies: [{ ...publishedStudy, mandate: "" }],
        roles: [],
      }),
    ).toThrow(/mandate/i);
  });

  it("accepts a truthful non-disclosed outcome", () => {
    expect(() =>
      assertContentIntegrity({
        caseStudies: [
          { ...publishedStudy, outcome: { disclosure: "not-disclosed" } },
        ],
        roles: [],
      }),
    ).not.toThrow();
  });
});
```

Create `tests/fixtures/content.ts`:

```ts
import type { CaseStudy } from "@/content/schema";

export const publishedStudy: CaseStudy = {
  slug: "verified-engagement",
  publication: "published",
  title: "A verified engagement",
  summary: "A fixture used only by automated tests.",
  premise: "A bounded system change required coordinated delivery.",
  context: "The fixture contains no production claim.",
  mandate: "Create one shared delivery definition.",
  constraints: ["A fixed release boundary"],
  responsibility: "Translate and validate the delivery scope.",
  stakeholders: ["Business", "Engineering"],
  systemBoundaries: ["Source", "Destination"],
  processAndArtifacts: [
    { name: "Acceptance criteria", description: "Defined release evidence." },
  ],
  tradeoff: "Prefer verifiable scope to unbounded breadth.",
  validationAndRelease: "Validate against agreed acceptance criteria.",
  outcome: { disclosure: "not-disclosed" },
  capabilities: ["Requirements", "UAT"],
};

export const draftStudy: CaseStudy = {
  ...publishedStudy,
  slug: "draft-engagement",
  publication: "draft",
};
```

- [ ] **Step 2: Run the content tests and verify RED**

Run: `pnpm.cmd test -- tests/unit/content.test.ts`

Expected: FAIL because the schema and selectors do not exist.

- [ ] **Step 3: Implement the exact public content contracts**

Create `src/content/schema.ts`:

```ts
export type PublicationState = "draft" | "published";

export type Outcome =
  | { disclosure: "public"; text: string }
  | { disclosure: "not-disclosed" };

export type CaseStudy = {
  slug: string;
  publication: PublicationState;
  title: string;
  summary: string;
  premise: string;
  context: string;
  mandate: string;
  constraints: readonly string[];
  responsibility: string;
  stakeholders: readonly string[];
  systemBoundaries: readonly string[];
  processAndArtifacts: readonly { name: string; description: string }[];
  tradeoff: string;
  validationAndRelease: string;
  outcome: Outcome;
  capabilities: readonly string[];
};

export type Role = {
  id: string;
  organisation: string;
  title: string;
  period: string;
  location: string;
  summary: string;
  publication: PublicationState;
};

export type StoryChapter = {
  id: string;
  eyebrow: string;
  title: string;
  body: readonly string[];
  media?: { src: string; alt: string; caption?: string };
};

export type SiteProfile = {
  name: string;
  headline: string;
  positioning: string;
  role: string;
  location: string;
  email: string;
  linkedin: string;
  resumeHref?: string;
  domains: readonly string[];
  method: readonly { verb: string; detail: string }[];
};
```

Create the exact Experience data interfaces in `src/content/experience.ts`:

```ts
export type Verification = "confirmed" | "review";
export type SceneId =
  | "unresolved"
  | "one-truth"
  | "translation"
  | "rails"
  | "cutover"
  | "evidence"
  | "origin";

export type RailNode = {
  id: string;
  label: string;
  owner: string;
  detail: string;
  desktop: readonly [number, number];
  mobile: readonly [number, number];
};

export type RailLeg = {
  id: string;
  from: string;
  to: string;
  state: "normal" | "failure" | "reconciliation";
  label: string;
};

export type DmtRailModel = {
  verification: Verification;
  nodes: readonly RailNode[];
  legs: readonly RailLeg[];
  reconciliationQuestion: string;
};

export type CutoverWorkstream = {
  id: string;
  label: string;
  depth: number;
  responsibility: string;
  verification: Verification;
};
```

Create `src/content/selectors.ts`:

```ts
import { caseStudies } from "./case-studies";
import { roles } from "./roles";
import { storyChapters } from "./story";
import type { CaseStudy, Role } from "./schema";

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
        if (typeof study[key] === "string" && study[key].trim().length === 0) {
          throw new Error(`Published case study is missing ${key}`);
        }
      }
      if (study.constraints.length === 0 || study.processAndArtifacts.length === 0) {
        throw new Error("Published case study requires constraints and artifacts");
      }
    }
  }

  const roleIds = new Set<string>();
  for (const role of input.roles) {
    if (roleIds.has(role.id)) throw new Error(`Duplicate role id: ${role.id}`);
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
```

- [ ] **Step 4: Migrate only source-backed production content**

Create `src/content/site.ts`, `roles.ts`, `story.ts`, `case-studies.ts` and `experience.ts` from the current site. Use these publication rules:

```ts
// src/content/site.ts
import type { SiteProfile } from "./schema";

export const site: SiteProfile = {
  name: "Amey Joshi",
  headline: "Complexity in. Clarity out.",
  positioning:
    "I turn business intent, regulatory constraint and technical reality into one system teams can ship.",
  role: "Business Analyst · Banking & Fintech",
  location: "Navi Mumbai, India",
  email: "ameyjoshi1881@gmail.com",
  linkedin: "https://www.linkedin.com/in/ameyjoshi180696",
  domains: ["DMT", "AePS", "Cards", "UPI", "NACH", "POS", "mATM", "Core banking"],
  method: [
    { verb: "Define", detail: "Requirements, scope and one shared language" },
    { verb: "Design", detail: "Process maps, gaps and system boundaries" },
    { verb: "Validate", detail: "Acceptance, UAT and defect decisions" },
    { verb: "Deliver", detail: "Release governance, sign-off and stabilisation" },
  ],
};
```

All bounded case-study candidates remain `publication: "draft"` until Amey confirms their factual sections. The role and story modules may reuse only claims already present on the live site. `StoryChapter.media` is omitted until an approved real asset exists. `experience.ts` contains the confirmed stakeholder labels, translation stages, DMT rail labels and cutover workstreams; any record still awaiting validation carries `verification: "review"` and is filtered from animated evidence.

- [ ] **Step 5: Verify GREEN and commit**

Run: `pnpm.cmd test -- tests/unit/content.test.ts`

Expected: four passing tests.

```powershell
git add src/content tests/fixtures tests/unit/content.test.ts
git commit -m "feat: add verified typed portfolio content"
```

---

### Task 3: Shared shell, local typography and design tokens

**Files:**
- Create: `src/app/fonts.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `src/components/shell/SiteShell.tsx`
- Create: `src/components/shell/SiteHeader.tsx`
- Create: `src/components/shell/ViewSwitcher.tsx`
- Create: `src/components/shell/ContactFooter.tsx`
- Create: `src/components/shell/TruthLine.tsx`
- Create: `src/components/shell/shell.module.css`
- Test: `tests/unit/shell.test.tsx`

**Interfaces:**
- Produces: `SiteShell({ active, children })`, where `active` is `"experience" | "index" | "work" | "story"`.
- Consumes: `site` from `src/content/site.ts`.

- [ ] **Step 1: Write the semantic shell test**

Create `tests/unit/shell.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { SiteShell } from "@/components/shell/SiteShell";

it("provides skip navigation, ordinary route links and stable contact", () => {
  render(
    <SiteShell active="index">
      <main id="main-content"><h1>Index</h1></main>
    </SiteShell>,
  );
  expect(screen.getByRole("link", { name: /skip to main content/i })).toHaveAttribute("href", "#main-content");
  expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute("href", "/");
  expect(screen.getByRole("link", { name: "Index" })).toHaveAttribute("href", "/index");
  expect(screen.getByRole("link", { name: "Index" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("contentinfo")).toHaveAttribute("id", "contact");
  expect(screen.getByRole("link", { name: /ameyjoshi1881@gmail.com/i })).toBeVisible();
});
```

- [ ] **Step 2: Run the shell test and verify RED**

Run: `pnpm.cmd test -- tests/unit/shell.test.tsx`

Expected: FAIL because `SiteShell` does not exist.

- [ ] **Step 3: Implement the server-rendered shell**

Use ordinary `next/link` anchors. `SiteShell` renders the skip link, `SiteHeader`, its children and `ContactFooter`; pages retain ownership of their one `<main>`. The footer uses `id="contact"`. `ViewSwitcher` assigns `aria-current="page"` to the active route. `TruthLine` renders a decorative `<span aria-hidden="true">` and never carries essential meaning.

Create the global token block in `src/app/globals.css`:

```css
:root {
  --ivory: #f2eee5;
  --graphite: #161a1d;
  --obsidian: #070a0d;
  --signal: #e7a11a;
  --signal-ink: #765000;
  --steel: #525b60;
  --fault: #963d32;
  --font-display: var(--font-instrument-serif);
  --font-sans: var(--font-ibm-plex-sans);
  --font-mono: var(--font-ibm-plex-mono);
  --space-3: 1.5rem;
  --space-5: 2.5rem;
  --space-8: 4rem;
  --space-12: 6rem;
  --space-18: 9rem;
  --text-hero: clamp(4rem, 10vw, 9rem);
  --text-display: clamp(3rem, 6vw, 6rem);
  --text-section: clamp(2rem, 4vw, 4rem);
  --text-lead: clamp(1.125rem, 1.5vw, 1.375rem);
}

body {
  font-family: var(--font-sans), sans-serif;
  line-height: 1.65;
}

h1,
h2,
h3 {
  font-family: var(--font-display), serif;
  font-weight: 400;
}

:focus-visible {
  outline: 2px solid var(--graphite);
  outline-offset: 4px;
  box-shadow: 0 0 0 2px var(--signal);
}

.skipLink {
  position: fixed;
  inset: 0 auto auto 0;
  z-index: 1000;
  transform: translateY(-120%);
  background: var(--graphite);
  color: var(--ivory);
  padding: 0.75rem 1rem;
}

.skipLink:focus {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Create `src/app/fonts.ts`:

```ts
import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from "next/font/google";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const fontVariables = [
  instrumentSerif.variable,
  ibmPlexSans.variable,
  ibmPlexMono.variable,
].join(" ");
```

Attach `fontVariables` to `<body className={fontVariables}>` in `layout.tsx`. The browser receives self-hosted, subsetted font files from the Next build.

- [ ] **Step 4: Verify and commit**

Run:

```powershell
pnpm.cmd test -- tests/unit/shell.test.tsx
pnpm.cmd typecheck
pnpm.cmd lint
```

Expected: shell test passes; typecheck and lint exit zero.

```powershell
git add src/app src/components/shell tests/unit/shell.test.tsx
git commit -m "feat: establish the Clarity Engine shell"
```

---

### Task 4: Fast Index dossier

**Files:**
- Create: `src/app/index/page.tsx`
- Create: `src/components/index/IndexDossier.tsx`
- Create: `src/components/index/index-dossier.module.css`
- Test: `tests/unit/index-dossier.test.tsx`

**Interfaces:**
- Consumes: `site`, `getPublishedCaseStudies()` and `getPublishedRoles()`.
- Produces: a server-rendered `/index` route with identity, work, domains, method, career, origin note and contact path.

- [ ] **Step 1: Write the Index contract test**

Create `tests/unit/index-dossier.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { IndexDossier } from "@/components/index/IndexDossier";
import { publishedStudy } from "../fixtures/content";

it("renders a complete evidence path without JavaScript-only disclosure", () => {
  render(<IndexDossier caseStudies={[publishedStudy]} roles={[]} />);
  expect(screen.getByRole("heading", { level: 1, name: /Amey Joshi/i })).toBeVisible();
  expect(screen.getByRole("heading", { name: /Selected work/i })).toBeVisible();
  expect(screen.getByRole("link", { name: /A verified engagement/i })).toHaveAttribute("href", "/work/verified-engagement");
  expect(screen.getByRole("heading", { name: /Domain register/i })).toBeVisible();
  expect(screen.getByRole("heading", { name: /Working method/i })).toBeVisible();
  expect(screen.getByRole("heading", { name: /Career/i })).toBeVisible();
  expect(screen.getByRole("link", { name: /Read the story/i })).toHaveAttribute("href", "/story");
});
```

- [ ] **Step 2: Run the Index test and verify RED**

Run: `pnpm.cmd test -- tests/unit/index-dossier.test.tsx`

Expected: FAIL because `IndexDossier` does not exist.

- [ ] **Step 3: Implement the editorial Index**

`IndexDossier` accepts exact props:

```ts
type IndexDossierProps = {
  caseStudies: readonly CaseStudy[];
  roles: readonly Role[];
};
```

Render seven semantic sections in this order: identity, selected work, domain register, working method, career, origin note and contact direction. If `caseStudies` is empty, render the truthful sentence “Detailed engagement notes are being prepared; the domain register below remains available.” Do not render an empty card grid. If `site.resumeHref` is absent, render no resume link.

Use a twelve-column editorial grid at desktop, a single column below 768px, square edges, hairline rules and no entrance animations. The one truth line is a 1px structural rule that connects section labels; it is not the sole state indicator.

Create `src/app/index/page.tsx`:

```tsx
import { IndexDossier } from "@/components/index/IndexDossier";
import { SiteShell } from "@/components/shell/SiteShell";
import { getPublishedCaseStudies, getPublishedRoles } from "@/content/selectors";

export default function IndexPage() {
  return (
    <SiteShell active="index">
      <main id="main-content">
        <IndexDossier
          caseStudies={getPublishedCaseStudies()}
          roles={getPublishedRoles()}
        />
      </main>
    </SiteShell>
  );
}
```

- [ ] **Step 4: Verify the route and commit**

Run:

```powershell
pnpm.cmd test -- tests/unit/index-dossier.test.tsx
pnpm.cmd build
```

Expected: test passes and `/index` is listed as a statically rendered route.

```powershell
git add src/app/index src/components/index tests/unit/index-dossier.test.tsx
git commit -m "feat: add the fast evidence index"
```

---

### Task 5: Work register, case-study article and concise Story

**Files:**
- Create: `src/app/work/page.tsx`
- Create: `src/app/work/[slug]/page.tsx`
- Create: `src/app/story/page.tsx`
- Create: `src/components/work/WorkRegister.tsx`
- Create: `src/components/work/CaseStudyArticle.tsx`
- Create: `src/components/work/work.module.css`
- Create: `src/components/story/StoryArticle.tsx`
- Create: `src/components/story/story.module.css`
- Test: `tests/unit/work.test.tsx`
- Test: `tests/unit/story.test.tsx`

**Interfaces:**
- Consumes: the content selectors from Task 2 and `SiteShell` from Task 3.
- Produces: static `/work`, `/work/[slug]` and `/story` routes; `generateStaticParams()` returns `Array<{ slug: string }>`.

- [ ] **Step 1: Write the work and story tests**

Create `tests/unit/work.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { CaseStudyArticle } from "@/components/work/CaseStudyArticle";
import { WorkRegister } from "@/components/work/WorkRegister";
import { publishedStudy } from "../fixtures/content";

it("renders a truthful empty work register", () => {
  render(<WorkRegister caseStudies={[]} />);
  expect(screen.getByText(/engagement notes are being prepared/i)).toBeVisible();
  expect(screen.queryAllByRole("article")).toHaveLength(0);
});

it("renders every case-study evidence section in order", () => {
  const { container } = render(<CaseStudyArticle study={publishedStudy} />);
  expect(
    Array.from(container.querySelectorAll("section[data-dossier]"), (node) =>
      node.getAttribute("data-dossier"),
    ),
  ).toEqual([
    "premise",
    "context",
    "mandate",
    "constraints",
    "responsibility",
    "boundaries",
    "artifacts",
    "tradeoff",
    "validation",
    "outcome",
    "capabilities",
  ]);
  expect(screen.getByText(/not publicly disclosed/i)).toBeVisible();
});
```

Create `tests/unit/story.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { StoryArticle } from "@/components/story/StoryArticle";
import type { StoryChapter } from "@/content/schema";

const chapters: readonly StoryChapter[] = [
  { id: "first", eyebrow: "Origin", title: "First", body: ["First body"] },
  { id: "second", eyebrow: "Change", title: "Second", body: ["Second body"] },
];

it("keeps story order and omits absent media cleanly", () => {
  const { container } = render(<StoryArticle chapters={chapters} />);
  expect(screen.getAllByRole("heading", { level: 2 }).map((node) => node.textContent)).toEqual(["First", "Second"]);
  expect(container.querySelector("img")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run both tests and verify RED**

Run: `pnpm.cmd test -- tests/unit/work.test.tsx tests/unit/story.test.tsx`

Expected: FAIL because the route components do not exist.

- [ ] **Step 3: Implement work routing and dossier semantics**

`WorkRegister` accepts `readonly CaseStudy[]`, renders direct links for published studies and the exact empty-state sentence tested above when none are published. `CaseStudyArticle` renders the eleven ordered `data-dossier` sections and writes “Outcome details are not publicly disclosed.” for `outcome.disclosure === "not-disclosed"`.

Create `src/app/work/[slug]/page.tsx` with these route boundaries:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyArticle } from "@/components/work/CaseStudyArticle";
import { SiteShell } from "@/components/shell/SiteShell";
import {
  getCaseStudyParams,
  getPublishedCaseStudy,
} from "@/content/selectors";

type WorkPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCaseStudyParams();
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
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
```

- [ ] **Step 4: Implement the concise story**

`StoryArticle` renders one page introduction followed by source-ordered chapters. When `chapter.media` exists it uses `next/image` with explicit dimensions or `fill` inside an aspect-ratio wrapper; otherwise it renders no image container. Preserve the Kodoli → college → Zenox → COVID/RB Esports → Business Analysis → banking arc without the train canvas or duplicate long-form appendix.

Create `src/app/story/page.tsx`:

```tsx
import { SiteShell } from "@/components/shell/SiteShell";
import { StoryArticle } from "@/components/story/StoryArticle";
import { getStoryChapters } from "@/content/selectors";

export default function StoryPage() {
  return (
    <SiteShell active="story">
      <main id="main-content">
        <StoryArticle chapters={getStoryChapters()} />
      </main>
    </SiteShell>
  );
}
```

- [ ] **Step 5: Verify and commit**

Run:

```powershell
pnpm.cmd test -- tests/unit/work.test.tsx tests/unit/story.test.tsx
pnpm.cmd typecheck
pnpm.cmd build
```

Expected: all tests pass; `/work`, `/story` and any published work slugs are static routes.

```powershell
git add src/app/work src/app/story src/components/work src/components/story tests/unit/work.test.tsx tests/unit/story.test.tsx
git commit -m "feat: add direct work and story routes"
```

---

### Task 6: Motion policy, tokens and Experience semantic composition

**Files:**
- Create: `src/lib/motion/policy.ts`
- Create: `src/lib/motion/tokens.ts`
- Create: `src/hooks/useMotionPolicy.ts`
- Create: `src/hooks/useDocumentVisibility.ts`
- Create: `src/components/experience/ExperienceMotionProvider.tsx`
- Create: `src/components/experience/Experience.tsx`
- Create: `src/components/experience/SceneMarker.tsx`
- Create: `src/components/experience/experience.module.css`
- Modify: `src/app/page.tsx`
- Test: `tests/unit/motion-policy.test.ts`
- Test: `tests/unit/motion-tokens.test.ts`
- Test: `tests/unit/experience-semantics.test.tsx`

**Interfaces:**
- Produces: `resolveMotionPolicy(input): MotionPolicy`, `motionTokens`, `useMotionPolicy()` and the seven-scene server composition.
- Consumes: verified records from `content/experience.ts` and shared shell components.

- [ ] **Step 1: Write policy and grammar tests**

Create `tests/unit/motion-policy.test.ts`:

```ts
import { resolveMotionPolicy } from "@/lib/motion/policy";

const capable = {
  reducedMotion: false,
  saveData: false,
  viewportWidth: 1440,
  webgl: true,
  hardwareConcurrency: 8,
  deviceMemory: 8,
};

it.each([
  [{ ...capable, reducedMotion: true }, { dom: "resolved", cutover: "static" }],
  [{ ...capable, saveData: true }, { dom: "resolved", cutover: "static" }],
  [{ ...capable, viewportWidth: 767 }, { dom: "full", cutover: "static" }],
  [{ ...capable, webgl: false }, { dom: "full", cutover: "static" }],
  [{ ...capable, hardwareConcurrency: 2 }, { dom: "full", cutover: "static" }],
  [capable, { dom: "full", cutover: "webgl" }],
])("resolves capability policy", (input, expected) => {
  expect(resolveMotionPolicy(input)).toEqual(expected);
});
```

Create `tests/unit/motion-tokens.test.ts`:

```ts
import { motionTokens } from "@/lib/motion/tokens";

it("enforces the Drift, Align and Flow bounds", () => {
  expect(motionTokens.drift.maxDistance).toBeLessThanOrEqual(32);
  expect(motionTokens.align.minDuration).toBeGreaterThanOrEqual(0.48);
  expect(motionTokens.align.maxDuration).toBeLessThanOrEqual(0.7);
  expect(motionTokens.flow.maxConcurrent).toBe(1);
});
```

- [ ] **Step 2: Run policy tests and verify RED**

Run: `pnpm.cmd test -- tests/unit/motion-policy.test.ts tests/unit/motion-tokens.test.ts`

Expected: FAIL because the policy modules do not exist.

- [ ] **Step 3: Implement the deterministic policy**

Create `src/lib/motion/policy.ts`:

```ts
export type MotionPolicyInput = {
  reducedMotion: boolean;
  saveData: boolean;
  viewportWidth: number;
  webgl: boolean;
  hardwareConcurrency?: number;
  deviceMemory?: number;
};

export type MotionPolicy = {
  dom: "full" | "resolved";
  cutover: "webgl" | "static";
};

export function resolveMotionPolicy(input: MotionPolicyInput): MotionPolicy {
  if (input.reducedMotion || input.saveData) {
    return { dom: "resolved", cutover: "static" };
  }
  const capableDesktop =
    input.viewportWidth >= 1024 &&
    input.webgl &&
    (input.hardwareConcurrency ?? 8) >= 4 &&
    (input.deviceMemory ?? 8) >= 4;
  return { dom: "full", cutover: capableDesktop ? "webgl" : "static" };
}
```

Create `src/lib/motion/tokens.ts`:

```ts
export const motionTokens = {
  drift: { minDistance: 8, maxDistance: 32, maxPlanes: 3 },
  align: { minDuration: 0.48, maxDuration: 0.7 },
  flow: { maxConcurrent: 1 },
} as const;
```

`useMotionPolicy` reads `matchMedia("(prefers-reduced-motion: reduce)")`, `navigator.connection?.saveData`, viewport width, WebGL availability and optional hardware hints, then calls the pure resolver. It starts in `{ dom: "resolved", cutover: "static" }` so SSR/no-JavaScript is always legible.

- [ ] **Step 4: Write and implement the seven-scene semantic contract**

The component test asserts one H1 and seven labeled sections in this exact order:

```tsx
const sceneNames = [
  "Unresolved and one truth",
  "Translation",
  "Rails",
  "Cutover",
  "Evidence register",
  "Before the bank",
  "Open line",
];
```

`Experience.tsx` renders those sections as server HTML. `ExperienceMotionProvider` is the narrow client wrapper:

```tsx
"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

export function ExperienceMotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

`SceneMarker` uses IntersectionObserver to display `01 / 07` through `07 / 07`; the same scene names remain in headings when the marker is absent. `src/app/page.tsx` becomes `SiteShell active="experience"` around the Experience composition.

- [ ] **Step 5: Verify and commit**

Run: `pnpm.cmd test -- tests/unit/motion-policy.test.ts tests/unit/motion-tokens.test.ts tests/unit/experience-semantics.test.tsx`

Expected: policy, grammar and semantic composition tests pass.

```powershell
git add src/lib/motion src/hooks src/components/experience src/app/page.tsx tests/unit/motion-policy.test.ts tests/unit/motion-tokens.test.ts tests/unit/experience-semantics.test.tsx
git commit -m "feat: add the resilient Experience composition"
```

---

### Task 7: Opening alignment and Translation explorer

**Files:**
- Create: `src/components/experience/scenes/OpeningSequence.tsx`
- Create: `src/components/experience/scenes/opening-sequence.module.css`
- Create: `src/components/experience/scenes/TranslationScene.tsx`
- Create: `src/components/experience/scenes/TranslationExplorer.tsx`
- Create: `src/components/experience/scenes/translation-scene.module.css`
- Test: `tests/unit/opening-translation.test.tsx`

**Interfaces:**
- Consumes: `MotionPolicy`, `motionTokens`, `site` and verified translation-stage records.
- Produces: an already-readable SSR opening plus an optional desktop Drift/Align sequence and accessible five-stage translation explorer.

- [ ] **Step 1: Write the interaction contract test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OpeningSequence } from "@/components/experience/scenes/OpeningSequence";
import { TranslationExplorer } from "@/components/experience/scenes/TranslationExplorer";

it("keeps identity and stakeholder fragments readable before enhancement", () => {
  render(<OpeningSequence />);
  expect(screen.getByRole("heading", { level: 1, name: /Amey Joshi.*Complexity/i })).toBeVisible();
  expect(screen.getAllByTestId("stakeholder-fragment")).toHaveLength(4);
});

it("lets keyboard users inspect every translation stage", async () => {
  const user = userEvent.setup();
  render(<TranslationExplorer />);
  expect(screen.getAllByRole("button")).toHaveLength(5);
  await user.click(screen.getByRole("button", { name: /acceptance/i }));
  expect(screen.getByRole("button", { name: /acceptance/i })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText(/shared definition of done/i)).toBeVisible();
});
```

- [ ] **Step 2: Verify RED**

Run: `pnpm.cmd test -- tests/unit/opening-translation.test.tsx`

Expected: FAIL because the scene components do not exist.

- [ ] **Step 3: Implement semantic choreography**

The opening H1 and positioning are never set to `opacity: 0`. At desktop/full motion only, one sticky wrapper spans approximately `140svh`; `useScroll` maps progress `0–0.35` to stakeholder Drift, `0.35–0.78` to baseline Alignment and `0.78–1` to a resolved hold. Below 1024px and under reduced motion, CSS disables sticky positioning and displays the resolved composition.

Translation renders all five stages as an ordered list. `TranslationExplorer` uses buttons with `aria-pressed`; selecting a stage moves one short line segment and updates an always-visible detail region. Hover may mirror focus but never reveals unique copy.

- [ ] **Step 4: Verify and commit**

Run: `pnpm.cmd test -- tests/unit/opening-translation.test.tsx`

Expected: two passing tests.

```powershell
git add src/components/experience/scenes tests/unit/opening-translation.test.tsx
git commit -m "feat: choreograph ambiguity into one truth"
```

---

### Task 8: DMT rail model and one-shot Flow

**Files:**
- Create: `src/lib/rail/geometry.ts`
- Create: `src/components/experience/scenes/RailsScene.tsx`
- Create: `src/components/experience/scenes/DmtRailVisual.tsx`
- Create: `src/components/experience/scenes/rails-scene.module.css`
- Test: `tests/unit/rail-geometry.test.ts`
- Test: `tests/unit/rails-scene.test.tsx`

**Interfaces:**
- Produces: `validateRailModel(model): void` and a decorative responsive SVG with an accessible ordered route beside it.
- Consumes: a confirmed `DmtRailModel` from `content/experience.ts`.

- [ ] **Step 1: Write rail integrity tests**

```ts
import { validateRailModel } from "@/lib/rail/geometry";
import type { DmtRailModel } from "@/content/experience";

const model: DmtRailModel = {
  verification: "confirmed",
  reconciliationQuestion: "Which leg owns the unresolved state?",
  nodes: [
    { id: "agent", label: "Agent", owner: "Agent network", detail: "Cash-in instruction", desktop: [0, 50], mobile: [50, 0] },
    { id: "beneficiary", label: "Beneficiary bank", owner: "Issuer bank", detail: "Credit result", desktop: [100, 50], mobile: [50, 100] },
  ],
  legs: [
    { id: "leg", from: "agent", to: "beneficiary", state: "reconciliation", label: "Credit and result" },
  ],
};

it("accepts connected confirmed rail data", () => {
  expect(() => validateRailModel(model)).not.toThrow();
});

it("rejects review-state or dangling legs", () => {
  expect(() => validateRailModel({ ...model, verification: "review" })).toThrow(/confirmed/i);
  expect(() => validateRailModel({ ...model, legs: [{ ...model.legs[0], to: "missing" }] })).toThrow(/unknown node/i);
});
```

- [ ] **Step 2: Verify RED**

Run: `pnpm.cmd test -- tests/unit/rail-geometry.test.ts tests/unit/rails-scene.test.tsx`

Expected: FAIL because the rail validator and scene do not exist.

- [ ] **Step 3: Implement the model and responsive SVG**

`validateRailModel` rejects `verification !== "confirmed"`, duplicate node/leg IDs and any leg whose endpoints are absent. `RailsScene` renders an ordered HTML list containing label, owner and detail for every node; the SVG has `aria-hidden="true"`.

`DmtRailVisual` draws the complete graphite route at first paint. When full motion is allowed and the scene reaches approximately 45% intersection, one amber overlay traverses once. Use an SVG path MotionValue and `getPointAtLength()` for marker coordinates without React rerenders. Pause the animation when the scene leaves the viewport or `document.hidden` is true. Reduced motion renders no moving marker. Mobile uses the model's vertical coordinates.

- [ ] **Step 4: Verify and commit**

Run: `pnpm.cmd test -- tests/unit/rail-geometry.test.ts tests/unit/rails-scene.test.tsx`

Expected: rail model and semantic-scene tests pass.

```powershell
git add src/lib/rail src/components/experience/scenes/RailsScene.tsx src/components/experience/scenes/DmtRailVisual.tsx src/components/experience/scenes/rails-scene.module.css tests/unit/rail-geometry.test.ts tests/unit/rails-scene.test.tsx
git commit -m "feat: visualize one verified payment rail"
```

---

### Task 9: Capability-gated cutover depth scene

**Files:**
- Create: `src/components/experience/scenes/CutoverScene.tsx`
- Create: `src/components/experience/scenes/CutoverStatic.tsx`
- Create: `src/components/experience/scenes/CutoverEnhancement.tsx`
- Create: `src/components/experience/scenes/CutoverCanvas.tsx`
- Create: `src/components/experience/scenes/CutoverErrorBoundary.tsx`
- Create: `src/components/experience/scenes/cutover-scene.module.css`
- Test: `tests/unit/cutover.test.tsx`

**Interfaces:**
- Consumes: `MotionPolicy` and confirmed cutover workstreams from `content/experience.ts`.
- Produces: semantic workstream HTML, a permanently mounted SVG fallback and at most one lazy WebGL canvas.

- [ ] **Step 1: Write fallback and gating tests**

```tsx
import { render, screen } from "@testing-library/react";
import { CutoverScene } from "@/components/experience/scenes/CutoverScene";

it("always renders workstreams and the static cutover meaning", () => {
  render(<CutoverScene policy={{ dom: "resolved", cutover: "static" }} />);
  expect(screen.getByRole("heading", { name: /Cutover/i })).toBeVisible();
  expect(screen.getByTestId("cutover-static")).toBeVisible();
  expect(screen.queryByTestId("cutover-canvas")).not.toBeInTheDocument();
});

it("never creates more than one canvas host", () => {
  const { container } = render(<CutoverScene policy={{ dom: "full", cutover: "webgl" }} />);
  expect(container.querySelectorAll("[data-canvas-host]").length).toBeLessThanOrEqual(1);
});
```

- [ ] **Step 2: Verify RED**

Run: `pnpm.cmd test -- tests/unit/cutover.test.tsx`

Expected: FAIL because the cutover components do not exist.

- [ ] **Step 3: Implement static meaning first**

`CutoverStatic` renders five validated workstream lines on separate SVG depth bands that converge on one release-window axis. The adjacent HTML names each stream and its responsibility. No fictional clock, count, dashboard or particle appears.

The section is the second and final desktop sticky sequence at approximately `160svh`. On mobile, reduced motion, `Save-Data`, low-power or WebGL failure, it is ordinary flow with only the static composition.

- [ ] **Step 4: Add the lazy WebGL enhancement**

`CutoverEnhancement` waits for `policy.cutover === "webgl"` and an IntersectionObserver root margin of about 300px before calling:

```tsx
const CutoverCanvas = dynamic(() => import("./CutoverCanvas"), {
  ssr: false,
});
```

The Canvas uses `aria-hidden`, `dpr={[1, 1.5]}`, `antialias={false}`, no Drei package and a transparent background. Five line groups occupy source-backed depth planes and converge as scroll progress advances. Use demand rendering: invalidate only when progress changes, and stop while offscreen or hidden. `CutoverErrorBoundary` catches WebGL/context errors and leaves `CutoverStatic` visible.

- [ ] **Step 5: Verify lazy loading and commit**

Run:

```powershell
pnpm.cmd test -- tests/unit/cutover.test.tsx
pnpm.cmd build
pnpm.cmd analyze
```

Expected: tests pass; the 3D chunk is absent from initial `/` chunks and measures ≤300KB compressed.

```powershell
git add src/components/experience/scenes/Cutover* src/components/experience/scenes/cutover-scene.module.css tests/unit/cutover.test.tsx
git commit -m "feat: add the cutover convergence set piece"
```

---

### Task 10: Evidence register, human origin and Open Line

**Files:**
- Create: `src/components/experience/scenes/EvidenceRegisterScene.tsx`
- Create: `src/components/experience/scenes/OriginScene.tsx`
- Create: `src/components/experience/scenes/OpenLine.tsx`
- Create: `src/components/experience/scenes/closing-scenes.module.css`
- Modify: `src/components/experience/Experience.tsx`
- Test: `tests/unit/closing-scenes.test.tsx`

**Interfaces:**
- Consumes: published case studies, story chapters and `site` contact data.
- Produces: a variable-length editorial evidence register, documentary origin and stable `#contact` conclusion.

- [ ] **Step 1: Write evidence-integrity tests**

```tsx
import { render, screen } from "@testing-library/react";
import { EvidenceRegisterScene } from "@/components/experience/scenes/EvidenceRegisterScene";
import { OriginScene } from "@/components/experience/scenes/OriginScene";
import { publishedStudy } from "../fixtures/content";

it("renders exactly the supplied verified dossiers", () => {
  const { rerender } = render(<EvidenceRegisterScene caseStudies={[]} />);
  expect(screen.queryAllByRole("article")).toHaveLength(0);
  rerender(<EvidenceRegisterScene caseStudies={[publishedStudy]} />);
  expect(screen.getAllByRole("article")).toHaveLength(1);
});

it("does not invent a media frame for a text-only origin", () => {
  const { container } = render(
    <OriginScene chapters={[{ id: "origin", eyebrow: "Origin", title: "Kodoli", body: ["Curiosity with a keyboard."] }]} />,
  );
  expect(container.querySelector("img")).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Verify RED**

Run: `pnpm.cmd test -- tests/unit/closing-scenes.test.tsx`

Expected: FAIL because the closing scene components do not exist.

- [ ] **Step 3: Implement the variable evidence register**

Render zero, one or two verified studies without reserving a three-card grid. A zero-study state points to `/work` and the domain Index without implying missing content. Studies use offset editorial columns, square edges and visible labels for premise, constraint, contribution and disclosure state.

`OriginScene` uses real media only when a `StoryChapter.media` record exists. Without media it uses type, rules and source-backed copy. `OpenLine` turns the truth line into an underline beneath the contact invitation and repeats direct email and LinkedIn links. No generic section entrance animation is added.

- [ ] **Step 4: Verify and commit**

Run: `pnpm.cmd test -- tests/unit/closing-scenes.test.tsx`

Expected: both tests pass.

```powershell
git add src/components/experience/scenes/EvidenceRegisterScene.tsx src/components/experience/scenes/OriginScene.tsx src/components/experience/scenes/OpenLine.tsx src/components/experience/scenes/closing-scenes.module.css src/components/experience/Experience.tsx tests/unit/closing-scenes.test.tsx
git commit -m "feat: complete the evidence and human chapters"
```

---

### Task 11: Metadata, resilience, responsive QA and legacy cleanup

**Files:**
- Create: `src/app/not-found.tsx`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/app/opengraph-image.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `next.config.ts`
- Create: `playwright.config.ts`
- Create: `lighthouserc.json`
- Create: `tests/e2e/routes.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`
- Create: `tests/e2e/motion.spec.ts`
- Create: `tests/e2e/performance.spec.ts`
- Delete after replacement is verified: `index.html`
- Delete after replacement is verified: `story.html`
- Delete after replacement is verified: `s1-handoff.jpg`
- Delete after replacement is verified: `s4-buzz.jpg`
- Delete after replacement is verified: `s5-home.jpg`
- Modify: `vercel.json`

**Interfaces:**
- Consumes: all application routes and performance budgets.
- Produces: production metadata, route fallbacks, automated a11y/responsive/performance gates and a Vercel-ready repository without the legacy runtime.

- [ ] **Step 1: Configure production-browser and Lighthouse runners**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "pnpm build && pnpm start -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
```

Create `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm start -p 3200",
      "startServerReadyPattern": "Ready",
      "url": ["http://127.0.0.1:3200/", "http://127.0.0.1:3200/index"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

- [ ] **Step 2: Write route and responsive E2E tests**

Create Playwright tests that assert:

```ts
import { expect, test } from "@playwright/test";

for (const route of ["/", "/index", "/work", "/story"]) {
  test(`${route} has one main landmark and one h1`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main#main-content")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
  });
}

for (const width of [320, 768, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
```

Accessibility tests use `AxeBuilder` on all four stable routes, activate the skip link by keyboard and confirm focus reaches `main-content`. Motion tests emulate reduced motion and assert no `<canvas>`, no sticky scene transform and complete visible scene headings. A JavaScript-disabled project confirms identity, route links and evidence remain readable. A network test confirms the lazy 3D chunk is not requested during initial `/` load.

- [ ] **Step 3: Run E2E tests and verify failures before hardening**

Run:

```powershell
pnpm.cmd exec playwright install chromium
pnpm.cmd test:e2e
```

Expected: tests expose any remaining metadata, focus, overflow, fallback or lazy-loading defects.

- [ ] **Step 4: Implement metadata and route resilience**

Add canonical route metadata, Open Graph/Twitter image generation, Person JSON-LD in `layout.tsx`, a designed `not-found.tsx`, and generated `robots.ts`/`sitemap.ts`. The sitemap includes `/`, `/index`, `/work`, `/story` and only published case-study slugs.

Add baseline security headers in `next.config.ts`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` and a deployment-compatible Content Security Policy that allows only the application resources actually used.

- [ ] **Step 5: Enforce performance budgets**

Configure Lighthouse CI against production-mode `/` and `/index`. Fail if Core Web Vitals regress beyond the global constraints, `/` initial client JavaScript exceeds 180KB compressed, evidence routes exceed 100KB compressed, the lazy 3D chunk exceeds 300KB compressed, more than one canvas exists, or the canvas continues rendering while offscreen/hidden.

Run:

```powershell
pnpm.cmd validate
pnpm.cmd test:e2e
pnpm.cmd lighthouse
```

Expected: lint, typecheck, unit tests, production build, Playwright and Lighthouse gates all pass.

- [ ] **Step 6: Perform the visual and interface-guideline audit**

Run the site in production mode and inspect 320px, 768px, 1024px and 1440px layouts; full motion, reduced motion and Save-Data; keyboard-only navigation; canvas failure; and JavaScript disabled. Invoke the `web-design-guidelines` skill and address every material accessibility or UX finding. Confirm no gradient text/buttons/blobs, glass panels, generic icon-card grids, custom cursor, fake metrics or AI illustrations remain.

- [ ] **Step 7: Remove the verified legacy implementation**

After the Next production build and route tests pass, remove the two legacy HTML files and three generated illustrations. Replace `vercel.json` with only intentional framework-neutral headers or redirects; do not retain obsolete `cleanUrls` behavior that Next routing already owns.

Run:

```powershell
pnpm.cmd validate
pnpm.cmd test:e2e
git status --short
```

Expected: all gates pass and Git shows only the intentional Next.js migration, design documents and removal of legacy files.

- [ ] **Step 8: Commit the release candidate**

```powershell
git add -A
git commit -m "feat: complete the Clarity Engine portfolio rebuild"
```

## External Resource Intake During Implementation

The build does not wait for external video, animation packs or stock imagery. Code-authored SVG, typography and the cutover depth scene carry the visual identity.

The following authentic inputs can be added without changing the architecture:

1. One high-resolution approved portrait, ideally a vertical original at least 1600px tall.
2. Real photographs or scans from the college project, Zenox Technologies and RB Esports.
3. A current résumé PDF for `/resume.pdf`.
4. NDA-safe facts for one or two bounded engagements: Amey's responsibility, constraints, stakeholders, artifacts, one meaningful decision, validation approach and defensible outcome or a clear non-disclosure statement.

Media is optimized to AVIF/WebP, receives explicit dimensions and truthful alt/caption text, and is omitted cleanly until supplied. No synthetic documentary substitute is generated.
