import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef } from "react";

type GridProps = ComponentPropsWithoutRef<"div"> & {
  cols?: 2 | 3 | 4 | 6 | 12;
  gap?: "sm" | "md" | "lg" | "xl";
};

const colMap = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-12",
};

const gapMap = {
  sm: "gap-4",
  md: "gap-6 md:gap-8",
  lg: "gap-8 md:gap-12",
  xl: "gap-12 md:gap-16",
};

export function Grid({ className, cols = 12, gap = "md", children, ...rest }: GridProps) {
  return (
    <div className={cn("grid", colMap[cols], gapMap[gap], className)} {...rest}>
      {children}
    </div>
  );
}
