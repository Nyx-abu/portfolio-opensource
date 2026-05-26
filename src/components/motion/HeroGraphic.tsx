"use client";

import { motion } from "framer-motion";
import { memo } from "react";

// Memoize the component to prevent unnecessary re-renders
export const HeroGraphic = memo(function HeroGraphic() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-90 pointer-events-none z-0">
      {/* Container sized to cover the whole screen and then some */}
      <div className="relative w-[250vw] sm:w-[180vw] lg:w-[140vw] max-w-[2000px] aspect-square mix-blend-screen">
        
        {/* SVG Definitions for cinematic gradients and planets */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
          <defs>
            <clipPath id="front-ring-clip">
              <rect x="-20" y="0" width="40" height="20" />
            </clipPath>

            <radialGradient id="planet-glow-blue" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="1" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9" />
            </radialGradient>

            <radialGradient id="planet-glow-emerald" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="1" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0.9" />
            </radialGradient>

            <radialGradient id="planet-glow-purple" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="1" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.9" />
            </radialGradient>
            
            {/* Saturn 1: Grand Emerald Planet */}
            <g id="saturn-emerald">
              {/* Core glow */}
              <circle cx="0" cy="0" r="8" fill="#10b981" opacity="0.3" filter="blur(4px)" />
              {/* Back Ring */}
              <ellipse cx="0" cy="0" rx="14" ry="4" transform="rotate(-15)" fill="none" stroke="#6ee7b7" strokeWidth="1" opacity="0.4" />
              <ellipse cx="0" cy="0" rx="12" ry="3" transform="rotate(-15)" fill="none" stroke="#34d399" strokeWidth="0.5" opacity="0.3" />
              {/* Solid Body */}
              <circle cx="0" cy="0" r="5" fill="url(#planet-glow-emerald)" />
              {/* Front Ring (clipped) */}
              <g transform="rotate(-15)">
                <ellipse cx="0" cy="0" rx="14" ry="4" fill="none" stroke="#6ee7b7" strokeWidth="1.2" opacity="1" clipPath="url(#front-ring-clip)" />
                <ellipse cx="0" cy="0" rx="12" ry="3" fill="none" stroke="#a7f3d0" strokeWidth="0.8" opacity="1" clipPath="url(#front-ring-clip)" />
              </g>
            </g>

            {/* Saturn 2: Deep Purple Gas Giant */}
            <g id="saturn-purple" transform="scale(0.8)">
              {/* Core glow */}
              <circle cx="0" cy="0" r="10" fill="#8b5cf6" opacity="0.2" filter="blur(6px)" />
              {/* Back Rings */}
              <ellipse cx="0" cy="0" rx="16" ry="3.5" transform="rotate(25)" fill="none" stroke="#c4b5fd" strokeWidth="0.8" opacity="0.3" />
              <ellipse cx="0" cy="0" rx="13" ry="2.5" transform="rotate(25)" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.2" />
              {/* Solid Body */}
              <circle cx="0" cy="0" r="6" fill="url(#planet-glow-purple)" />
              {/* Front Rings */}
              <g transform="rotate(25)">
                <ellipse cx="0" cy="0" rx="16" ry="3.5" fill="none" stroke="#ddd6fe" strokeWidth="1.5" opacity="0.9" clipPath="url(#front-ring-clip)" />
                <ellipse cx="0" cy="0" rx="13" ry="2.5" fill="none" stroke="#c4b5fd" strokeWidth="2" opacity="1" clipPath="url(#front-ring-clip)" />
              </g>
            </g>

            {/* Simple Blue Planet */}
            <g id="planet-blue" transform="scale(0.6)">
              <circle cx="0" cy="0" r="6" fill="#3b82f6" opacity="0.4" filter="blur(3px)" />
              <circle cx="0" cy="0" r="4.5" fill="url(#planet-glow-blue)" />
              <circle cx="-1" cy="-1" r="1" fill="#fff" opacity="0.6" filter="blur(0.5px)" />
            </g>

            {/* Glowing Star/Comet */}
            <g id="star-core">
              <circle cx="0" cy="0" r="2" fill="#fff" opacity="1" />
              <circle cx="0" cy="0" r="4" fill="#fff" opacity="0.4" filter="blur(2px)" />
              <circle cx="0" cy="0" r="8" fill="#a78bfa" opacity="0.2" filter="blur(4px)" />
            </g>
          </defs>
        </svg>

        {/* Ring 1 - Massive Outer Orbit */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 240, repeat: Infinity, ease: "linear" }} className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible text-paper/20">
            {/* Base orbit line */}
            <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.1" />
            <circle cx="50" cy="50" r="49" fill="none" stroke="url(#planet-glow-purple)" strokeWidth="0.5" strokeDasharray="10 40" opacity="0.8" />
            
            <use href="#saturn-purple" x="49" y="1" className="drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]" />
            <use href="#star-core" x="1" y="50" />
            <use href="#planet-blue" x="99" y="50" className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          </svg>
        </motion.div>

        {/* Ring 2 - Outer Counter-Orbit */}
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 180, repeat: Infinity, ease: "linear" }} className="absolute inset-[12%] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible text-emerald-400/20">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 15" opacity="0.6" />
            <use href="#saturn-emerald" x="98" y="50" className="drop-shadow-[0_0_25px_rgba(16,185,129,0.5)]" />
            <use href="#star-core" x="50" y="2" />
          </svg>
        </motion.div>

        {/* Ring 3 - Middle Fast Orbit */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }} className="absolute inset-[24%] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible text-blue-400/30">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.1" />
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="5 20" opacity="0.9" />
            <use href="#planet-blue" x="2" y="50" className="drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
            <use href="#star-core" x="84" y="84" />
          </svg>
        </motion.div>

        {/* Ring 4 - Inner Dense Counter-Orbit */}
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }} className="absolute inset-[38%] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible text-purple-400/30">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="0.5 8" opacity="0.7" />
            <use href="#saturn-purple" x="50" y="98" className="drop-shadow-[0_0_20px_rgba(139,92,246,0.7)]" />
            <use href="#saturn-emerald" x="16" y="16" transform="scale(0.5) translate(16, 16)" className="drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
          </svg>
        </motion.div>

        {/* Ring 5 - Inner Fast Orbit */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute inset-[52%] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible text-emerald-400/40">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="10 5" opacity="0.3" />
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 30" opacity="1" />
            <use href="#planet-blue" x="84" y="84" className="drop-shadow-[0_0_25px_rgba(59,130,246,1)]" />
          </svg>
        </motion.div>

        {/* Ring 6 - The Core System */}
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute inset-[68%] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible text-paper/40">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="48" fill="none" stroke="url(#planet-glow-purple)" strokeWidth="2" strokeDasharray="20 60" opacity="0.8" />
            <use href="#saturn-emerald" x="2" y="50" className="drop-shadow-[0_0_30px_rgba(16,185,129,1)]" />
          </svg>
        </motion.div>

        {/* Static Center Radar/Crosshair with deep glow */}
        <div className="absolute inset-[80%] flex items-center justify-center opacity-60 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible text-paper">
            <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
            <use href="#star-core" x="50" y="50" className="drop-shadow-[0_0_25px_rgba(255,255,255,1)]" />
          </svg>
        </div>

      </div>
    </div>
  );
});
