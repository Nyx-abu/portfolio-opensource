"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SocialLink } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { FieldShell, Input } from "./Field";
import { createSocialLink, deleteSocialLink, updateSocialLink } from "@/lib/actions/social";

export function SocialManager({ initial }: { initial: SocialLink[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [draft, setDraft] = useState({ platform: "", url: "" });

  return (
    <div className="space-y-8">
      <header>
        <Text variant="caption" className="text-paper/40">
          Content
        </Text>
        <h1 className="mt-3 text-display-md font-display tracking-[-0.025em] text-paper">
          Social links
        </h1>
      </header>

      <Card className="p-6">
        <Text variant="label" className="text-paper/50">
          Add new
        </Text>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
          <FieldShell label="Platform">
            <Input
              value={draft.platform}
              onChange={(e) => setDraft({ ...draft, platform: e.target.value })}
            />
          </FieldShell>
          <FieldShell label="URL">
            <Input
              value={draft.url}
              onChange={(e) => setDraft({ ...draft, url: e.target.value })}
            />
          </FieldShell>
          <button
            disabled={pending || !draft.platform || !draft.url}
            onClick={() =>
              start(async () => {
                await createSocialLink({ ...draft, order: initial.length });
                setDraft({ platform: "", url: "" });
                router.refresh();
              })
            }
            className="rounded-full bg-paper px-5 py-2.5 font-mono text-label uppercase tracking-[0.14em] text-ink-950 disabled:opacity-50"
          >
            + Add
          </button>
        </div>
      </Card>

      <Card className="p-6">
        <ul className="divide-y divide-ink-700/40">
          {initial.length === 0 ? (
            <li className="py-6 text-center text-paper/55">No social links yet.</li>
          ) : (
            initial.map((s) => (
              <Row
                key={s.id}
                row={s}
                onUpdate={(patch) =>
                  start(async () => {
                    await updateSocialLink(s.id, patch);
                    router.refresh();
                  })
                }
                onDelete={() =>
                  start(async () => {
                    await deleteSocialLink(s.id);
                    router.refresh();
                  })
                }
              />
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}

function Row({
  row,
  onUpdate,
  onDelete,
}: {
  row: SocialLink;
  onUpdate: (patch: Partial<{ platform: string; url: string }>) => void;
  onDelete: () => void;
}) {
  const [platform, setPlatform] = useState(row.platform);
  const [url, setUrl] = useState(row.url);
  return (
    <li className="grid grid-cols-1 items-center gap-3 py-3 md:grid-cols-[1fr_2fr_auto]">
      <input
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        onBlur={() => platform !== row.platform && onUpdate({ platform })}
        className="bg-transparent text-body text-paper outline-none"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onBlur={() => url !== row.url && onUpdate({ url })}
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
