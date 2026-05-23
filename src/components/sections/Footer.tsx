import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";

type FooterProps = {
  name?: string;
  social?: { id: string; platform: string; url: string }[];
};

export function Footer({ name = "Portfolio", social = [] }: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-ink-700/40 bg-ink-950">
      <Container size="wide" className="py-16 md:py-24">
        <div className="grid grid-cols-12 gap-y-12 md:gap-x-12">
          <div className="col-span-12 md:col-span-8">
            <Link
              href="/"
              className="block font-display text-display-lg leading-[0.9] tracking-[-0.03em] text-paper/95"
            >
              {name}.
            </Link>
            <Text variant="body" className="mt-6 max-w-md text-paper/55">
              Independent engineer & designer. Currently open to new collaborations starting Q3.
            </Text>
          </div>

          <div className="col-span-6 md:col-span-2">
            <Text variant="label" className="text-paper/40">
              Sitemap
            </Text>
            <ul className="mt-4 space-y-2 text-body text-paper/75">
              <li>
                <Link className="hover:text-paper" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:text-paper" href="/projects">
                  Projects
                </Link>
              </li>
              <li>
                <Link className="hover:text-paper" href="/#about">
                  About
                </Link>
              </li>
              <li>
                <Link className="hover:text-paper" href="/#contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <Text variant="label" className="text-paper/40">
              Elsewhere
            </Text>
            <ul className="mt-4 space-y-2 text-body text-paper/75">
              {social.map((s) => (
                <li key={s.id}>
                  <a
                    className="hover:text-paper"
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-ink-700/40 pt-8 md:flex-row md:items-end">
          <Text variant="caption" className="text-paper/40">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </Text>
          <Text variant="caption" className="text-paper/40">
            Built with Next.js · Typography by Dx Playhigh &amp; Kiya Handwrite
          </Text>
        </div>
      </Container>
    </footer>
  );
}
