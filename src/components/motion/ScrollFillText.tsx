"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/cn";

export function ScrollFillText({ text, className }: { text: string; className?: string }) {
  const isMobile = useIsMobile();
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 75%", "end 45%"]
  });

  if (isMobile) {
    return <div className={cn("text-paper", className)}>{text}</div>;
  }

  const words = text.split(" ");

  return (
    <div ref={container} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </div>
  );
}

function Word({ children, progress, range }: { children: React.ReactNode; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <span className="relative inline-block mr-[0.25em] mb-[0.1em]">
      <span className="absolute opacity-10 pointer-events-none select-none" aria-hidden="true">{children}</span>
      <motion.span style={{ opacity }} className="text-paper">{children}</motion.span>
    </span>
  );
}
