import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/instrument-serif/latin-400.css";

import { site } from "@/content/site";
import { createPageMetadata, siteUrl } from "@/lib/pageMetadata";

import "./globals.css";

const title = "Amey Joshi — Banking systems and clarity";
const description =
  "Business Analyst working across banking, fintech, requirements, testing and enterprise delivery.";

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: `${siteUrl}/`,
  jobTitle: site.role,
  description: site.positioning,
  homeLocation: {
    "@type": "Place",
    name: site.location,
  },
  sameAs: [site.linkedin],
  knowsAbout: site.domains,
} as const;

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export const metadata: Metadata = {
  ...createPageMetadata({ title, description, path: "/" }),
  metadataBase: new URL(siteUrl),
  authors: [{ name: site.name, url: "/" }],
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f2eee5",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
