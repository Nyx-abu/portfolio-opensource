import { Container } from "@/components/ui/Container";
import { MotionSpan } from "@/components/motion/MotionSpan";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealText } from "@/components/motion/RevealText";
import { getExperience, getSkills } from "@/lib/data";

const formatDate = (d?: Date | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "Present";

export async function Experience() {
  const [exp, skillGroups] = await Promise.all([getExperience(), getSkills()]);

  return (
    <Section id="experience" spacing="vast" className="bg-ink-950">
      <Container size="wide">
        <div className="grid grid-cols-12 gap-y-20 md:gap-x-12">
          <div className="col-span-12 md:col-span-4">
            <Text variant="caption" className="text-paper/40">
              03 — Experience
            </Text>
            <RevealText
              as="h2"
              text="A few stops"
              className="mt-4 text-display-xl font-display leading-[0.85] tracking-[-0.02em] text-paper"
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
              <ul className="divide-y divide-ink-700/40">
                {exp.map((e, i) => (
                  <FadeIn key={e.id} as="li" delay={i * 0.05}>
                    <div className="group grid grid-cols-12 items-baseline gap-4 p-4 -mx-4 md:p-6 md:-mx-6 rounded-2xl border border-transparent transition-all duration-500 hover:bg-ink-900/40 hover:backdrop-blur-sm hover:border-ink-800/50">
                      <Text variant="caption" className="col-span-12 text-paper/40 md:col-span-3">
                        {formatDate(e.startDate)} — {e.current ? "Present" : formatDate(e.endDate)}
                      </Text>
                      <div className="col-span-12 md:col-span-9">
                        <Text variant="h3" className="text-paper transition-colors group-hover:text-accent-300">
                          {e.role} <span className="text-paper/50">· {e.company}</span>
                        </Text>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-32 grid grid-cols-12 gap-y-12 md:gap-x-12">
          <div className="col-span-12 md:col-span-4">
            <Text variant="caption" className="text-paper/40">
              Tools &amp; languages
            </Text>
            <RevealText
              as="h3"
              text="Stack"
              className="mt-4 text-display-lg font-display leading-[0.85] tracking-[-0.02em] text-paper"
            />
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="space-y-12">
              {skillGroups.map((group, idx) => (
                <FadeIn key={group.category} delay={idx * 0.05}>
                  <div>
                    <Text variant="label" className="text-paper/50">
                      {group.category}
                    </Text>
                    <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                      {group.items.map((s) => (
                        <MotionSpan
                          key={s.id}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="text-h3 font-display tracking-[-0.01em] text-paper/85 transition-colors hover:text-accent-300 inline-block cursor-default"
                        >
                          {s.name}
                        </MotionSpan>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
