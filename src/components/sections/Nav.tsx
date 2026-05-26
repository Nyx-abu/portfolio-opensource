"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

export function Nav({ name = "Abdur Raheem" }: { name?: string }) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [0, 0.85]);
  const blur = useTransform(scrollY, [0, 100], [0, 12]);

  return (
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
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link
            href="/"
            className="font-display text-h2 leading-none tracking-[-0.02em] text-paper"
          >
            {name}.
          </Link>
          <nav className="flex items-center gap-6 md:gap-10">
            {[
              { href: "/#about", label: "About" },
              { href: "/projects", label: "Projects" },
              { href: "/#experience", label: "Experience" },
              { href: "/#contact", label: "Contact" },
            ].map((item) => (
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
              className="inline-flex items-center rounded-full border border-paper/30 px-4 py-1.5 font-mono text-label uppercase tracking-[0.16em] text-paper transition-colors hover:bg-paper hover:text-ink-950"
            >
              Get in touch
            </Link>
          </nav>
        </div>
      </Container>
    </motion.header>
  );
}
