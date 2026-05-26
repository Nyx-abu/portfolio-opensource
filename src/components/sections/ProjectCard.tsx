"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { TechPill } from "@/components/ui/TechPill";
import { duration, ease } from "@/lib/motion";
import { track } from "@/lib/analytics";

export type ProjectCardData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  techStack: string[];
  images: string[];
  featured: boolean;
  githubUrl?: string | null;
  liveUrl?: string | null;
  timeline?: string | null;
  index: number;
};

export function ProjectCard({ project, span = "half" }: { project: ProjectCardData; span?: "half" | "full" | "third" }) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const spanClass =
    span === "full"
      ? "col-span-12"
      : span === "third"
        ? "col-span-12 md:col-span-4"
        : "col-span-12 md:col-span-6";

  return (
    <motion.article
      className={cn(
        "group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-ink-700/50 bg-ink-900/20 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-paper/20 hover:bg-ink-900/40 hover:shadow-[0_8px_30px_rgba(255,255,255,0.04)]",
        spanClass
      )}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: duration.slow, ease: ease.outExpo, delay: project.index * 0.08 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        onClick={() =>
          track({ type: "project_click", projectId: project.id, projectTitle: project.title })
        }
        className="absolute inset-0 z-10"
        aria-label={`View ${project.title} details`}
      />

      {/* Sci-fi animated background elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-paper/5 via-ink-900/0 to-ink-950/0 opacity-50 transition-opacity duration-700 group-hover:opacity-100" />
      
      {/* Decorative corner grid/HUD effect */}
      <svg
        className="absolute -right-4 -top-4 z-0 h-32 w-32 text-paper/5 transition-transform duration-700 group-hover:scale-110 group-hover:text-paper/10"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" />
        <path d="M50 0L50 100M0 50L100 50" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-7 pointer-events-none">
        {/* Top metadata bar */}
        <div className="mb-6 flex items-center justify-between border-b border-ink-700/40 pb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-paper/40"
              animate={{
                backgroundColor: hovered ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.4)",
                boxShadow: hovered ? "0 0 8px rgba(255,255,255,0.8)" : "0 0 0px rgba(255,255,255,0)",
              }}
              transition={{ duration: 0.3 }}
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-paper/40 transition-colors group-hover:text-paper/70">
              SYS.PRJ.{project.id.slice(0, 6)}
            </span>
          </div>
          {project.featured && (
            <Badge tone="featured" className="origin-right scale-90">
              Featured
            </Badge>
          )}
        </div>

        {/* Title and Description */}
        <div className="flex-1">
          <Text variant="h3" className="text-xl text-paper transition-colors group-hover:text-white">
            {project.title}
          </Text>
          <Text variant="body" className="mt-3 line-clamp-3 text-paper/50 transition-colors group-hover:text-paper/70 text-justify">
            {project.description}
          </Text>
        </div>

        {/* Tech Stack */}
        <div className="mt-8 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((t) => (
            <TechPill key={t} name={t} size="sm" animate={true} />
          ))}
        </div>
      </div>

      {/* Buttons */}
      {(project.githubUrl || project.liveUrl) && (
        <div className="relative z-20 mt-auto flex flex-wrap items-center gap-3 p-5 pt-0 sm:p-7 sm:pt-0">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded border border-ink-700/50 bg-ink-900/50 py-3 text-[10px] font-mono uppercase tracking-[0.2em] text-paper transition-all hover:border-white/30 hover:bg-white/5 min-w-[120px]"
            >
              <span className="relative z-10">GitHub</span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full transition-transform duration-500 group-hover/btn:translate-x-full" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded bg-paper py-3 text-[10px] font-mono uppercase tracking-[0.2em] text-ink-950 transition-transform hover:scale-[1.02] min-w-[120px]"
            >
              <span className="relative z-10 font-bold">Live Link</span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full transition-transform duration-500 group-hover/btn:translate-x-full" />
            </a>
          )}
        </div>
      )}
    </motion.article>
  );
}
