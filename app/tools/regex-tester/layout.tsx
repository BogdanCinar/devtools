import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RegEx Tester - Free Online Tool | DevTools",
  description:
    "Test and debug regular expressions with live highlighting. See matches instantly, use common patterns, and configure flags. Free, privacy-first.",
  keywords: [
    "regex tester",
    "regular expression",
    "regex debugger",
    "regex validator",
    "regex online",
    "pattern matching",
    "regex playground",
  ],
  openGraph: {
    title: "RegEx Tester",
    description:
      "Test and debug regular expressions with live highlighting. Free, fast, privacy-first.",
    type: "website",
  },
};

export default function RegexTesterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
