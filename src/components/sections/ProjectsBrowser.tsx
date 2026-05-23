"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { ProjectCard, type ProjectCardData } from "@/components/sections/ProjectCard";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";

type Project = Omit<ProjectCardData, "index">;

export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const allTags = useMemo(() => {
    const t = new Set<string>();
    projects.forEach((p) => p.tags.forEach((tag) => t.add(tag)));
    return Array.from(t).sort();
  }, [projects]);

  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active ? projects.filter((p) => p.tags.includes(active)) : projects),
    [active, projects],
  );

  return (
    <Section spacing="default">
      <Container size="wide">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-3 border-y border-ink-700/40 py-5">
          <Text variant="caption" className="mr-4 text-paper/40">
            Filter
          </Text>
          <FilterChip label="All" active={active === null} onClick={() => setActive(null)} />
          {allTags.map((tag) => (
            <FilterChip
              key={tag}
              label={tag}
              active={active === tag}
              onClick={() => setActive(tag)}
            />
          ))}
        </div>

        <div className="mt-16 grid grid-cols-12 gap-8 md:gap-12">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-12 rounded-xl border border-dashed border-ink-700/60 p-12 text-center"
              >
                <Text variant="body" className="text-paper/60">
                  No projects match this filter.
                </Text>
              </motion.div>
            ) : (
              filtered.map((p, i) => {
                const span = p.featured && i % 5 === 0 ? "full" : "half";
                return (
                  <motion.div
                    key={p.id}
                    layout
                    transition={{ duration: duration.slow, ease: ease.outExpo }}
                    className={span === "full" ? "col-span-12" : "col-span-12 md:col-span-6"}
                  >
                    <ProjectCard project={{ ...p, index: i }} span={span} />
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </Container>
    </Section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 font-mono text-caption uppercase tracking-[0.14em] transition-colors",
        active
          ? "bg-paper text-ink-950"
          : "border border-ink-700/40 text-paper/60 hover:border-paper/40 hover:text-paper",
      )}
    >
      {label}
    </button>
  );
}
