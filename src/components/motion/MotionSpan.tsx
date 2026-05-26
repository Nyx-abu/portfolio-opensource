"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

export const MotionSpan = forwardRef<HTMLSpanElement, HTMLMotionProps<"span">>((props, ref) => {
  return <motion.span ref={ref} {...props} />;
});

MotionSpan.displayName = "MotionSpan";
