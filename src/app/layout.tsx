import type { Metadata } from "next";
import { clashGrotesk, gambetta } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amey Joshi — Business Analyst, Fino Payments Bank",
  description:
    "Right now, I'm replacing a bank's core system while the bank stays open. Amey Joshi — Business Analyst, Fino Payments Bank, Navi Mumbai.",
  metadataBase: new URL("https://ameyjoshi.in"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${clashGrotesk.variable} ${gambetta.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
