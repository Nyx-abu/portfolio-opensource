"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const pathname = usePathname();

  // Core dot position (exact)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Outer ring position (spring)
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Manage native cursor hiding based on route
  useEffect(() => {
    const isAdmin = pathname?.startsWith('/admin');
    if (isAdmin) {
      document.documentElement.classList.remove('hide-native-cursor');
    } else {
      document.documentElement.classList.add('hide-native-cursor');
    }
    return () => {
      document.documentElement.classList.remove('hide-native-cursor');
    };
  }, [pathname]);

  useEffect(() => {
    // Only show on devices with a fine pointer (mouse)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over a link, button, or clickable element
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  // Hide the custom cursor in the admin panel since we have the native cursor
  if (!isVisible || pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Outer Targeting Ring (Spring trailing) */}
      <motion.div
        className="pointer-events-none fixed z-[9998] flex items-center justify-center rounded-full"
        style={{
          width: 56,
          height: 56,
          left: -28,  // Center the cursor precisely
          top: -28,
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.9 : 0.4,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Dynamic rotating dashes */}
        <motion.div 
          className="h-full w-full rounded-full border border-emerald-400/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ borderStyle: 'dashed', borderWidth: '1.5px' }}
        />
        {/* Subtle glow background when hovering */}
        {isHovering && (
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-[10px]" />
        )}
      </motion.div>

      {/* Sputnik Core Pointer (Immediate, no spring delay so it feels native) */}
      <motion.div
        className="pointer-events-none fixed z-[9999] text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,1)]"
        style={{
          width: 24,
          height: 24,
          left: -12, // Center the cursor precisely
          top: -12,
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHovering ? 0.7 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
          {/* Crosshair horizontal */}
          <line x1="-4" y1="12" x2="28" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
          {/* Crosshair vertical */}
          <line x1="12" y1="-4" x2="12" y2="28" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
          
          {/* Core dot */}
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          
          {/* Sleek satellite antennas */}
          <path d="M 6 6 L 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
          <path d="M 18 6 L 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        </svg>
      </motion.div>
    </>
  );
}
