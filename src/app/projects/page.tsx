import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { ProjectsBrowser } from "@/components/sections/ProjectsBrowser";
import { RevealText } from "@/components/motion/RevealText";
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

  return (
    <>
      <Nav />
      <main id="main" className="min-h-dvh pt-32">
        <Section spacing="default">
          <Container size="wide">
            <Text variant="caption" className="text-paper/40">
              Index
            </Text>
            <RevealText
              as="h1"
              text="Projects"
              className="mt-4 text-display-2xl font-display leading-[0.9] tracking-[-0.04em] text-paper"
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
          }))}
        />
      </main>
      <Footer social={social} />
    </>
  );
}
