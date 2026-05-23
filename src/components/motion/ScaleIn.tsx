"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { duration, ease } from "@/lib/motion";

type ScaleInProps = HTMLMotionProps<"div"> & {
  from?: number;
  delay?: number;
};

export function ScaleIn({ children, from = 0.96, delay = 0, ...rest }: ScaleInProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: from }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: duration.slow, ease: ease.outExpo, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
