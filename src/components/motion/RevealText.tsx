"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";

type RevealTextProps = {
  text: string;
  by?: "word" | "line";
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
};

export function RevealText({
  text,
  by = "word",
  className,
  delay = 0,
  stagger = 0.045,
  as = "p",
}: RevealTextProps) {
  const reduced = useReducedMotion();
  const tokens = by === "word" ? text.split(/(\s+)/) : text.split("\n");
  const Tag = motion[as];

  if (reduced) {
    const FlatTag = as as keyof React.JSX.IntrinsicElements;
    return <FlatTag className={className}>{text}</FlatTag>;
  }

  return (
    <Tag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {tokens.map((tok, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline" aria-hidden>
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: duration.slow, ease: ease.outExpo },
              },
            }}
          >
            {tok === " " ? " " : tok}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
