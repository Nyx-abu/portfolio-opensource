import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center bg-ink-950">
      <Container size="narrow">
        <Text variant="caption" className="text-paper/40">
          404
        </Text>
        <h1 className="mt-4 text-display-xl font-display leading-[0.9] tracking-[-0.035em] text-paper">
          Lost the thread.
        </h1>
        <p className="mt-6 max-w-prose text-body-lg font-light text-paper/60">
          That page either moved or never existed. Either way, here&apos;s the way home.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 border-b border-ink-700/60 pb-1 font-mono text-label uppercase tracking-[0.18em] text-paper transition-colors hover:border-paper"
        >
          <span aria-hidden>←</span> Back to home
        </Link>
      </Container>
    </main>
  );
}
