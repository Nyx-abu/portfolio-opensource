import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { Tag } from "@/components/ui/Tag";
import { Badge } from "@/components/ui/Badge";
import { RevealText } from "@/components/motion/RevealText";
import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
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

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main" className="min-h-dvh pt-32">
        <Section spacing="compact">
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
                className="mt-6 text-display-2xl font-display leading-[0.9] tracking-[-0.04em] text-paper"
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

        <Section spacing="compact">
          <Container size="wide">
            <div className="grid grid-cols-12 gap-y-8 border-y border-ink-700/40 py-8 md:gap-x-12">
              <Meta label="Tech stack">
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </Meta>
              <Meta label="Tags">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((t) => (
                    <Tag key={t} tone="muted">
                      {t}
                    </Tag>
                  ))}
                </div>
              </Meta>
              <Meta label="Links">
                <div className="flex flex-col gap-1.5">
                  {project.liveUrl && (
                    <a
                      className="underline-offset-4 hover:underline"
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live →
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      className="underline-offset-4 hover:underline"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source →
                    </a>
                  )}
                </div>
              </Meta>
            </div>
          </Container>
        </Section>

        {project.images.length > 0 && (
          <Section spacing="compact">
            <Container size="wide">
              <FadeIn>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </FadeIn>
            </Container>
          </Section>
        )}

        {project.longDescription && (
          <Section spacing="default">
            <Container size="narrow">
              <FadeIn>
                <article className="prose-portfolio space-y-6 text-body-lg font-light leading-relaxed text-paper/80">
                  {project.longDescription.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </article>
              </FadeIn>
            </Container>
          </Section>
        )}

        {project.images.length > 1 && (
          <Section spacing="compact">
            <Container size="wide">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {project.images.slice(1).map((img, i) => (
                  <FadeIn key={img} delay={i * 0.05}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                      <Image
                        src={img}
                        alt={`${project.title} image ${i + 2}`}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </FadeIn>
                ))}
              </div>
            </Container>
          </Section>
        )}

        {project.videoUrl && (
          <Section spacing="compact">
            <Container size="wide">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-ink-900">
                <iframe
                  src={project.videoUrl}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Container>
          </Section>
        )}

        {related.length > 0 && (
          <Section spacing="default" className="border-t border-ink-700/40">
            <Container size="wide">
              <Text variant="caption" className="text-paper/40">
                Continue
              </Text>
              <RevealText
                as="h2"
                text="More projects"
                className="mt-4 text-display-md font-display leading-[1] tracking-[-0.025em] text-paper"
              />
              <div className="mt-12 grid grid-cols-12 gap-8">
                {related.map((p, i) => (
                  <ProjectCard
                    key={p.id}
                    project={{
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
      <Text variant="label" className="text-paper/40">
        {label}
      </Text>
      <div className="mt-3 text-body text-paper/85">{children}</div>
    </div>
  );
}
