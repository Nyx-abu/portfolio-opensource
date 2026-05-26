"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ProjectCard, type ProjectCardData } from "@/components/sections/ProjectCard";
import { duration, ease } from "@/lib/motion";

type Project = Omit<ProjectCardData, "index">;

export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  return (
    <Section spacing="default" className="relative z-10">

      <Container size="wide" className="relative z-10 pt-20">
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-12 rounded-xl border border-dashed border-ink-700/60 p-12 text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60">
                No projects found.
              </p>
            </motion.div>
          ) : (
            projects.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                transition={{ duration: duration.slow, ease: ease.outExpo }}
                className="col-span-12 md:col-span-6"
              >
                <ProjectCard project={{ ...p, index: i }} span="half" />
              </motion.div>
            ))
          )}
        </div>
      </Container>
    </Section>
  );
}
