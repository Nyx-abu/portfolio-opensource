import type { Transition, Variants } from "framer-motion";

export const ease = {
  cinematic: [0.7, 0, 0.2, 1] as const,
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const duration = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.6,
  cinematic: 1.2,
} as const;

export const springSnappy: Transition = { type: "spring", stiffness: 320, damping: 28, mass: 0.6 };
export const springSmooth: Transition = { type: "spring", stiffness: 140, damping: 22, mass: 1 };
export const springBouncy: Transition = { type: "spring", stiffness: 220, damping: 14, mass: 0.9 };

export const easeCinematic: Transition = { duration: duration.slow, ease: ease.cinematic };
export const easeOutExpo: Transition = { duration: duration.slow, ease: ease.outExpo };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.outExpo } },
};

export const stagger = (delayChildren = 0.1, stagger = 0.07): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren: stagger } },
});
