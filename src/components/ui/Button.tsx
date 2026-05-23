"use client";

import Link from "next/link";
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { MagneticButton } from "@/components/motion/MagneticButton";

type Variant = "primary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  magnetic?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-tight transition-colors duration-300 ease-out-expo disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-paper text-ink-950 hover:bg-paper/90 px-6 py-3 border border-paper/20",
  ghost:
    "bg-transparent text-paper border border-ink-700/60 hover:border-paper/60 hover:bg-paper/5 px-6 py-3",
  link:
    "bg-transparent text-paper px-0 py-0 underline-offset-4 hover:underline decoration-accent-400 decoration-1",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm md:text-base",
  lg: "text-base md:text-lg px-8 py-4",
};

type ButtonElProps = CommonProps & ComponentPropsWithoutRef<"button"> & { href?: never };
type LinkElProps = CommonProps & ComponentPropsWithoutRef<"a"> & { href: string };

export const Button = forwardRef<HTMLButtonElement, ButtonElProps | LinkElProps>(function Button(
  { variant = "primary", size = "md", className, magnetic = false, children, ...rest },
  ref,
) {
  const classes = cn(base, variants[variant], variant !== "link" && sizes[size], className);

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest as LinkElProps;
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={classes}
          {...(linkRest as ComponentPropsWithoutRef<"a">)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...(linkRest as ComponentPropsWithoutRef<"a">)}>
        {children}
      </Link>
    );
  }

  if (magnetic) {
    return (
      <MagneticButton className={classes} {...(rest as ComponentPropsWithoutRef<"button">)}>
        {children}
      </MagneticButton>
    );
  }

  return (
    <button ref={ref} className={classes} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
});
