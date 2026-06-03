"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { track } from "@/lib/analytics";

export function ProjectStack({ projects }: { projects: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // We use scrollYProgress of the whole container to drive the scale down effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative w-full flex flex-col gap-24 md:gap-32 pb-[20vh]">
      {projects.map((project, index) => {
        return (
          <StackedCard 
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            progress={scrollYProgress}
          />
        );
      })}
    </div>
  );
}

function StackedCard({ project, index, total, progress }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Calculate when this specific card hits the top of the viewport
  // to start scaling it down as the user continues to scroll.
  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ["start start", "end start"]
  });

  // Scale down to a minimum of 0.9 depending on its position in the stack
  const scale = useTransform(cardProgress, [0, 1], [1, 0.9]);
  
  // Slight blur effect as it goes backwards
  const filter = useTransform(cardProgress, [0, 1], ["blur(0px)", "blur(10px)"]);
  
  // Opacity fade as it goes backwards
  const opacity = useTransform(cardProgress, [0, 1], [1, 0.4]);

  return (
    <div 
      ref={cardRef} 
      className="sticky top-24 md:top-32 h-[70vh] w-full flex items-center justify-center"
    >
      <motion.div 
        style={{ scale, filter, opacity }} 
        className="relative w-full h-full overflow-hidden rounded-3xl border border-ink-700/50 bg-ink-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] origin-top group"
      >
        <Link 
          href={`/projects/${project.slug}`}
          onClick={() => track({ type: "project_click", projectId: project.id, projectTitle: project.title })}
          className="absolute inset-0 z-20"
        />
        
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 bg-ink-950">
          <img 
            src={project.images[0]} 
            alt={project.title} 
            className="w-full h-full object-cover opacity-60 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-80"
          />
          {/* Gradients for text readability and depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-transparent to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-16 pointer-events-none">
          <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-accent-400 bg-ink-950/80 px-4 py-2 rounded-full backdrop-blur-md border border-ink-800">
                0{index + 1}
              </span>
              {project.featured && (
                <span className="font-mono text-xs uppercase tracking-widest text-paper bg-accent-500/20 px-4 py-2 rounded-full backdrop-blur-md border border-accent-500/30">
                  Featured
                </span>
              )}
            </div>
            
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display uppercase tracking-[-0.02em] text-paper drop-shadow-2xl group-hover:text-white transition-colors">
              {project.title}
            </h2>
            
            <p className="text-paper/70 text-lg md:text-xl font-light line-clamp-2 max-w-2xl">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {project.techStack.slice(0, 4).map((t: string) => (
                <span key={t} className="font-mono text-[10px] uppercase tracking-widest text-paper/50 bg-ink-900/50 px-3 py-1.5 rounded border border-ink-700/50">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Floating View Project Indicator */}
        <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
          <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-accent-500/20 border border-accent-400 backdrop-blur-md flex items-center justify-center text-accent-300 font-mono text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(56,189,248,0.3)]">
            View
          </div>
        </div>

      </motion.div>
    </div>
  );
}
