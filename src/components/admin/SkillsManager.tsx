"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { FieldShell, Input } from "./Field";
import { createSkill, deleteSkill, updateSkill } from "@/lib/actions/skills";
import type { Skill } from "@prisma/client";

export function SkillsManager({ initial }: { initial: Skill[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [draft, setDraft] = useState({ name: "", category: "" });

  const grouped = new Map<string, Skill[]>();
  initial.forEach((s) => {
    const arr = grouped.get(s.category) ?? [];
    arr.push(s);
    grouped.set(s.category, arr);
  });

  return (
    <div className="space-y-8">
      <header>
        <Text variant="caption" className="text-paper/40">
          Content
        </Text>
        <h1 className="mt-3 text-display-md font-display tracking-[-0.025em] text-paper">
          Skills
        </h1>
      </header>

      <Card className="p-6">
        <Text variant="label" className="text-paper/50">
          Add new
        </Text>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <FieldShell label="Name">
            <Input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </FieldShell>
          <FieldShell label="Category">
            <Input
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
          </FieldShell>
          <button
            disabled={pending || !draft.name || !draft.category}
            onClick={() =>
              start(async () => {
                await createSkill({ ...draft, order: initial.length });
                setDraft({ name: "", category: "" });
                router.refresh();
              })
            }
            className="rounded-full bg-paper px-5 py-2.5 font-mono text-label uppercase tracking-[0.14em] text-ink-950 disabled:opacity-50"
          >
            + Add
          </button>
        </div>
      </Card>

      <div className="space-y-6">
        {Array.from(grouped.entries()).map(([category, items]) => (
          <Card key={category} className="p-6">
            <Text variant="label" className="text-paper/50">
              {category}
            </Text>
            <ul className="mt-4 divide-y divide-ink-700/40">
              {items.map((s) => (
                <SkillRow
                  key={s.id}
                  skill={s}
                  onUpdate={(patch) =>
                    start(async () => {
                      await updateSkill(s.id, patch);
                      router.refresh();
                    })
                  }
                  onDelete={() =>
                    start(async () => {
                      await deleteSkill(s.id);
                      router.refresh();
                    })
                  }
                />
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SkillRow({
  skill,
  onUpdate,
  onDelete,
}: {
  skill: Skill;
  onUpdate: (patch: { name?: string; category?: string }) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(skill.name);
  const [category, setCategory] = useState(skill.category);
  return (
    <li className="grid grid-cols-1 items-center gap-3 py-3 md:grid-cols-[1fr_1fr_auto]">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => name !== skill.name && onUpdate({ name })}
        className="bg-transparent text-body text-paper outline-none"
      />
      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        onBlur={() => category !== skill.category && onUpdate({ category })}
        className="bg-transparent text-body text-paper/70 outline-none"
      />
      <button
        onClick={onDelete}
        className="justify-self-end font-mono text-caption uppercase tracking-[0.14em] text-rose-300/80 hover:text-rose-300"
      >
        Remove
      </button>
    </li>
  );
}
