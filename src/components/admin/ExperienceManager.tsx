"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { FieldShell, Input, Textarea, Checkbox } from "./Field";
import {
  createExperience,
  deleteExperience,
  updateExperience,
} from "@/lib/actions/experience";

type Row = {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
  order: number;
};

const emptyRow = {
  company: "",
  role: "",
  description: "",
  startDate: "",
  endDate: "",
  current: false,
};

export function ExperienceManager({ initial }: { initial: Row[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [draft, setDraft] = useState(emptyRow);

  const submit = () => {
    if (!draft.company || !draft.role || !draft.startDate) return;
    start(async () => {
      await createExperience({
        ...draft,
        order: initial.length,
        startDate: new Date(draft.startDate),
        endDate: draft.endDate ? new Date(draft.endDate) : null,
      });
      setDraft(emptyRow);
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      <header>
        <Text variant="caption" className="text-paper/40">
          Content
        </Text>
        <h1 className="mt-3 text-display-md font-display tracking-[-0.025em] text-paper">
          Experience
        </h1>
      </header>

      <Card className="p-6">
        <Text variant="label" className="text-paper/50">
          Add entry
        </Text>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <FieldShell label="Company">
            <Input
              value={draft.company}
              onChange={(e) => setDraft({ ...draft, company: e.target.value })}
            />
          </FieldShell>
          <FieldShell label="Role">
            <Input
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
            />
          </FieldShell>
          <FieldShell label="Start date">
            <Input
              type="date"
              value={draft.startDate}
              onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
            />
          </FieldShell>
          <FieldShell label="End date">
            <Input
              type="date"
              value={draft.endDate}
              disabled={draft.current}
              onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
            />
          </FieldShell>
          <div className="md:col-span-2">
            <FieldShell label="Description">
              <Textarea
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </FieldShell>
          </div>
          <div className="flex items-center justify-between md:col-span-2">
            <Checkbox
              label="Current role"
              checked={draft.current}
              onChange={(e) => setDraft({ ...draft, current: e.target.checked })}
            />
            <button
              disabled={pending}
              onClick={submit}
              className="rounded-full bg-paper px-5 py-2 font-mono text-label uppercase tracking-[0.14em] text-ink-950 disabled:opacity-50"
            >
              + Add
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <ul className="divide-y divide-ink-700/40">
          {initial.length === 0 ? (
            <li className="py-6 text-center text-paper/55">No experience entries yet.</li>
          ) : (
            initial.map((r) => (
              <li key={r.id} className="space-y-1 py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <Text variant="h4" className="text-paper">
                      {r.role} <span className="text-paper/50">· {r.company}</span>
                    </Text>
                    <Text variant="caption" className="mt-1 text-paper/40">
                      {r.startDate} — {r.current ? "Present" : r.endDate || "—"}
                    </Text>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        start(async () => {
                          await updateExperience(r.id, { current: !r.current });
                          router.refresh();
                        })
                      }
                      className="font-mono text-caption uppercase tracking-[0.14em] text-paper/70 hover:text-paper"
                    >
                      {r.current ? "Mark past" : "Mark current"}
                    </button>
                    <button
                      onClick={() =>
                        start(async () => {
                          await deleteExperience(r.id);
                          router.refresh();
                        })
                      }
                      className="font-mono text-caption uppercase tracking-[0.14em] text-rose-300/80 hover:text-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {r.description && (
                  <Text variant="body-sm" className="text-paper/60">
                    {r.description}
                  </Text>
                )}
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
