"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  wrap
} from "framer-motion";
import { cn } from "@/lib/cn";

interface VelocityMarqueeProps {
  text: string;
  baseVelocity?: number;
  className?: string;
}

export function VelocityMarquee({ text, baseVelocity = 5, className }: VelocityMarqueeProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false
  });

  // We render 8 spans, each taking 12.5% of the total width.
  // By wrapping between -25% and -50%, we ensure the user never sees the edges.
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  const directionFactor = useRef<number>(1);
  
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Change direction if scrolling backwards/forwards
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={cn("relative overflow-hidden flex whitespace-nowrap m-0 select-none", className)}>
      <motion.div className="flex whitespace-nowrap flex-nowrap" style={{ x }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="block pr-12">{text}</span>
        ))}
      </motion.div>
    </div>
  );
}
