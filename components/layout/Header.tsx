"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Wrench className="h-5 w-5 text-primary" />
          <span>DevTools</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/tools/json-formatter"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            JSON
          </Link>
          <Link
            href="/tools/jwt-decoder"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            JWT
          </Link>
          <Link
            href="/tools/base64"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Base64
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
