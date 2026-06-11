"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  as?: keyof React.JSX.IntrinsicElements;
};

export function FadeIn({ children, delay = 0, y = 24, className, ...rest }: FadeInProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={cn(!reduced && "opacity-0 translate-y-6", className)}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: duration.slow, ease: ease.outExpo, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
