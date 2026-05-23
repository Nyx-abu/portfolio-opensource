import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef } from "react";

type TagProps = ComponentPropsWithoutRef<"span"> & {
  tone?: "default" | "accent" | "muted";
};

const toneMap = {
  default: "border-ink-700/60 text-paper/80",
  accent: "border-accent-500/40 text-accent-200",
  muted: "border-ink-700/40 text-ink-300",
};

export function Tag({ className, tone = "default", children, ...rest }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-caption uppercase tracking-[0.12em]",
        toneMap[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
