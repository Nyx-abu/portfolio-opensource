"use client";

import { cn } from "@/lib/cn";
import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
} from "react";

type FieldShellProps = { label: string; hint?: string; children: ReactNode };
export function FieldShell({ label, hint, children }: FieldShellProps) {
  return (
    <label className="block">
      <span className="font-mono text-caption uppercase tracking-[0.16em] text-paper/50">
        {label}
      </span>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1.5 text-caption text-paper/40">{hint}</p>}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full border-b border-ink-700/60 bg-transparent py-2.5 text-body text-paper outline-none transition-colors focus:border-accent-500",
        className,
      )}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-md border border-ink-700/60 bg-ink-900/40 p-3 text-body text-paper outline-none transition-colors focus:border-accent-500",
        className,
      )}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full appearance-none border-b border-ink-700/60 bg-transparent py-2.5 text-body text-paper outline-none transition-colors focus:border-accent-500",
        className,
      )}
    >
      {children}
    </select>
  );
}

export function Checkbox({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="inline-flex select-none items-center gap-2 text-body text-paper">
      <input type="checkbox" {...props} className="h-4 w-4 accent-accent-500" />
      <span>{label}</span>
    </label>
  );
}

export function TagInput({
  value,
  onChange,
  placeholder = "Press Enter to add",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-md border border-ink-700/60 bg-ink-900/40 p-2">
      {value.map((v, i) => (
        <span
          key={`${v}-${i}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink-800 px-2.5 py-1 font-mono text-caption uppercase tracking-[0.12em] text-paper/85"
        >
          {v}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="text-paper/50 hover:text-paper"
          >
            ✕
          </button>
        </span>
      ))}
      <input
        type="text"
        placeholder={placeholder}
        className="min-w-[10ch] flex-1 bg-transparent px-1 py-1 text-body text-paper outline-none"
        onKeyDown={(e) => {
          const input = e.currentTarget;
          if ((e.key === "Enter" || e.key === ",") && input.value.trim()) {
            e.preventDefault();
            onChange([...value, input.value.trim()]);
            input.value = "";
          } else if (e.key === "Backspace" && !input.value && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
      />
    </div>
  );
}
