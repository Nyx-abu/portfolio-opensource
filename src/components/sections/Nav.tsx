"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/motion/Magnetic";

function CharReveal({ text }: { text: string }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="inline-flex">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 0.02}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span className="absolute left-0 top-0 inline-flex text-white">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="inline-block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:translate-y-0"
            style={{ transitionDelay: `${i * 0.02}s` }}
          >
             {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  );
}

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
          className="absolute inset-0 bg-ink-950 border-b border-ink-800/60"
          style={{ opacity }}
          aria-hidden
        />
        {/* Tactical glowing bottom border */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-accent-500/20 to-transparent"
          style={{ opacity }}
          aria-hidden
        />

        <Container size="wide" className="relative">
          <div className="flex h-14 items-center justify-between md:h-20">
            <Magnetic strength={10}>
              <Link
                href="/"
                className="group flex items-center font-display text-h3 leading-none tracking-[-0.02em] md:text-h2"
              >
                <div className="relative mr-3 flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-20 transition-opacity duration-500 group-hover:opacity-60" />
                  <span className="relative inline-flex h-1 w-1 rounded-full bg-accent-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                </div>
                <span className="text-paper transition-all duration-500 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{name}</span>
                <span className="text-accent-500 ml-0.5">.</span>
              </Link>
            </Magnetic>
            <nav className="flex items-center gap-3 sm:gap-6 md:gap-10">
              {NAV_ITEMS.map((item) => (
                <Magnetic key={item.href} strength={20}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group relative hidden font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 transition-colors hover:text-white md:inline-flex items-center justify-center py-2 px-2",
                    )}
                  >
                    <span className="relative z-10"><CharReveal text={item.label} /></span>
                    <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-accent-400 transition-all duration-300 ease-out group-hover:w-full group-hover:shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                  </Link>
                </Magnetic>
              ))}
              <Magnetic strength={30}>
                <Link
                  href="/#contact"
                  className="group relative hidden sm:inline-flex items-center overflow-hidden rounded-none border border-accent-500/30 bg-accent-500/5 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-300 transition-all hover:border-accent-400 hover:bg-accent-400/10 hover:text-white hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                >
                  {/* Tech corner accents */}
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-accent-400 transition-all group-hover:w-2 group-hover:h-2" />
                  <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-accent-400 transition-all group-hover:w-2 group-hover:h-2" />
                  
                  <span className="relative z-10 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-accent-400 animate-pulse" />
                    <CharReveal text="INITIATE_CONTACT" />
                  </span>
                </Link>
              </Magnetic>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className="relative inline-flex h-10 w-10 items-center justify-center border border-accent-500/30 text-accent-400 md:hidden hover:bg-accent-500/10 transition-colors"
              >
                <span className="sr-only">Toggle menu</span>
                <motion.span
                  className="absolute block h-[1px] w-5 bg-current"
                  animate={{ rotate: open ? 45 : 0, y: open ? 0 : -4 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute block h-[1px] w-5 bg-current"
                  animate={{ opacity: open ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute block h-[1px] w-5 bg-current"
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
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="h-14" aria-hidden />
            <nav className="relative z-10 flex flex-1 flex-col items-stretch gap-2 px-5 pt-10">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="group block border-b border-ink-800 py-5 font-mono text-label tracking-[0.2em] text-paper/70 uppercase transition-colors hover:text-accent-400"
                  >
                    <span className="text-accent-500/50 mr-2 opacity-0 transition-opacity group-hover:opacity-100">{`>`}</span>
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
                  className="inline-flex items-center gap-3 border border-accent-500/30 bg-accent-500/10 px-6 py-3 font-mono text-label uppercase tracking-[0.2em] text-accent-300"
                >
                  <div className="h-1.5 w-1.5 bg-accent-400 animate-pulse" />
                  INITIATE_CONTACT
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
