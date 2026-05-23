import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef } from "react";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  tone?: "live" | "draft" | "featured" | "neutral";
};

const toneMap = {
  live: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  draft: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  featured: "bg-accent-500/15 text-accent-200 border-accent-500/40",
  neutral: "bg-ink-800 text-ink-200 border-ink-700/60",
};

export function Badge({ tone = "neutral", className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-caption uppercase tracking-[0.1em]",
        toneMap[tone],
        className,
      )}
      {...rest}
    >
      {tone === "live" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
      )}
      {children}
    </span>
  );
}
