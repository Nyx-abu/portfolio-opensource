import { cn } from "@/lib/cn";
import type { ElementType, ComponentPropsWithoutRef } from "react";

type ContainerProps<T extends ElementType> = {
  as?: T;
  size?: "narrow" | "default" | "wide" | "full";
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "size">;

const sizes: Record<NonNullable<ContainerProps<"div">["size"]>, string> = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-[88rem]",
  full: "max-w-none",
};

export function Container<T extends ElementType = "div">({
  as,
  size = "default",
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag className={cn("mx-auto w-full px-5 md:px-8 lg:px-12", sizes[size], className)} {...rest}>
      {children}
    </Tag>
  );
}
