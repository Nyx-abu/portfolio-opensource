import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef } from "react";

type CardProps = ComponentPropsWithoutRef<"div"> & {
  interactive?: boolean;
};

export function Card({ className, interactive = false, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-ink-700/40 bg-ink-900/50",
        interactive &&
          "transition-colors duration-500 ease-out-expo hover:border-paper/30 hover:bg-ink-800/60",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
