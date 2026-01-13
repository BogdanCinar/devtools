import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder - Free Online Tool | DevTools",
  description:
    "Encode and decode Base64 strings instantly. Support for text and file uploads. Free, privacy-first - all processing in your browser.",
  keywords: [
    "base64 encoder",
    "base64 decoder",
    "base64 converter",
    "encode base64",
    "decode base64",
    "base64 online",
    "file to base64",
  ],
  openGraph: {
    title: "Base64 Encoder/Decoder",
    description:
      "Encode and decode Base64 strings. Free, fast, privacy-first.",
    type: "website",
  },
};

export default function Base64Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
