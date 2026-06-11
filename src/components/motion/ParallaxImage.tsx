"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/cn";

import { useIsMobile } from "@/hooks/useIsMobile";

export function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["-4%", "4%"]);

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
        className="relative w-full h-[50vh] md:h-[80vh] flex items-center justify-center overflow-hidden rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.5)]"
      >
        <Image 
          src={src} 
          alt={alt} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-[1.01]" 
        />
      </motion.div>
    </div>
  );
}
