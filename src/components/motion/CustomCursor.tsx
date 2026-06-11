"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hasFinePointer = useRef(false);
  const pathname = usePathname();

  // Exact cursor position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Manage native cursor hiding based on route AND pointer type
  useEffect(() => {
    const isAdmin = pathname?.startsWith('/admin');
    const isFine = window.matchMedia("(pointer: fine)").matches;
    hasFinePointer.current = isFine;

    if (isAdmin || !isFine) {
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
    if (!window.matchMedia("(pointer: fine)").matches) return;

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
        target.closest("button") ||
        target.getAttribute("role") === "button"
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

  // Hide the custom cursor in the admin panel or on touch devices
  if (!isVisible || pathname?.startsWith('/admin') || !hasFinePointer.current) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[9999] text-white mix-blend-difference"
      style={{
        width: 40,
        height: 40,
        left: -20, // Center precisely
        top: -20,
        x: cursorX,
        y: cursorY,
      }}
    >
      <motion.svg 
        viewBox="0 0 40 40" 
        className="w-full h-full overflow-visible"
        animate={{
          scale: isHovering ? 1.25 : 1,
          rotate: isHovering ? 45 : 0
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Core precision dot */}
        <circle cx="20" cy="20" r="1.5" fill="currentColor" opacity="0.9" />

        {/* Viewfinder brackets */}
        <path d="M 14 10 L 10 10 L 10 14" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={isHovering ? 0.9 : 0.4} />
        <path d="M 26 10 L 30 10 L 30 14" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={isHovering ? 0.9 : 0.4} />
        <path d="M 14 30 L 10 30 L 10 26" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={isHovering ? 0.9 : 0.4} />
        <path d="M 26 30 L 30 30 L 30 26" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={isHovering ? 0.9 : 0.4} />
        
        {/* Fine crosshairs */}
        <line x1="20" y1="-4" x2="20" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="20" y1="44" x2="20" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="-4" y1="20" x2="12" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="44" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        
        {/* Optional inner rotating ring for cinematic feel on hover */}
        {isHovering && (
          <motion.circle 
            cx="20" cy="20" r="16" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeDasharray="2 4"
            opacity="0.3"
            initial={{ rotate: 0 }}
            animate={{ rotate: 180 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "20px 20px" }}
          />
        )}
      </motion.svg>

      {/* Target Lock Text */}
      {isHovering && (
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 25 }}
          className="absolute top-1/2 left-1/2 -translate-y-1/2 text-[9px] font-mono tracking-widest text-white ml-2 whitespace-nowrap opacity-80"
        >
          [TRGT.LOCK]
        </motion.div>
      )}
    </motion.div>
  );
}
