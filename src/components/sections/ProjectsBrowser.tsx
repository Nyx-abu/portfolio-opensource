"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ProjectStack } from "@/components/motion/ProjectStack";

export function ProjectsBrowser({ projects }: { projects: any[] }) {
  return (
    <Section spacing="none" className="relative z-10 w-full pb-20">
      {projects.length === 0 ? (
        <Container size="wide" className="pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-dashed border-ink-700/60 p-12 text-center"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60">
              No projects found.
            </p>
          </motion.div>
        </Container>
      ) : (
        <div className="w-full mt-10">
          <ProjectStack projects={projects} />
        </div>
      )}
    </Section>
  );
}
