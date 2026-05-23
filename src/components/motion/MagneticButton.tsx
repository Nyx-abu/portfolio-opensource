"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type MagneticButtonProps = ComponentPropsWithoutRef<"button"> & {
  strength?: number;
};

export function MagneticButton({
  children,
  className,
  strength = 0.25,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn("inline-flex items-center will-change-transform", className)}
      {...(rest as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
