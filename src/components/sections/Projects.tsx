import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { RevealText } from "@/components/motion/RevealText";
import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectCard, type ProjectCardData } from "@/components/sections/ProjectCard";
import { getFeaturedProjects } from "@/lib/data";

export async function Projects() {
  const rows = await getFeaturedProjects(4);

  const projects: ProjectCardData[] = rows.map((p, i) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
    techStack: p.techStack,
    images: p.images,
    featured: p.featured,
    timeline: p.timeline,
    index: i,
  }));

  return (
    <Section id="work" spacing="vast" className="bg-ink-950">
      <Container size="wide">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Text variant="caption" className="text-paper/40">
              02 — Selected Work
            </Text>
            <RevealText
              as="h2"
              text="Things I've made"
              className="mt-4 text-display-lg font-display leading-[0.95] tracking-[-0.03em] text-paper"
              stagger={0.05}
            />
          </div>
          <FadeIn delay={0.2}>
            <Link
              href="/projects"
              className="group hidden items-center gap-2 font-mono text-label uppercase tracking-[0.18em] text-paper/70 transition-colors hover:text-paper md:inline-flex"
            >
              <span>View all</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </FadeIn>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-8 md:gap-12">
          {projects.length === 0 ? (
            <FadeIn className="col-span-12">
              <div className="rounded-xl border border-dashed border-ink-700/60 p-12 text-center">
                <Text variant="body" className="text-paper/60">
                  No featured projects yet. Add some from the admin dashboard.
                </Text>
              </div>
            </FadeIn>
          ) : (
            projects.map((p, i) => {
              const span = i === 0 ? "full" : "half";
              return <ProjectCard key={p.id} project={{ ...p, index: i }} span={span} />;
            })
          )}
        </div>

        <FadeIn className="mt-12 md:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.18em] text-paper/70"
          >
            View all <span>→</span>
          </Link>
        </FadeIn>
      </Container>
    </Section>
  );
}
