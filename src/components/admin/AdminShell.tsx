"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { Text } from "@/components/ui/Text";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/social", label: "Social" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminShell({
  user,
  children,
}: {
  user: { name?: string | null; email?: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close sidebar on path change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex min-h-dvh relative">
      {/* Mobile Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-ink-950/80 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 border-r border-ink-700/40 bg-ink-950/95 backdrop-blur transition-transform md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-ink-700/40 px-6">
          <Link href="/" className="font-display text-h3 tracking-[-0.02em] text-paper">
            Portfolio.
          </Link>
          <button
            className="md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <span className="text-paper/60">✕</span>
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 font-mono text-label uppercase tracking-[0.14em] transition-colors",
                  active
                    ? "bg-paper text-ink-950"
                    : "text-paper/65 hover:bg-ink-800/50 hover:text-paper",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-4 bottom-4 rounded-lg border border-ink-700/40 bg-ink-900/50 p-4">
          <Text variant="caption" className="text-paper/40">
            Signed in as
          </Text>
          <p className="mt-1 truncate text-body-sm text-paper">{user.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-3 w-full rounded border border-ink-700/60 px-3 py-1.5 font-mono text-caption uppercase tracking-[0.14em] text-paper/80 hover:text-paper"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 md:ml-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-700/40 bg-ink-950/95 px-5 backdrop-blur md:px-8">
          <button
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span className="text-paper">≡</span>
          </button>
          <Text variant="caption" className="hidden text-paper/40 md:block">
            Admin · {pathname}
          </Text>
          <Link
            href="/"
            target="_blank"
            className="font-mono text-caption uppercase tracking-[0.14em] text-paper/60 hover:text-paper"
          >
            View site ↗
          </Link>
        </header>

        <div className="px-5 py-8 md:px-10 md:py-12">{children}</div>
      </div>
    </div>
  );
}
