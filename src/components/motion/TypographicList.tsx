"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import { type ProjectCardData } from "@/components/sections/ProjectCard";

export function TypographicList({ projects }: { projects: Omit<ProjectCardData, "index">[] }) {
  return (
    <div className="w-full flex flex-col pt-10 pb-[20vh] border-t border-ink-800">
      {projects.map((project, index) => (
        <TypographicRow key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}

function TypographicRow({ project, index }: { project: Omit<ProjectCardData, "index">; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      onClick={() => track({ type: "project_click", projectId: project.id, projectTitle: project.title })}
      className="group relative flex flex-col md:flex-row md:items-center justify-between py-10 md:py-14 px-6 md:px-10 mb-4 rounded-2xl border border-ink-800/50 hover:border-ink-500 transition-colors duration-500 bg-ink-950/60 backdrop-blur-xl hover:bg-ink-900/80"
    >
      <div className="flex items-start gap-4 md:gap-12">
        <span className="font-mono text-xs md:text-sm text-paper/30 mt-2 md:mt-4">
          0{index + 1}
        </span>
        <div className="flex flex-col">
          <h2 className="text-5xl md:text-7xl lg:text-[7vw] font-display uppercase tracking-[-0.02em] leading-[0.85] text-paper/80 group-hover:text-white transition-colors duration-500">
            {project.title}
          </h2>
          <div className="mt-4 md:mt-6 flex flex-wrap gap-2">
            {project.techStack.map((tech: string) => (
              <span 
                key={tech} 
                className="font-mono text-[10px] uppercase tracking-widest text-paper/60 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:bg-accent-500/10 group-hover:border-accent-500/20 group-hover:text-accent-300 transition-all duration-500"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 md:mt-0 flex flex-row md:flex-col justify-between md:justify-center items-end md:items-end text-right ml-8 md:ml-0 font-mono text-xs uppercase tracking-widest text-paper/40">
        <span className="group-hover:text-paper transition-colors duration-500">
          {project.timeline || '2025'}
        </span>
        <span className="hidden md:inline-block mt-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-accent-400">
          Explore Case Study
        </span>
      </div>
    </Link>
  );
}
