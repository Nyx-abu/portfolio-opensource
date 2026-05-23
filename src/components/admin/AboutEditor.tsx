"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { FieldShell, Textarea } from "./Field";
import { updateAbout } from "@/lib/actions/about";

export function AboutEditor({ initial }: { initial: { headline: string; body: string } }) {
  const [state, setState] = useState(initial);
  const [pending, start] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <Text variant="caption" className="text-paper/40">
            Content
          </Text>
          <h1 className="mt-3 text-display-md font-display tracking-[-0.025em] text-paper">
            About
          </h1>
        </div>
        <button
          disabled={pending}
          onClick={() =>
            start(async () => {
              await updateAbout(state);
              setSavedAt(new Date());
            })
          }
          className="rounded-full bg-paper px-5 py-2 font-mono text-label uppercase tracking-[0.14em] text-ink-950 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <Text variant="label" className="text-paper/50">
            Editor
          </Text>
          <div className="mt-4 space-y-5">
            <FieldShell label="Headline">
              <Textarea
                rows={3}
                value={state.headline}
                onChange={(e) => setState({ ...state, headline: e.target.value })}
              />
            </FieldShell>
            <FieldShell label="Body">
              <Textarea
                rows={12}
                value={state.body}
                onChange={(e) => setState({ ...state, body: e.target.value })}
              />
            </FieldShell>
            {savedAt && (
              <Text variant="caption" className="text-paper/40">
                Saved {savedAt.toLocaleTimeString()}
              </Text>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <Text variant="label" className="text-paper/50">
            Preview
          </Text>
          <div className="mt-6 space-y-4">
            <h2 className="text-display-sm font-display tracking-[-0.025em] text-paper">
              {state.headline}
            </h2>
            <p className="text-body-lg font-light leading-relaxed text-paper/75">{state.body}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
