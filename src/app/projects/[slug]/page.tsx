import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { Tag } from "@/components/ui/Tag";
import { Badge } from "@/components/ui/Badge";
import { TechPill } from "@/components/ui/TechPill";
import { RevealText } from "@/components/motion/RevealText";
import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { HorizontalGallery } from "@/components/motion/HorizontalGallery";
import { FiGithub, FiExternalLink, FiFileText } from "react-icons/fi";
import { prisma } from "@/lib/db";
import { getProjectBySlug, getSocialLinks } from "@/lib/data";
import { buildMetadata, siteUrl } from "@/lib/metadata";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const rows = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return buildMetadata({ title: "Not found", noindex: true });
  return buildMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    ogImage: project.images[0] ?? undefined,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [related, social] = await Promise.all([
    prisma.project
      .findMany({
        where: { status: "PUBLISHED", id: { not: project.id } },
        orderBy: { order: "asc" },
        take: 2,
      })
      .catch(() => []),
    getSocialLinks(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${siteUrl}/projects/${project.slug}`,
    keywords: [...project.tags, ...project.techStack].join(", "),
  };

  // Collect all video URLs (legacy + new)
  const allVideos: string[] = [
    ...(project.videoUrl ? [project.videoUrl] : []),
    ...(project.videoUrls ?? []),
  ].filter(Boolean);

  // If doc is .md, fetch the raw content for server-side rendering
  let markdownContent: string | null = null;
  if (project.documentationUrl?.endsWith('.md')) {
    try {
      const res = await fetch(project.documentationUrl, { next: { revalidate: 300 } });
      if (res.ok) markdownContent = await res.text();
    } catch {}
  }

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main" className="relative min-h-dvh pt-24 md:pt-32 pb-20">
        <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-500/10 via-ink-950 to-ink-950 pointer-events-none" />
        
        <Section spacing="none" className="mb-12">
          <Container size="wide">
            <FadeIn>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.16em] text-paper/60 transition-colors hover:text-paper"
              >
                <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
                <span>All projects</span>
              </Link>
            </FadeIn>

            <div className="mt-10 max-w-5xl">
              <div className="flex flex-wrap items-center gap-2">
                {project.featured && <Badge tone="featured">Featured</Badge>}
                {project.liveUrl && <Badge tone="live">Live</Badge>}
                {project.timeline && <Badge tone="neutral">{project.timeline}</Badge>}
              </div>
              <RevealText
                as="h1"
                text={project.title}
                className="mt-6 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold uppercase leading-[0.85] tracking-[-0.04em] text-paper"
                stagger={0.06}
              />
              <FadeIn delay={0.2}>
                <p className="mt-6 max-w-prose text-body-lg font-light text-paper/70">
                  {project.description}
                </p>
              </FadeIn>
            </div>
          </Container>
        </Section>

        <Section spacing="none" className="mb-12">
          <Container size="wide">
            <div className="grid grid-cols-12 gap-y-8 border-t border-ink-700/40 pt-8 md:gap-x-12">
              <Meta label="Tech stack">
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.techStack.map((t) => (
                    <TechPill key={t} name={t} size="md" animate={true} />
                  ))}
                </div>
              </Meta>
              <Meta label="Tags">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <Tag key={t} tone="muted">{t}</Tag>
                  ))}
                </div>
              </Meta>
              <Meta label="Links">
                <div className="flex flex-col gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-4 rounded-xl border border-ink-700/40 bg-ink-900/20 p-3 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-800/50 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
                          <FiExternalLink className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/70 transition-colors group-hover:text-emerald-300">Live Project</span>
                      </div>
                      <span className="text-paper/20 transition-all group-hover:translate-x-1 group-hover:text-emerald-400/50">→</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-4 rounded-xl border border-ink-700/40 bg-ink-900/20 p-3 transition-all hover:border-paper/30 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-800/50 text-paper/70 transition-colors group-hover:bg-white/10 group-hover:text-white">
                          <FiGithub className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/70 transition-colors group-hover:text-white">Source Code</span>
                      </div>
                      <span className="text-paper/20 transition-all group-hover:translate-x-1 group-hover:text-paper/50">→</span>
                    </a>
                  )}
                  {project.documentationUrl && (
                    <a
                      href={project.documentationUrl.endsWith('.md') ? '#documentation' : project.documentationUrl}
                      target={project.documentationUrl.endsWith('.md') ? undefined : '_blank'}
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-4 rounded-xl border border-ink-700/40 bg-ink-900/20 p-3 transition-all hover:border-accent-500/50 hover:bg-accent-500/10 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-800/50 text-accent-400 transition-colors group-hover:bg-accent-500/20">
                          <FiFileText className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/70 transition-colors group-hover:text-accent-300">Documentation</span>
                      </div>
                      <span className="text-paper/20 transition-all group-hover:translate-x-1 group-hover:text-accent-400/50">
                        {project.documentationUrl.endsWith('.md') ? '↓' : '→'}
                      </span>
                    </a>
                  )}
                </div>
              </Meta>
            </div>
          </Container>
        </Section>

        {/* Hero image */}
        {project.images.length > 0 && (
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24 mt-8">
            <FadeIn>
              <ParallaxImage src={project.images[0]} alt={project.title} />
            </FadeIn>
          </div>
        )}

        {/* Long description */}
        {project.longDescription && (
          <Section spacing="none" className="mb-16 md:mb-24">
            <Container size="default">
              <FadeIn>
                <article className="prose-portfolio max-w-none space-y-8 text-body-lg leading-loose text-paper/80 font-light border-l border-accent-500/30 pl-6 md:pl-10 relative">
                  <div className="absolute left-[-1px] top-0 w-px h-full bg-gradient-to-b from-accent-500/80 via-accent-500/20 to-transparent shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
                  {project.longDescription.split("\n\n").map((para, i) => (
                    <p key={i} className="first-letter:text-6xl first-letter:font-display first-letter:text-accent-300 first-letter:mr-2 first-letter:float-left first-letter:leading-[0.8]">{para}</p>
                  ))}
                </article>
              </FadeIn>
            </Container>
          </Section>
        )}

        {/* Cinematic Horizontal Scroll Gallery */}
        {project.images.length > 1 && (
          <div className="mb-16 md:mb-32">
            <Container size="wide">
              <FadeIn>
                <Text variant="label" className="text-paper/40 mb-12">Gallery Exhibition</Text>
              </FadeIn>
            </Container>
            <HorizontalGallery images={project.images.slice(1)} title={project.title} />
          </div>
        )}

        {/* Videos section */}
        {allVideos.length > 0 && (
          <Section spacing="none" className="mb-16 md:mb-24">
            <Container size="wide">
              <FadeIn>
                <Text variant="label" className="text-paper/40 mb-6">Videos</Text>
              </FadeIn>
              <div className={`grid gap-6 ${allVideos.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                {allVideos.map((url, i) => (
                  <FadeIn key={url} delay={i * 0.05}>
                    <div className="group relative aspect-video overflow-hidden rounded-xl border border-ink-800/50 bg-ink-900 transition-all hover:border-accent-500/40 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]">
                      <iframe
                        src={url}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </FadeIn>
                ))}
              </div>
            </Container>
          </Section>
        )}

        {/* Documentation section (rendered markdown) */}
        {markdownContent && (
          <Section spacing="default" id="documentation">
            <Container size="narrow">
              <FadeIn>
                <Text variant="label" className="text-paper/40 mb-8">Documentation</Text>
                <MarkdownRenderer content={markdownContent} />
              </FadeIn>
            </Container>
          </Section>
        )}

        {/* Related projects */}
        {related.length > 0 && (
          <Section spacing="default" className="border-t border-ink-700/40">
            <Container size="wide">
              <Text variant="caption" className="text-paper/40">Continue</Text>
              <RevealText as="h2" text="More projects" className="mt-4 text-display-md font-display leading-[1] tracking-[-0.025em] text-paper" />
              <div className="mt-12 grid grid-cols-12 gap-8">
                {related.map((p, i) => (
                  <ProjectCard
                    key={p.id}
                    project={{
                      id: p.id, slug: p.slug, title: p.title, description: p.description,
                      tags: p.tags, techStack: p.techStack, images: p.images,
                      featured: p.featured, timeline: p.timeline, index: i,
                      githubUrl: p.githubUrl, liveUrl: p.liveUrl,
                    }}
                  />
                ))}
              </div>
            </Container>
          </Section>
        )}
      </main>
      <Footer social={social} />
    </>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="col-span-12 md:col-span-4">
      <Text variant="label" className="text-paper/40">{label}</Text>
      <div className="mt-3 text-body text-paper/85">{children}</div>
    </div>
  );
}
