import Link from "next/link";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/db";
import { FeaturedToggle, DeleteButton } from "@/components/admin/ProjectRowActions";
import { GitHubImporter } from "@/components/admin/GitHubImporter";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  } catch {
    projects = [];
  }

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <Text variant="caption" className="text-paper/40">
            Library
          </Text>
          <h1 className="mt-3 text-display-md font-display tracking-[-0.025em] text-paper">
            Projects
          </h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-paper px-5 py-2.5 font-mono text-label uppercase tracking-[0.14em] text-ink-950"
        >
          + New
        </Link>
      </header>

      <GitHubImporter />

      <div className="overflow-x-auto rounded-xl border border-ink-700/40">
        <table className="w-full text-left text-body-sm min-w-[800px]">
          <thead className="border-b border-ink-700/40 bg-ink-900/40">
            <tr className="font-mono uppercase tracking-[0.14em] text-paper/40 [&>th]:px-4 [&>th]:py-3 [&>th]:text-caption">
              <th>Title</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Order</th>
              <th>Updated</th>
              <th className="w-32 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700/40">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-paper/55">
                  No projects yet. Click + New to create one.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} className="[&>td]:px-4 [&>td]:py-3 hover:bg-ink-900/30">
                  <td>
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="font-medium text-paper hover:underline"
                    >
                      {p.title}
                    </Link>
                    <div className="text-caption text-paper/40">{p.slug}</div>
                  </td>
                  <td>
                    {p.status === "PUBLISHED" ? (
                      <Badge tone="live">Published</Badge>
                    ) : (
                      <Badge tone="draft">Draft</Badge>
                    )}
                  </td>
                  <td>
                    <FeaturedToggle id={p.id} featured={p.featured} />
                  </td>
                  <td className="font-mono text-paper/60">{p.order}</td>
                  <td className="font-mono text-caption text-paper/50">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="text-right">
                    <DeleteButton id={p.id} title={p.title} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
