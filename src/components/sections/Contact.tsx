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
            className="text-display-xl font-display leading-[0.92] tracking-[-0.035em] text-paper"
            stagger={0.05}
          />
          <RevealText
            as="h2"
            text="building together?"
            className="text-display-xl font-display italic leading-[0.92] tracking-[-0.035em] text-paper/55"
            stagger={0.05}
            delay={0.25}
          />
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-14 grid grid-cols-12 gap-y-10 md:gap-x-12">
            <div className="col-span-12 md:col-span-7">
              <a
                href={`mailto:${email}`}
                onClick={() => track({ type: "contact_click" })}
                className="group inline-flex items-baseline gap-3 font-display text-display-md tracking-[-0.025em] text-paper transition-colors hover:text-accent-300"
              >
                <span className="border-b border-ink-700/60 pb-1 transition-colors group-hover:border-accent-400">
                  {email}
                </span>
                <span aria-hidden className="text-paper/40 transition-transform group-hover:translate-x-1">
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
                      className="group inline-flex items-center gap-2 font-sans text-body text-paper/80 transition-colors hover:text-paper"
                    >
                      <span className="font-mono text-caption uppercase tracking-[0.14em] text-paper/40">
                        {String(s.platform).slice(0, 2)}
                      </span>
                      <span>{s.platform}</span>
                      <span
                        aria-hidden
                        className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                      >
                        →
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
