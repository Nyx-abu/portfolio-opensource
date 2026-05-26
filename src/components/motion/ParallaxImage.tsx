"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";

export function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <div 
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-ink-800/50 bg-ink-900/20 p-2 md:p-6 transition-colors duration-700 hover:border-accent-500/40",
        className
      )}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-500/10 via-ink-900/0 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />
      
      <motion.div 
        style={{ y }} 
        className="relative w-full h-full flex items-center justify-center"
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-[1.01]" 
        />
      </motion.div>
    </div>
  );
}
