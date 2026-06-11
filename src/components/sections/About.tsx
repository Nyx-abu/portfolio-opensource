import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { FadeIn } from "@/components/motion/FadeIn";
import { ScrollFillText } from "@/components/motion/ScrollFillText";
import { getAboutContent } from "@/lib/data";
import { PersonnelID } from "@/components/motion/PersonnelID";

export async function About() {
  const about = await getAboutContent();

  return (
    <Section id="about" spacing="vast" className="bg-ink-950 relative overflow-hidden">
      {/* Background ambient glow — sized fluidly so it never pushes layout on small screens */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[60vw] max-w-[800px] aspect-square bg-accent-900/10 rounded-full blur-[120px] pointer-events-none" />

      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-16 lg:gap-x-16 items-center">
          
          {/* LEFT: Cinematic Personnel ID */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <PersonnelID />
          </div>

          {/* RIGHT: About Content */}
          <div className="lg:col-span-7">
            <Text variant="caption" className="text-paper/40 mb-6 block">
              01 — About
            </Text>

            <ScrollFillText
              text={about.headline}
              className="text-display-sm md:text-display-md font-sans font-light leading-[1.15] tracking-tight text-paper mt-6"
            />

            <FadeIn delay={0.2}>
              <div className="mt-10 space-y-8">
                <div className="prose-portfolio text-body-lg font-light leading-relaxed text-paper/75">
                  {about.body.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                
                <div className="p-6 border border-ink-800/50 bg-ink-900/20 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500/20 via-accent-400/40 to-transparent" />
                  <p className="text-body font-light leading-relaxed text-paper/60">
                    My work blends quiet visual systems with infrastructure that takes itself
                    seriously — backed by years of shipping product across consumer, dev tooling
                    and AI surfaces.
                  </p>
                  <p className="font-script text-3xl leading-tight text-accent-300/90 mt-4 text-right">
                    — with care, every detail.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </Container>
    </Section>
  );
}
