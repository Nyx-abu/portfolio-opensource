import { cn } from "@/lib/cn";
import type { ElementType, ComponentPropsWithoutRef } from "react";

type Variant =
  | "display-2xl"
  | "display-xl"
  | "display-lg"
  | "display-md"
  | "display-sm"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body-lg"
  | "body"
  | "body-sm"
  | "label"
  | "caption";

const variantClasses: Record<Variant, string> = {
  "display-2xl": "text-display-2xl font-display",
  "display-xl": "text-display-xl font-display",
  "display-lg": "text-display-lg font-display",
  "display-md": "text-display-md font-display",
  "display-sm": "text-display-sm font-display",
  h1: "text-h1 font-display",
  h2: "text-h2 font-display",
  h3: "text-h3 font-sans font-medium",
  h4: "text-h4 font-sans font-medium",
  "body-lg": "text-body-lg font-sans font-light",
  body: "text-body font-sans font-light",
  "body-sm": "text-body-sm font-sans font-light",
  label: "text-label font-mono uppercase tracking-[0.18em]",
  caption: "text-caption font-mono uppercase tracking-[0.1em] text-ink-400",
};

const defaultTag: Record<Variant, ElementType> = {
  "display-2xl": "h1",
  "display-xl": "h1",
  "display-lg": "h1",
  "display-md": "h2",
  "display-sm": "h3",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  "body-lg": "p",
  body: "p",
  "body-sm": "p",
  label: "span",
  caption: "span",
};

type TextProps<T extends ElementType> = {
  variant?: Variant;
  as?: T;
  className?: string;
  balance?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export function Text<T extends ElementType = "p">({
  variant = "body",
  as,
  className,
  balance = false,
  children,
  ...rest
}: TextProps<T>) {
  const Tag = (as ?? defaultTag[variant]) as ElementType;
  return (
    <Tag
      className={cn(variantClasses[variant], balance && "text-balance", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
