"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProject, toggleFeatured } from "@/lib/actions/projects";

export function FeaturedToggle({ id, featured }: { id: string; featured: boolean }) {
  const [optimistic, setOptimistic] = useState(featured);
  const [, start] = useTransition();
  return (
    <button
      type="button"
      onClick={() => {
        setOptimistic((v) => !v);
        start(async () => {
          try {
            await toggleFeatured(id);
          } catch {
            setOptimistic(featured);
          }
        });
      }}
      className={`inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
        optimistic ? "border-accent-500 bg-accent-500/60" : "border-ink-700/60 bg-ink-800"
      }`}
      aria-pressed={optimistic}
      aria-label="Toggle featured"
    >
      <span
        className={`block h-4 w-4 rounded-full bg-paper transition-transform ${
          optimistic ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function DeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      onClick={() => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        start(async () => {
          await deleteProject(id);
          router.refresh();
        });
      }}
      className="font-mono text-caption uppercase tracking-[0.12em] text-rose-300/80 hover:text-rose-300 disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}

