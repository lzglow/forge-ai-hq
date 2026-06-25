"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/quiz", label: "Assessment" },
  { href: "https://aioperator.ceo/app/curriculum", label: "Curriculum", external: true },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border/40 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">
          ● AI Operator Platform
        </Link>

        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-medium transition-colors",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
