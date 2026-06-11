"use client";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { RevealText } from "@/components/motion/RevealText";
import { FadeIn } from "@/components/motion/FadeIn";
import { track } from "@/lib/analytics";

type ContactProps = {
  email?: string;
  social?: { id: string; platform: string; url: string }[];
};

export function Contact({ email = "hello@example.com", social = [] }: ContactProps) {
  return (
    <Section id="contact" spacing="vast" className="border-t border-ink-700/40 bg-ink-950">
      <Container size="wide">
        <Text variant="caption" className="text-paper/40">
          04 — Get in touch
        </Text>
        <div className="mt-6 max-w-5xl">
          <RevealText
            as="h2"
            text="Have something worth"
            className="text-3xl sm:text-5xl lg:text-7xl font-display leading-[1.05] sm:leading-[0.85] tracking-[-0.02em] text-paper"
            stagger={0.05}
          />
          <RevealText
            as="h2"
            text="building together?"
            className="text-3xl sm:text-5xl lg:text-7xl font-display leading-[1.05] sm:leading-[0.85] tracking-[-0.02em] text-paper/55"
            stagger={0.05}
            delay={0.25}
          />
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-10 md:mt-14 grid grid-cols-12 gap-y-8 md:gap-y-10 md:gap-x-12">
            <div className="col-span-12 md:col-span-7">
              <a
                href={`mailto:${email}`}
                onClick={() => track({ type: "contact_click" })}
                className="group inline-flex max-w-full flex-wrap items-baseline gap-3 font-display text-xl sm:text-h3 md:text-display-sm tracking-tight text-paper transition-all hover:bg-gradient-to-r hover:from-accent-400 hover:to-emerald-400 hover:bg-clip-text hover:text-transparent"
              >
                <span className="break-all border-b border-ink-700/60 pb-1 transition-colors group-hover:border-accent-400">
                  {email}
                </span>
                <span aria-hidden className="shrink-0 text-paper/40 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <Text variant="body" className="mt-6 max-w-md text-paper/55">
                Best for new collaborations, full-time roles, and considered side projects. Expect
                a reply within two working days.
              </Text>
            </div>

            <div className="col-span-12 md:col-span-4 md:col-start-9">
              <Text variant="label" className="text-paper/50">
                Elsewhere
              </Text>
              <ul className="mt-4 space-y-2">
                {social.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-4 rounded-xl border border-transparent p-4 font-sans text-body text-paper/40 transition-all hover:border-ink-700/50 hover:bg-ink-900/40 hover:text-paper"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-caption uppercase tracking-[0.14em] text-paper/20 group-hover:text-paper/40 transition-colors">
                          {String(s.platform).slice(0, 2)}
                        </span>
                        <span>{s.platform}</span>
                      </div>
                      <span
                        aria-hidden
                        className="opacity-0 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
