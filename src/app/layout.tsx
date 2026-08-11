import type { Metadata } from "next";
import { ranade, gambetta } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amey Joshi — Business Analyst, Banking & Payments",
  description:
    "I make systems that can't talk to each other, talk. Amey Joshi — Business Analyst in banking and payments, Navi Mumbai.",
  metadataBase: new URL("https://ameyjoshi.in"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ranade.variable} ${gambetta.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
