"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";
import { RevealText } from "@/components/motion/RevealText";
import { HeroGraphic } from "@/components/motion/HeroGraphic";
import { duration, ease } from "@/lib/motion";

export function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 80]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-dvh items-end overflow-hidden bg-ink-950 pb-20 pt-32 md:pb-28"
    >
      <HeroGraphic />
      <Container size="wide" className="relative z-10">
        <motion.div style={{ opacity, y }} className="grid grid-cols-12 items-end gap-x-6 gap-y-12">
          <div className="col-span-12 md:col-span-8">
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration.normal, ease: ease.outExpo, delay: 0.1 }}
              className="mb-8 flex items-center gap-3"
            >
              <span className="h-px w-10 bg-paper/40" />
              <Text variant="body-sm" className="font-mono uppercase tracking-[0.15em] text-paper/70">
                Chennai · Open to remote
              </Text>
            </motion.div>

            <RevealText
              as="h1"
              text="Shipping full-stack products"
              className="text-5xl md:text-6xl lg:text-7xl font-display leading-[0.9] tracking-[-0.04em] text-paper"
              stagger={0.06}
              delay={0.15}
            />

            <RevealText
              as="p"
              text="from hello world to live traffic."
              className="mt-4 text-2xl md:text-3xl font-sans font-light leading-tight tracking-tight text-paper/60"
              stagger={0.05}
              delay={0.55}
            />
          </div>

          <motion.div
            className="col-span-12 md:col-span-4 md:col-start-9"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: ease.outExpo, delay: 0.9 }}
          >
            <div className="border-l border-ink-700/50 pl-6">
              <Text variant="caption" className="text-paper/50">
                Currently
              </Text>
              <p className="mt-2 text-paper/85 font-light leading-relaxed">
                Full-stack engineer working across AI-native interfaces, real-time systems and
                production web apps. B.E. CSE, 2025. Recently shipped satellite mission-control UIs
                at ShineUp.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <Text variant="label" className="text-emerald-300">
                  Open to new opportunities
                </Text>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      <ScrollIndicator />
      <DiagonalGutter />
    </section>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.6 }}
    >
      <div className="flex flex-col items-center gap-3">
        <Text variant="caption" className="text-paper/40">
          Scroll
        </Text>
        <motion.div
          className="relative h-12 w-px overflow-hidden bg-paper/15"
          aria-hidden
        >
          <motion.span
            className="absolute left-0 top-0 block h-4 w-px bg-paper"
            animate={{ y: [0, 32, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function DiagonalGutter() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full">
      <div className="absolute right-[12%] top-0 h-full w-px bg-paper/[0.04]" />
      <div className="absolute left-[20%] top-0 h-full w-px bg-paper/[0.04]" />
    </div>
  );
}
