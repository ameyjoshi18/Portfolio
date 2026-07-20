import { render, screen, within } from "@testing-library/react";
import type { NextConfig } from "next";

import RootLayout, {
  metadata,
  personJsonLd,
  serializeJsonLd,
  viewport,
} from "@/app/layout";
import NotFoundPage from "@/app/not-found";
import {
  alt as openGraphAlt,
  contentType as openGraphContentType,
  size as openGraphSize,
} from "@/app/opengraph-image";
import robots from "@/app/robots";
import sitemap, { buildSitemap } from "@/app/sitemap";
import { site } from "@/content/site";
import nextConfig from "../../next.config";
import vercelConfig from "../../vercel.json";
import { draftStudy, publishedStudy } from "../fixtures/content";

const origin = "https://ameyjoshi.in";

describe("production metadata", () => {
  it("defines canonical and share metadata for the Experience route", () => {
    expect(metadata.metadataBase?.toString()).toBe(`${origin}/`);
    expect(metadata.alternates).toEqual({ canonical: "/" });
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      url: "/",
      siteName: site.name,
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(viewport).toMatchObject({ themeColor: "#f2eee5" });
  });

  it("publishes a source-backed and script-safe Person record", () => {
    expect(personJsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      name: site.name,
      url: `${origin}/`,
      jobTitle: site.role,
      sameAs: [site.linkedin],
      knowsAbout: site.domains,
    });

    const unsafe = { value: "</script><script>alert('x')</script>" };
    const serialized = serializeJsonLd(unsafe);
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual(unsafe);

    const { container } = render(RootLayout({ children: null }));
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script?.textContent ?? "")).toEqual(personJsonLd);
  });

  it("exposes a stable generated social-image contract", () => {
    expect(openGraphAlt).toMatch(/Amey Joshi/i);
    expect(openGraphSize).toEqual({ width: 1200, height: 630 });
    expect(openGraphContentType).toBe("image/png");
  });
});

describe("discovery routes", () => {
  it("allows indexing and points crawlers at the canonical sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${origin}/sitemap.xml`,
      host: origin,
    });
  });

  it("includes stable routes and excludes draft case studies", () => {
    const urls = buildSitemap([publishedStudy, draftStudy]).map(
      (entry) => entry.url,
    );

    expect(urls).toEqual([
      `${origin}/`,
      `${origin}/index`,
      `${origin}/work`,
      `${origin}/story`,
      `${origin}/work/${publishedStudy.slug}`,
    ]);
    expect(urls).not.toContain(`${origin}/work/${draftStudy.slug}`);
    expect(sitemap().every(({ url }) => url.startsWith(origin))).toBe(true);
  });
});

describe("route resilience", () => {
  it("offers clear recovery routes from the not-found page", () => {
    render(NotFoundPage());

    expect(
      screen.getByRole("heading", { level: 1, name: /route is unresolved/i }),
    ).toBeVisible();
    const recovery = within(
      screen.getByRole("navigation", { name: "Not found recovery" }),
    );
    expect(
      recovery.getByRole("link", { name: "Return to the Experience" }),
    ).toHaveAttribute("href", "/");
    expect(
      recovery.getByRole("link", { name: "Open the Index" }),
    ).toHaveAttribute("href", "/index");
  });

  it("sets baseline security headers on every route", async () => {
    const config = nextConfig as NextConfig;
    expect(config.headers).toBeTypeOf("function");

    const rules = await config.headers?.();
    const catchAll = rules?.find(({ source }) => source === "/(.*)");
    const headers = Object.fromEntries(
      catchAll?.headers.map(({ key, value }) => [key, value]) ?? [],
    );

    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers["Permissions-Policy"]).toBe(
      "camera=(), microphone=(), geolocation=()",
    );
    expect(headers["Content-Security-Policy"]).toContain(
      "default-src 'self'",
    );
    expect(headers["Content-Security-Policy"]).toContain("object-src 'none'");
    expect(headers["Content-Security-Policy"]).toContain(
      "frame-ancestors 'none'",
    );
  });

  it("lets Next own clean URLs on Vercel", () => {
    expect(vercelConfig).toEqual({ framework: "nextjs" });
  });
});
