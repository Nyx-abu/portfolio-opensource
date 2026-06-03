"use client";

import { useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";

export function ProjectHoverReveal({ projects }: { projects: any[] }) {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  
  // Mouse position state
  const mouseX = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  return (
    <div className="relative w-full border-t border-ink-700/40">
      {projects.map((project, index) => (
        <ProjectEntry 
          key={project.id} 
          project={project} 
          index={index} 
          setActive={setActiveProject} 
        />
      ))}

      {/* Floating Image Reveal - Only visible on desktop/hover */}
      <motion.div 
        className="pointer-events-none fixed left-0 top-0 z-50 h-[320px] w-[450px] overflow-hidden rounded-xl hidden md:block shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-paper/10 bg-ink-950"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: activeProject !== null ? 1 : 0.8,
          opacity: activeProject !== null ? 1 : 0
        }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      >
        {projects.map((project, index) => (
          <img 
            key={project.id}
            src={project.images[0]} 
            alt={project.title}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
              activeProject === index ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
        {/* Glass glare */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
}

function ProjectEntry({ project, index, setActive }: any) {
  return (
    <Link 
      href={`/projects/${project.slug}`}
      onClick={() => track({ type: "project_click", projectId: project.id, projectTitle: project.title })}
      onMouseEnter={() => setActive(index)}
      onMouseLeave={() => setActive(null)}
      className="group block w-full border-b border-ink-700/40 py-10 md:py-16 transition-colors hover:bg-ink-900/30 relative overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent-500/0 via-accent-500/5 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
      <div className="mx-auto w-full max-w-none flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 px-0">
        <div className="flex items-baseline gap-4 md:gap-8">
          <span className="font-mono text-sm text-paper/30 group-hover:text-accent-400 transition-colors duration-300">
            0{index + 1}
          </span>
          <h2 className="text-[3rem] sm:text-6xl md:text-7xl lg:text-[7rem] font-display uppercase tracking-[-0.04em] text-paper/50 group-hover:text-paper group-hover:translate-x-4 transition-all duration-500 ease-out leading-[0.85]">
            {project.title}
          </h2>
        </div>
        <div className="text-left md:text-right mt-4 md:mt-0">
          <p className="text-paper/30 font-mono text-xs sm:text-sm uppercase tracking-[0.2em] group-hover:text-paper/70 transition-colors duration-300">
            {project.techStack.slice(0, 3).join(" / ")}
          </p>
          <p className="text-accent-500/0 font-mono text-[10px] uppercase tracking-[0.3em] mt-2 transition-all duration-500 group-hover:text-accent-500/80 -translate-x-4 group-hover:translate-x-0">
            View Project →
          </p>
        </div>
      </div>
    </Link>
  );
}
