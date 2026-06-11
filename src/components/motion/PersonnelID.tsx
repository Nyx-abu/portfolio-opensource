"use client";

import { FadeIn } from "@/components/motion/FadeIn";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

export function PersonnelID() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <FadeIn className="w-full relative" style={{ perspective: 1000 }}>
      <motion.div 
        className="relative group w-full max-w-sm mx-auto lg:mx-0"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Under-glow for 3D depth */}
        <div className="absolute inset-4 bg-accent-500/20 blur-2xl -z-10 transition-opacity duration-500 group-hover:opacity-100 opacity-0" style={{ transform: "translateZ(-50px)" }} />
        {/* ID Frame / Glass Container */}
        <div className="relative overflow-hidden rounded-xl bg-ink-900/40 border border-ink-700/60 p-2 backdrop-blur-md shadow-2xl">
          
          {/* Outer Frame Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent-500/80 rounded-tl-xl transition-all duration-700 group-hover:border-accent-400 group-hover:-translate-x-1 group-hover:-translate-y-1" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent-500/80 rounded-tr-xl transition-all duration-700 group-hover:border-accent-400 group-hover:translate-x-1 group-hover:-translate-y-1" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent-500/80 rounded-bl-xl transition-all duration-700 group-hover:border-accent-400 group-hover:-translate-x-1 group-hover:translate-y-1" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent-500/80 rounded-br-xl transition-all duration-700 group-hover:border-accent-400 group-hover:translate-x-1 group-hover:translate-y-1" />

          {/* Inner Image Container */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-ink-950">
            <Image 
              src="/images/profile.png" 
              alt="Profile ID" 
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              priority
              className="object-cover object-center grayscale contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            />

            {/* Top Right Status */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/80">Active</span>
            </div>
          </div>

          {/* ID Data Footer */}
          <div className="mt-4 px-3 pb-2 space-y-2">
            <div className="flex justify-between items-end border-b border-ink-700/50 pb-2">
              <div>
                <p className="font-mono text-[10px] text-accent-500/80 tracking-widest uppercase">Subject</p>
                <p className="font-mono text-sm text-paper tracking-wider mt-0.5 uppercase">Nyx Abu</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] text-accent-500/80 tracking-widest uppercase">ID</p>
                <p className="font-mono text-sm text-paper tracking-wider mt-0.5">00-42</p>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex-1">
                <p className="font-mono text-[9px] text-paper/40 tracking-widest uppercase">Role</p>
                <p className="font-mono text-xs text-paper/80 uppercase tracking-wider mt-1">Software Developer</p>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </FadeIn>
  );
}
