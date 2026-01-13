import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator - Free Online Tool | DevTools",
  description:
    "Format, validate and beautify JSON instantly. Free online JSON formatter with syntax highlighting, error detection and minify option. No ads, privacy-first.",
  keywords: [
    "json formatter",
    "json validator",
    "beautify json",
    "minify json",
    "json tool",
    "json beautifier",
    "json parser",
  ],
  openGraph: {
    title: "JSON Formatter & Validator",
    description:
      "Format and validate JSON instantly. Free, fast, privacy-first.",
    type: "website",
  },
};

export default function JsonFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
