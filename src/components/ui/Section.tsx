import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef } from "react";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  spacing?: "none" | "compact" | "default" | "loose" | "vast";
  id?: string;
};

const spacingMap = {
  none: "",
  compact: "py-10 md:py-20",
  default: "py-12 md:py-32",
  loose: "py-14 md:py-48",
  vast: "py-16 md:py-64",
} as const;

export function Section({
  className,
  spacing = "default",
  children,
  ...rest
}: SectionProps) {
  return (
    <section className={cn("relative", spacingMap[spacing], className)} {...rest}>
      {children}
    </section>
  );
}
