"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function InteractiveCore() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const springY = useSpring(y, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate cursor position relative to screen center (-1 to 1)
      const xPct = (e.clientX / window.innerWidth) * 2 - 1;
      const yPct = (e.clientY / window.innerHeight) * 2 - 1;
      x.set(xPct);
      y.set(yPct);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  const irisX = useTransform(springX, [-1, 1], [-25, 25]);
  const irisY = useTransform(springY, [-1, 1], [-25, 25]);
  const pupilX = useTransform(springX, [-1, 1], [-15, 15]);
  const pupilY = useTransform(springY, [-1, 1], [-15, 15]);

  return (
    <div className="relative w-64 h-64 md:w-96 md:h-96 mx-auto flex items-center justify-center pointer-events-none group">
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        {/* Outer Grid/Radar */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-paper/20" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 10" className="text-paper/40" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent-500/30" />
        
        {/* Spinning Rings */}
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "100px 100px" }}>
          <ellipse cx="100" cy="100" rx="75" ry="35" fill="none" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
          <ellipse cx="100" cy="100" rx="35" ry="75" fill="none" stroke="#38bdf8" strokeWidth="0.5" opacity="0.4" />
        </motion.g>

        {/* The Eye / Core */}
        <motion.g style={{ x: irisX, y: irisY }}>
          {/* Sclera/Base */}
          <circle cx="100" cy="100" r="25" fill="#030712" stroke="#38bdf8" strokeWidth="2" opacity="0.8" className="drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
          {/* Pupil */}
          <motion.circle cx="100" cy="100" r="8" fill="#fff" style={{ x: pupilX, y: pupilY }} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </motion.g>
      </svg>
    </div>
  );
}
