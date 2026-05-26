"use client";

import React from "react";
import { cn } from "@/lib/cn";
import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiPrisma,
  SiMongodb,
  SiRedis,
  SiOpenai,
  SiGit,
  SiDocker,
  SiAmazon,
  SiVercel,
  SiElectron,
  SiJsonwebtokens
} from "react-icons/si";

export const TechIconMap: Record<string, React.ElementType> = {
  "TypeScript": SiTypescript,
  "JavaScript": SiJavascript,
  "Python": SiPython,
  "C / C++": SiCplusplus,
  "Next.js": SiNextdotjs,
  "React": SiReact,
  "Tailwind CSS": SiTailwindcss,
  "Framer Motion": SiFramer,
  "Node.js": SiNodedotjs,
  "Express": SiExpress,
  "PostgreSQL": SiPostgresql,
  "Prisma": SiPrisma,
  "MongoDB": SiMongodb,
  "Redis / Upstash": SiRedis,
  "OpenAI": SiOpenai,
  "Git / GitHub Actions": SiGit,
  "Docker": SiDocker,
  "AWS (EC2 / S3)": SiAmazon,
  "Vercel": SiVercel,
  "Electron": SiElectron,
  "JWT / OAuth": SiJsonwebtokens,
};

type TechPillProps = {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
};

export function TechPill({ name, size = "md", className, animate = false }: TechPillProps) {
  const Icon = TechIconMap[name];

  const sizeClasses = {
    sm: "px-2 py-1 text-[9px] gap-1.5 rounded-sm",
    md: "px-3 py-1.5 text-[10px] gap-2 rounded-md",
    lg: "px-4 py-2 text-[12px] gap-2 rounded-full",
  };

  const iconSizes = {
    sm: "text-[10px]",
    md: "text-[12px]",
    lg: "text-[16px]",
  };

  return (
    <span
      className={cn(
        "group relative inline-flex items-center border border-ink-700/40 bg-ink-900/30 font-mono uppercase tracking-[0.2em] text-paper/70 transition-all hover:border-accent-500/50 hover:bg-accent-500/10 hover:text-accent-300 cursor-default overflow-hidden backdrop-blur-sm whitespace-nowrap",
        animate && "hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]",
        sizeClasses[size],
        className
      )}
    >
      {animate && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent-500/0 via-accent-500/10 to-accent-500/0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      )}
      {Icon && (
        <span className={cn("relative z-10 transition-transform duration-500", animate && "group-hover:rotate-12", iconSizes[size])}>
          <Icon />
        </span>
      )}
      <span className="relative z-10 leading-none translate-y-[1px]">{name}</span>
    </span>
  );
}
