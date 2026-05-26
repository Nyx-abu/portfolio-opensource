"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProjectStatus } from "@prisma/client";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { FieldShell, Input, Textarea, Select, Checkbox, TagInput } from "./Field";
import { createProject, updateProject } from "@/lib/actions/projects";

type State = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  techStack: string[];
  tags: string[];
  images: string[];
  liveUrl: string;
  githubUrl: string;
  videoUrl: string;
  videoUrls: string[];
  documentationUrl: string;
  timeline: string;
  status: ProjectStatus;
  featured: boolean;
  order: number;
};

const empty: State = {
  title: "",
  slug: "",
  description: "",
  longDescription: "",
  techStack: [],
  tags: [],
  images: [],
  liveUrl: "",
  githubUrl: "",
  videoUrl: "",
  videoUrls: [],
  documentationUrl: "",
  timeline: "",
  status: ProjectStatus.DRAFT,
  featured: false,
  order: 0,
};

export function ProjectEditor({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: State;
}) {
  const router = useRouter();
  const [state, setState] = useState<State>(initial ?? empty);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [autoSaved, setAutoSaved] = useState<Date | null>(null);
  const lastSnapshot = useRef<string>(JSON.stringify(initial ?? empty));

  // Autosave every 30s if changed and in edit mode
  useEffect(() => {
    if (mode !== "edit" || !state.id) return;
    const id = state.id;
    const t = setInterval(() => {
      const snap = JSON.stringify(state);
      if (snap === lastSnapshot.current) return;
      lastSnapshot.current = snap;
      updateProject(id, toPayload(state))
        .then(() => setAutoSaved(new Date()))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(t);
  }, [mode, state]);

  const save = (status: ProjectStatus) => {
    setError(null);
    start(async () => {
      try {
        if (mode === "create") {
          const created = await createProject(toPayload({ ...state, status }));
          router.push(`/admin/projects/${created.id}`);
        } else if (state.id) {
          await updateProject(state.id, toPayload({ ...state, status }));
          router.refresh();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      }
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Text variant="caption" className="text-paper/40">
            {mode === "create" ? "New project" : `Editing · ${state.title || "Untitled"}`}
          </Text>
          <h1 className="mt-3 text-display-md font-display tracking-[-0.025em] text-paper">
            {state.title || "Untitled"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {autoSaved && (
            <span className="font-mono text-caption text-paper/40">
              Saved {autoSaved.toLocaleTimeString()}
            </span>
          )}
          <button
            type="button"
            disabled={pending}
            onClick={() => save(ProjectStatus.DRAFT)}
            className="rounded-full border border-ink-700/60 px-4 py-2 font-mono text-label uppercase tracking-[0.14em] text-paper hover:bg-ink-800/60 disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => save(ProjectStatus.PUBLISHED)}
            className="rounded-full bg-paper px-5 py-2 font-mono text-label uppercase tracking-[0.14em] text-ink-950 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Publish"}
          </button>
        </div>
      </header>

      {error && (
        <Card className="border-rose-500/40 p-4">
          <Text variant="body-sm" className="text-rose-300">
            {error}
          </Text>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="space-y-5">
              <FieldShell label="Title">
                <Input
                  value={state.title}
                  onChange={(e) => setState({ ...state, title: e.target.value })}
                />
              </FieldShell>
              <FieldShell label="Slug" hint="URL-safe; leave blank to auto-generate">
                <Input
                  value={state.slug}
                  placeholder="auto-from-title"
                  onChange={(e) => setState({ ...state, slug: e.target.value })}
                />
              </FieldShell>
              <FieldShell label="One-line description">
                <Input
                  value={state.description}
                  onChange={(e) => setState({ ...state, description: e.target.value })}
                />
              </FieldShell>
              <FieldShell label="Long description" hint="Plain text; paragraphs separated by blank lines">
                <Textarea
                  rows={10}
                  value={state.longDescription}
                  onChange={(e) => setState({ ...state, longDescription: e.target.value })}
                />
              </FieldShell>
            </div>
          </Card>

          <Card className="p-6">
            <Text variant="label" className="text-paper/50">
              Images
            </Text>
            <div className="mt-4">
              <ImagesEditor
                images={state.images}
                onChange={(images) => setState({ ...state, images })}
              />
            </div>
          </Card>

          <Card className="p-6">
            <Text variant="label" className="text-paper/50">
              Videos
            </Text>
            <div className="mt-4 space-y-4">
              <FieldShell label="Legacy embed URL (YouTube / Vimeo)">
                <Input
                  value={state.videoUrl}
                  placeholder="https://www.youtube.com/embed/…"
                  onChange={(e) => setState({ ...state, videoUrl: e.target.value })}
                />
              </FieldShell>
              <FieldShell label="Additional video URLs" hint="Add video embed URLs one at a time">
                <VideoUrlsEditor
                  urls={state.videoUrls}
                  onChange={(videoUrls) => setState({ ...state, videoUrls })}
                />
              </FieldShell>
              {[state.videoUrl, ...state.videoUrls].filter(Boolean).length > 0 && (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {[state.videoUrl, ...state.videoUrls].filter(Boolean).map((url) => (
                    <div key={url} className="aspect-video w-full overflow-hidden rounded-lg bg-ink-900">
                      <iframe src={url} className="h-full w-full" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <Text variant="label" className="text-paper/50">
              Documentation
            </Text>
            <div className="mt-4">
              <DocumentationUploader
                url={state.documentationUrl}
                onChange={(documentationUrl) => setState({ ...state, documentationUrl })}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <Text variant="label" className="text-paper/50">
              Meta
            </Text>
            <div className="mt-4 space-y-4">
              <FieldShell label="Status">
                <Select
                  value={state.status}
                  onChange={(e) =>
                    setState({ ...state, status: e.target.value as ProjectStatus })
                  }
                >
                  <option value={ProjectStatus.DRAFT}>Draft</option>
                  <option value={ProjectStatus.PUBLISHED}>Published</option>
                </Select>
              </FieldShell>
              <Checkbox
                label="Featured on homepage"
                checked={state.featured}
                onChange={(e) => setState({ ...state, featured: e.target.checked })}
              />
              <FieldShell label="Display order">
                <Input
                  type="number"
                  value={state.order}
                  onChange={(e) => setState({ ...state, order: Number(e.target.value) || 0 })}
                />
              </FieldShell>
              <FieldShell label="Timeline">
                <Input
                  value={state.timeline}
                  placeholder="2024 — present"
                  onChange={(e) => setState({ ...state, timeline: e.target.value })}
                />
              </FieldShell>
            </div>
          </Card>

          <Card className="p-6">
            <Text variant="label" className="text-paper/50">
              Links
            </Text>
            <div className="mt-4 space-y-4">
              <FieldShell label="Live URL">
                <Input
                  value={state.liveUrl}
                  onChange={(e) => setState({ ...state, liveUrl: e.target.value })}
                />
              </FieldShell>
              <FieldShell label="GitHub URL">
                <Input
                  value={state.githubUrl}
                  onChange={(e) => setState({ ...state, githubUrl: e.target.value })}
                />
              </FieldShell>
            </div>
          </Card>

          <Card className="p-6">
            <Text variant="label" className="text-paper/50">
              Tags
            </Text>
            <div className="mt-4 space-y-4">
              <FieldShell label="Tech stack">
                <TagInput
                  value={state.techStack}
                  onChange={(techStack) => setState({ ...state, techStack })}
                  placeholder="TypeScript, Next.js…"
                />
              </FieldShell>
              <FieldShell label="Tags">
                <TagInput
                  value={state.tags}
                  onChange={(tags) => setState({ ...state, tags })}
                  placeholder="product, design…"
                />
              </FieldShell>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function toPayload(s: State) {
  return {
    title: s.title,
    slug: s.slug || undefined,
    description: s.description,
    longDescription: s.longDescription || null,
    techStack: s.techStack,
    tags: s.tags,
    images: s.images,
    liveUrl: s.liveUrl || null,
    githubUrl: s.githubUrl || null,
    videoUrl: s.videoUrl || null,
    videoUrls: s.videoUrls,
    documentationUrl: s.documentationUrl || null,
    timeline: s.timeline || null,
    status: s.status,
    featured: s.featured,
    order: s.order,
  };
}

function ImagesEditor({
  images,
  onChange,
}: {
  images: string[];
  onChange: (next: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string };
      if (data.url) onChange([...images, data.url]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label
        className="flex h-32 cursor-pointer items-center justify-center rounded-lg border border-dashed border-ink-700/60 text-paper/50 hover:border-paper/40 hover:text-paper"
        onDragOver={(e) => e.preventDefault()}
        onDrop={async (e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) await upload(f);
        }}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) await upload(f);
          }}
        />
        {uploading ? "Uploading…" : "Drop image or click to upload"}
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((src, i) => (
            <div key={src} className="group relative aspect-[4/3] overflow-hidden rounded-md">
              <Image src={src} alt="" fill className="object-cover" />
              <div className="absolute inset-0 flex items-end justify-between gap-1 bg-gradient-to-t from-ink-950/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (i === 0) return;
                      const next = [...images];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      onChange(next);
                    }}
                    className="rounded bg-paper px-1.5 text-caption text-ink-950"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (i === images.length - 1) return;
                      const next = [...images];
                      [next[i + 1], next[i]] = [next[i], next[i + 1]];
                      onChange(next);
                    }}
                    className="rounded bg-paper px-1.5 text-caption text-ink-950"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onChange(images.filter((_, j) => j !== i))}
                  className="rounded bg-rose-500/80 px-1.5 text-caption text-paper"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VideoUrlsEditor({
  urls,
  onChange,
}: {
  urls: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...urls, trimmed]);
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="https://www.youtube.com/embed/…"
          className="flex-1 rounded-lg border border-ink-700/60 bg-ink-900 px-3 py-2 text-body-sm text-paper placeholder:text-paper/30 focus:border-paper/40 focus:outline-none"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-ink-700/60 px-3 py-2 font-mono text-caption uppercase tracking-[0.12em] text-paper/60 hover:bg-ink-800/60 hover:text-paper"
        >
          + Add
        </button>
      </div>
      {urls.length > 0 && (
        <div className="space-y-1">
          {urls.map((url, i) => (
            <div key={`${url}-${i}`} className="flex items-center gap-2 rounded-md bg-ink-900/60 px-3 py-1.5 text-body-sm">
              <span className="flex-1 truncate text-paper/60">{url}</span>
              <button
                type="button"
                onClick={() => onChange(urls.filter((_, j) => j !== i))}
                className="text-rose-300/80 hover:text-rose-300 text-caption"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentationUploader({
  url,
  onChange,
}: {
  url: string;
  onChange: (next: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string };
      if (data.url) onChange(data.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label
        className="flex h-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-ink-700/60 text-paper/50 hover:border-paper/40 hover:text-paper"
        onDragOver={(e) => e.preventDefault()}
        onDrop={async (e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) await upload(f);
        }}
      >
        <input
          type="file"
          accept=".md,.pdf,.doc,.docx,text/markdown,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) await upload(f);
          }}
        />
        {uploading ? "Uploading…" : "Drop .md, .pdf, or .docx — or click to upload"}
      </label>

      {url && (
        <div className="flex items-center gap-3 rounded-md bg-ink-900/60 px-3 py-2">
          <span className="text-body-sm text-paper/60 truncate flex-1">{url}</span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-caption uppercase tracking-[0.12em] text-accent-300 hover:text-accent-200"
          >
            Preview
          </a>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-rose-300/80 hover:text-rose-300 text-caption"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
