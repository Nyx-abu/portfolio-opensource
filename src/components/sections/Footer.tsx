import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";
import { InteractiveCore } from "@/components/motion/InteractiveCore";

type FooterProps = {
  name?: string;
  social?: { id: string; platform: string; url: string }[];
};

export function Footer({ name = "Abdur Raheem", social = [] }: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-ink-700/40 bg-ink-950 pt-20 pb-10">
      
      {/* Background massive typography */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden opacity-5 flex items-end justify-center select-none">
        <h1 className="text-[25vw] font-display uppercase tracking-tighter leading-[0.75] whitespace-nowrap">
          {name}
        </h1>
      </div>

      <Container size="wide" className="relative z-10">
        
        {/* Interactive God Mode Element */}
        <div className="w-full border-b border-ink-700/40 pb-20 mb-16 flex flex-col items-center justify-center">
          <InteractiveCore />
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em] text-paper/30">
            System Online. Awaiting input.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-y-12 md:gap-x-12">
          <div className="col-span-12 md:col-span-8">
            <Link
              href="/"
              className="block font-display text-5xl md:text-7xl leading-[0.9] tracking-tight text-paper/95 hover:text-white transition-colors"
            >
              Initiate Contact.
            </Link>
            <Text variant="body" className="mt-6 max-w-md text-paper/55">
              Full-stack engineer based in Chennai. Currently open to remote work and relocation.
            </Text>
            <a href="mailto:hello@example.com" className="inline-block mt-8 border border-paper/20 rounded-full px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-paper hover:text-ink-950 transition-colors">
              hello@example.com
            </a>
          </div>

          <div className="col-span-6 md:col-span-2">
            <Text variant="label" className="text-paper/40 mb-4 block">
              Sitemap
            </Text>
            <ul className="space-y-3 text-body text-paper/75 font-light">
              <li><Link className="hover:text-accent-400 transition-colors" href="/">Home</Link></li>
              <li><Link className="hover:text-accent-400 transition-colors" href="/projects">Projects</Link></li>
              <li><Link className="hover:text-accent-400 transition-colors" href="/#about">About</Link></li>
              <li><Link className="hover:text-accent-400 transition-colors" href="/#contact">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <Text variant="label" className="text-paper/40 mb-4 block">
              Elsewhere
            </Text>
            <ul className="space-y-3 text-body text-paper/75 font-light">
              {social.map((s) => (
                <li key={s.id}>
                  <a className="hover:text-accent-400 transition-colors" href={s.url} target="_blank" rel="noreferrer">
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-24 border-t border-ink-700/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Text variant="caption" className="text-paper/30">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </Text>
          <Text variant="caption" className="text-paper/30 font-mono tracking-widest">
            SYS.STATUS // NOMINAL
          </Text>
        </div>
      </Container>
    </footer>
  );
}
