import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { ProjectsBrowser } from "@/components/sections/ProjectsBrowser";
import { RevealText } from "@/components/motion/RevealText";
import { ProjectsGraphic } from "@/components/motion/ProjectsGraphic";
import { buildMetadata } from "@/lib/metadata";
import { getAllProjects, getSocialLinks } from "@/lib/data";

export const revalidate = 300;
export const metadata = buildMetadata({
  title: "Projects",
  description: "Selected projects, case studies and experiments.",
  path: "/projects",
});

export default async function ProjectsIndexPage() {
  const [projects, social] = await Promise.all([getAllProjects(), getSocialLinks()]);

  const techStacks = new Set(projects.flatMap((p) => p.techStack));

  return (
    <>
      <Nav />
      <main id="main" className="relative min-h-dvh pt-32 bg-ink-950 overflow-hidden">
        <ProjectsGraphic projectCount={projects.length} techStackCount={techStacks.size} />
        <Section spacing="default" className="relative z-10">
          <Container size="wide">
            <Text variant="caption" className="text-paper/40">
              Index
            </Text>
            <RevealText
              as="h1"
              text="Projects"
              className="mt-4 text-[4.5rem] md:text-[8rem] lg:text-[10rem] font-display leading-[0.85] tracking-[-0.04em] text-paper"
              stagger={0.06}
            />
            <Text variant="body-lg" className="mt-6 max-w-prose text-paper/55">
              A working archive of things I&apos;ve made — products, tools, prototypes and the
              occasional weekend study.
            </Text>
          </Container>
        </Section>

        <ProjectsBrowser
          projects={projects.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            description: p.description,
            techStack: p.techStack,
            tags: p.tags,
            images: p.images,
            featured: p.featured,
            timeline: p.timeline,
            githubUrl: p.githubUrl,
            liveUrl: p.liveUrl,
          }))}
        />
      </main>
      <Footer social={social} />
    </>
  );
}
