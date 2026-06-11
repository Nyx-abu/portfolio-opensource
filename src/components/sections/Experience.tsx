import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { getExperience, getSkills } from "@/lib/data";
import { RevealText } from "@/components/motion/RevealText";
import { FadeIn } from "@/components/motion/FadeIn";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";

const formatDate = (d?: Date | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "Present";

export async function Experience() {
  const [exp, skillGroups] = await Promise.all([getExperience(), getSkills()]);

  return (
    <Section id="experience" spacing="vast" className="bg-ink-950">
      <Container size="wide">
        <div className="grid grid-cols-12 gap-y-12 md:gap-y-20 md:gap-x-12">
          <div className="col-span-12 md:col-span-4">
            <Text variant="caption" className="text-paper/40">
              03 — Experience
            </Text>
            <RevealText
              as="h2"
              text="A few stops"
              className="mt-4 text-3xl sm:text-5xl lg:text-7xl font-display leading-[1.05] sm:leading-[0.85] tracking-[-0.02em] text-paper"
            />
            <FadeIn delay={0.2}>
              <p className="mt-6 max-w-sm text-body font-light text-paper/60">
                Selected roles, collaborations and milestones across product, infrastructure and
                interface design.
              </p>
            </FadeIn>
          </div>

          <div className="col-span-12 md:col-span-8">
            {exp.length === 0 ? (
              <FadeIn>
                <div className="rounded-xl border border-dashed border-ink-700/60 p-10">
                  <Text variant="body" className="text-paper/60">
                    No experience entries yet. Add from /admin.
                  </Text>
                </div>
              </FadeIn>
            ) : (
              <div className="relative border-l border-ink-800/40 ml-2 md:ml-4 py-4">
                {/* Subtle gradient line overlay to make it look like a beam */}
                <div className="absolute left-[-1px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-500/20 to-transparent" />
                
                <ul className="flex flex-col gap-12 md:gap-16">
                  {exp.map((e, i) => (
                    <FadeIn key={e.id} as="li" delay={i * 0.1}>
                      <div className="group relative pl-8 md:pl-12 transition-transform duration-700 ease-out md:hover:translate-x-2">
                        {/* The Node on the timeline */}
                        <div className="absolute -left-[4.5px] top-1.5 h-2 w-2 rotate-45 border border-ink-600 bg-ink-950 transition-all duration-500 group-hover:scale-[2] group-hover:rotate-90 group-hover:border-accent-400 group-hover:bg-accent-500 group-hover:shadow-[0_0_20px_rgba(56,189,248,1)]" />
                        
                        {/* Connecting horizontal dash */}
                        <div className="absolute left-0 top-[9px] h-px w-4 bg-ink-800/50 transition-all duration-700 md:group-hover:w-8 group-hover:bg-accent-500/50" />

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-baseline">
                          <div className="md:col-span-5 lg:col-span-4">
                            <Text variant="caption" className="font-mono text-[10px] tracking-[0.2em] text-paper/30 transition-colors duration-500 group-hover:text-accent-400/80 uppercase whitespace-normal sm:whitespace-nowrap">
                               [{formatDate(e.startDate)} {"//"} {e.current ? "PRESENT" : formatDate(e.endDate)}]
                            </Text>
                          </div>
                          
                          <div className="md:col-span-7 lg:col-span-8">
                            <Text variant="h3" className="text-paper/70 transition-all duration-500 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                              {e.role} 
                            </Text>
                            <Text variant="body" className="mt-1.5 font-light text-paper/40 transition-colors duration-500 group-hover:text-paper/70">
                              {e.company}
                            </Text>
                          </div>
                        </div>
                        
                        {/* Ambient Glow Background on Hover */}
                        <div className="absolute inset-0 -z-10 -ml-8 md:-ml-12 bg-gradient-to-r from-accent-500/0 via-accent-500/5 to-transparent opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
                      </div>
                    </FadeIn>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 md:mt-32 w-full border-t border-ink-800/40 pt-10 md:pt-16 md:pt-24 pb-10">
          <Container size="wide" className="mb-12">
            <div className="grid grid-cols-12 gap-y-12 md:gap-x-12">
              <div className="col-span-12 md:col-span-4">
                <Text variant="caption" className="text-paper/40">
                  Tools &amp; languages
                </Text>
                <RevealText
                  as="h3"
                  text="Stack"
                  className="mt-4 text-3xl sm:text-5xl lg:text-7xl font-display leading-[1.05] sm:leading-[0.85] tracking-[-0.02em] text-paper"
                />
              </div>
            </div>
          </Container>

          <div className="w-full flex flex-col gap-6 md:gap-8 overflow-hidden py-10 bg-ink-950">
            {skillGroups.map((group, idx) => {
              const textString = group.items.map(s => s.name).join(" // ") + " // ";
              const baseVel = idx % 2 === 0 ? 0.8 : -0.8;
              const outlineClass = idx % 2 === 0 
                ? "text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)]" 
                : "text-paper/80";

              return (
                <VelocityMarquee 
                  key={group.category} 
                  text={textString} 
                  baseVelocity={baseVel} 
                  className={`text-4xl sm:text-6xl md:text-8xl lg:text-[7vw] font-display uppercase tracking-tighter ${outlineClass}`}
                />
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
