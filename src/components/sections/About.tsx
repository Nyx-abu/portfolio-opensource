import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealText } from "@/components/motion/RevealText";
import { getAboutContent } from "@/lib/data";

export async function About() {
  const about = await getAboutContent();

  return (
    <Section id="about" spacing="vast" className="bg-ink-950">
      <Container size="wide">
        <div className="grid grid-cols-12 gap-y-12 md:gap-x-12">
          <div className="col-span-12 md:col-span-4">
            <Text variant="caption" className="text-paper/40">
              01 — About
            </Text>
            <div className="mt-4 h-px w-12 bg-accent-500/60" />
          </div>

          <div className="col-span-12 md:col-span-8">
            <RevealText
              as="h2"
              text={about.headline}
              className="text-display-md font-display leading-[1] tracking-[-0.025em] text-paper"
              stagger={0.04}
            />

            <FadeIn delay={0.2}>
              <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
                <p className="text-body-lg font-light leading-relaxed text-paper/75">
                  {about.body}
                </p>
                <div className="space-y-4">
                  <p className="text-body font-light leading-relaxed text-paper/60">
                    My work blends quiet visual systems with infrastructure that takes itself
                    seriously — backed by years of shipping product across consumer, dev tooling
                    and AI surfaces.
                  </p>
                  <p className="font-script text-2xl leading-tight text-accent-300/90">
                    &nbsp;— with care, every detail.
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
