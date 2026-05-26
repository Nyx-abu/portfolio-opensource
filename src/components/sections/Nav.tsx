"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/#about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export function Nav({ name = "Abdur Raheem" }: { name?: string }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [0, 0.85]);
  const blur = useTransform(scrollY, [0, 100], [0, 12]);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-40"
        style={{
          backdropFilter: useTransform(blur, (b) => `blur(${b}px)`),
          WebkitBackdropFilter: useTransform(blur, (b) => `blur(${b}px)`),
        }}
      >
        <motion.div
          className="absolute inset-0 bg-ink-950 border-b border-ink-700/40"
          style={{ opacity }}
          aria-hidden
        />
        <Container size="wide" className="relative">
          <div className="flex h-14 items-center justify-between md:h-20">
            <Link
              href="/"
              className="font-display text-h3 leading-none tracking-[-0.02em] text-paper md:text-h2"
            >
              {name}.
            </Link>
            <nav className="flex items-center gap-3 sm:gap-6 md:gap-10">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "hidden font-mono text-label uppercase tracking-[0.18em] text-paper/70 transition-colors hover:text-paper md:inline-block",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/#contact"
                className="hidden sm:inline-flex items-center rounded-full border border-paper/30 px-4 py-1.5 font-mono text-label uppercase tracking-[0.16em] text-paper transition-colors hover:bg-paper hover:text-ink-950"
              >
                Get in touch
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper/25 text-paper md:hidden"
              >
                <span className="sr-only">Toggle menu</span>
                <motion.span
                  className="absolute block h-px w-5 bg-paper"
                  animate={{ rotate: open ? 45 : 0, y: open ? 0 : -4 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute block h-px w-5 bg-paper"
                  animate={{ opacity: open ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute block h-px w-5 bg-paper"
                  animate={{ rotate: open ? -45 : 0, y: open ? 0 : 4 }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </nav>
          </div>
        </Container>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-30 flex flex-col bg-ink-950/95 backdrop-blur-lg md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-14" aria-hidden />
            <nav className="flex flex-1 flex-col items-stretch gap-2 px-5 pt-10">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-ink-700/40 py-5 font-display text-h2 leading-none tracking-[-0.02em] text-paper"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + NAV_ITEMS.length * 0.04, duration: 0.25 }}
                className="mt-10"
              >
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center rounded-full border border-paper/30 px-5 py-2 font-mono text-label uppercase tracking-[0.16em] text-paper"
                >
                  Get in touch
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
