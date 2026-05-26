"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/actions/projects";

type Repo = {
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  updatedAt: string;
  private: boolean;
};

type ReposResponse = {
  connected: boolean;
  user?: { login: string; avatarUrl: string };
  repos: Repo[];
  error?: string;
};

type ImportResponse = {
  title: string;
  description: string;
  techStack: string[];
  tags: string[];
  images: string[];
  githubUrl: string;
  documentationUrl: string | null;
  documentationStatus: "found" | "fallback_readme" | "not_found";
};

export function GitHubImporter() {
  const router = useRouter();
  const [state, setState] = useState<ReposResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [importingFor, setImportingFor] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [docStatus, setDocStatus] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/github/repos");
        const data = (await res.json()) as ReposResponse;
        if (!cancelled) setState(data);
      } catch {
        if (!cancelled) setState({ connected: false, repos: [], error: "Network error" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleImport(repo: Repo) {
    setImportingFor(repo.fullName);
    setImportError(null);
    setDocStatus(null);
    try {
      const res = await fetch("/api/github/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner: repo.owner, repo: repo.name }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `Import failed: ${res.status}`);
      }
      const data = (await res.json()) as ImportResponse;
      if (data.documentationStatus === "not_found") {
        setDocStatus("Documentation not found in repo. Project created without docs.");
      } else if (data.documentationStatus === "fallback_readme") {
        setDocStatus("Used README.md as documentation fallback.");
      }
      startTransition(async () => {
        try {
          const created = await createProject({
            title: data.title,
            description: data.description || `Imported from ${repo.fullName}`,
            longDescription: null,
            techStack: data.techStack,
            tags: data.tags,
            images: data.images,
            videoUrls: [],
            liveUrl: "",
            githubUrl: data.githubUrl,
            videoUrl: "",
            documentationUrl: data.documentationUrl ?? "",
            status: "DRAFT",
            featured: false,
            timeline: null,
            order: 0,
          });
          router.push(`/admin/projects/${created.id}`);
        } catch (err) {
          setImportError(err instanceof Error ? err.message : "Project creation failed");
          setImportingFor(null);
        }
      });
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Import failed");
      setImportingFor(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-ink-700/40 bg-ink-900/30 px-4 py-3 text-caption text-paper/50">
        Checking GitHub connection…
      </div>
    );
  }

  if (!state?.connected) {
    return (
      <div className="rounded-xl border border-ink-700/40 bg-ink-900/30 px-4 py-4 flex items-center justify-between gap-4">
        <div>
          <div className="font-mono text-caption uppercase tracking-[0.14em] text-paper/40">
            GitHub
          </div>
          <div className="mt-1 text-body-sm text-paper/80">
            Connect to import repos as projects.
          </div>
          {state?.error ? (
            <div className="mt-1 text-caption text-rose-300/80">{state.error}</div>
          ) : null}
        </div>
        <a
          href="/api/github/authorize"
          className="rounded-full bg-paper px-4 py-2 font-mono text-label uppercase tracking-[0.14em] text-ink-950"
        >
          Connect GitHub
        </a>
      </div>
    );
  }

  const filtered = state.repos.filter((r) =>
    filter ? r.fullName.toLowerCase().includes(filter.toLowerCase()) : true,
  );

  return (
    <div className="rounded-xl border border-ink-700/40 bg-ink-900/30">
      <div className="flex items-center justify-between gap-3 border-b border-ink-700/40 px-4 py-3">
        <div className="flex items-center gap-2 text-caption text-paper/60">
          <span className="font-mono uppercase tracking-[0.14em] text-paper/40">GitHub</span>
          <span className="text-paper/30">·</span>
          <span>@{state.user?.login}</span>
        </div>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter repos…"
          className="rounded-md border border-ink-700/40 bg-ink-950/60 px-2 py-1 text-caption text-paper outline-none focus:border-accent-500/60"
        />
      </div>
      {importError ? (
        <div className="border-b border-rose-500/30 bg-rose-500/10 px-4 py-2 text-caption text-rose-300">
          {importError}
        </div>
      ) : null}
      {docStatus ? (
        <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-caption text-amber-200">
          {docStatus}
        </div>
      ) : null}
      <ul className="max-h-72 divide-y divide-ink-700/30 overflow-y-auto">
        {filtered.length === 0 ? (
          <li className="px-4 py-6 text-center text-caption text-paper/50">No repos match.</li>
        ) : (
          filtered.map((r) => (
            <li
              key={r.fullName}
              className="flex items-center justify-between gap-3 px-4 py-2.5"
            >
              <div className="min-w-0">
                <div className="truncate text-body-sm text-paper">{r.fullName}</div>
                {r.description ? (
                  <div className="truncate text-caption text-paper/50">{r.description}</div>
                ) : null}
                <div className="mt-0.5 flex items-center gap-2 font-mono text-caption text-paper/40">
                  {r.language ? <span>{r.language}</span> : null}
                  <span>★ {r.stars}</span>
                  {r.private ? <span className="text-amber-300/70">private</span> : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleImport(r)}
                disabled={importingFor !== null}
                className="rounded-full border border-paper/40 px-3 py-1 font-mono text-caption uppercase tracking-[0.14em] text-paper hover:bg-paper hover:text-ink-950 disabled:opacity-40"
              >
                {importingFor === r.fullName ? "Importing…" : "Import"}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
