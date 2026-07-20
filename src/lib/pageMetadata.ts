import type { Metadata } from "next";

import { site } from "@/content/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
};

export const siteUrl = "https://ameyjoshi.in";

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const image = {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: "Amey Joshi — Complexity in. Clarity out.",
  };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: path,
      siteName: site.name,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
