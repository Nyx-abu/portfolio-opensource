"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
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
  timeline?: string | null;
  index: number;
};

export function ProjectCard({ project, span = "half" }: { project: ProjectCardData; span?: "half" | "full" | "third" }) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const hero = project.images?.[0];

  const spanClass =
    span === "full"
      ? "col-span-12"
      : span === "third"
        ? "col-span-12 md:col-span-4"
        : "col-span-12 md:col-span-6";

  return (
    <motion.article
      className={cn("group relative", spanClass)}
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
        className="block"
      >
        <div
          className={cn(
            "relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-ink-700/50 bg-ink-900",
            span === "full" && "md:aspect-[21/9]",
          )}
        >
          {hero ? (
            <Image
              src={hero}
              alt={project.title}
              fill
              sizes={span === "full" ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
              className={cn(
                "object-cover transition-transform duration-1000 ease-out-expo",
                hovered ? "scale-[1.04]" : "scale-100",
              )}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-display-md text-ink-700">
                {project.title.slice(0, 1)}
              </span>
            </div>
          )}

          <motion.div
            className="absolute inset-0 bg-ink-950/40"
            animate={{ opacity: hovered ? 0 : 0.55 }}
            transition={{ duration: duration.slow, ease: ease.outExpo }}
          />

          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950 to-transparent"
            animate={{ opacity: hovered ? 0.9 : 0.7 }}
          />

          <div className="absolute left-5 top-5 flex items-center gap-2">
            {project.featured && <Badge tone="featured">Featured</Badge>}
          </div>

          <motion.div
            className="absolute right-5 top-5 rounded-full border border-paper/30 bg-paper/10 p-3 backdrop-blur"
            animate={{ rotate: hovered ? 45 : 0, scale: hovered ? 1.05 : 1 }}
            transition={{ duration: duration.normal, ease: ease.outExpo }}
            aria-hidden
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </motion.div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="flex-1">
            <Text variant="h3" className="text-paper transition-colors group-hover:text-paper">
              {project.title}
            </Text>
            <Text variant="body" className="mt-1.5 text-paper/55">
              {project.description}
            </Text>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((t) => (
            <span
              key={t}
              className="font-mono text-caption uppercase tracking-[0.12em] text-paper/40"
            >
              {t}
            </span>
          ))}
        </div>
      </Link>
    </motion.article>
  );
}
