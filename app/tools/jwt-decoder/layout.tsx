import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder & Validator - Free Online Tool | DevTools",
  description:
    "Decode JWT tokens instantly. View header, payload, and signature. Check expiration and validate claims. Free, privacy-first - all processing in your browser.",
  keywords: [
    "jwt decoder",
    "jwt validator",
    "json web token",
    "decode jwt",
    "jwt parser",
    "jwt debugger",
    "token decoder",
  ],
  openGraph: {
    title: "JWT Decoder & Validator",
    description:
      "Decode and inspect JWT tokens. Validate expiration and view claims.",
    type: "website",
  },
};

export default function JwtDecoderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
