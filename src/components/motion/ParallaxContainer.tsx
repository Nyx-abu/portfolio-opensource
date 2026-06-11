"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

import { useIsMobile } from "@/hooks/useIsMobile";

type ParallaxContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Pixels shifted across full scroll. Keep subtle: 20–80. */
  amount?: number;
};

export function ParallaxContainer({ children, className, amount = 40 }: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], (reduced || isMobile) ? [0, 0] : [amount, -amount]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
