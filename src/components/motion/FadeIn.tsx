"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { duration, ease } from "@/lib/motion";

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  as?: keyof React.JSX.IntrinsicElements;
};

export function FadeIn({ children, delay = 0, y = 24, ...rest }: FadeInProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: duration.slow, ease: ease.outExpo, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
