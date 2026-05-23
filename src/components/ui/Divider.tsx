import { cn } from "@/lib/cn";

export function Divider({ className }: { className?: string }) {
  return <div role="separator" className={cn("h-px w-full bg-ink-700/40", className)} />;
}
