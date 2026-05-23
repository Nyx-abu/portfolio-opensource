"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { duration, ease } from "@/lib/motion";

export function ViewTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={path}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: duration.normal, ease: ease.outExpo }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
