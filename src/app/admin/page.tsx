import Link from "next/link";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { prisma } from "@/lib/db";

async function getStats() {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [publishedProjects, draftProjects, totalViews, uniqueSessions, topProjectClicks] =
      await Promise.all([
        prisma.project.count({ where: { status: "PUBLISHED" } }),
        prisma.project.count({ where: { status: "DRAFT" } }),
        prisma.analyticsEvent.count({ where: { type: "page_view", createdAt: { gte: since } } }),
        prisma.analyticsEvent
          .findMany({
            where: { createdAt: { gte: since } },
            distinct: ["sessionId"],
            select: { sessionId: true },
          })
          .then((rows) => rows.filter((r) => r.sessionId).length),
        prisma.analyticsEvent
          .groupBy({
            by: ["metadata"],
            where: { type: "project_click", createdAt: { gte: since } },
            _count: { _all: true },
          })
          .then(() => null),
      ]);

    return { publishedProjects, draftProjects, totalViews, uniqueSessions, topProjectClicks };
  } catch {
    return {
      publishedProjects: 0,
      draftProjects: 0,
      totalViews: 0,
      uniqueSessions: 0,
      topProjectClicks: null,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-10">
      <header>
        <Text variant="caption" className="text-paper/40">
          Overview
        </Text>
        <h1 className="mt-3 text-display-md font-display tracking-[-0.025em] text-paper">
          Dashboard
        </h1>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Page views (7d)" value={stats.totalViews} />
        <Stat label="Unique sessions" value={stats.uniqueSessions} />
        <Stat label="Published" value={stats.publishedProjects} />
        <Stat label="Drafts" value={stats.draftProjects} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <Text variant="label" className="text-paper/40">
            Quick actions
          </Text>
          <div className="mt-4 flex flex-col gap-3">
            <ActionLink href="/admin/projects/new">+ New project</ActionLink>
            <ActionLink href="/admin/about">Edit about page</ActionLink>
            <ActionLink href="/admin/skills">Manage skills</ActionLink>
            <ActionLink href="/admin/analytics">View analytics</ActionLink>
          </div>
        </Card>

        <Card className="p-6">
          <Text variant="label" className="text-paper/40">
            Recent activity
          </Text>
          <RecentActivity />
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-5">
      <Text variant="caption" className="text-paper/40">
        {label}
      </Text>
      <p className="mt-3 font-display text-h1 text-paper">{value}</p>
    </Card>
  );
}

function ActionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-lg border border-ink-700/40 px-4 py-3 transition-colors hover:border-paper/30 hover:bg-ink-800/40"
    >
      <span className="text-body text-paper">{children}</span>
      <span className="text-paper/40 transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}

async function RecentActivity() {
  let rows: { id: string; type: string; path: string | null; createdAt: Date }[] = [];
  try {
    rows = await prisma.analyticsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, type: true, path: true, createdAt: true },
    });
  } catch {
    rows = [];
  }

  if (rows.length === 0) {
    return (
      <Text variant="body-sm" className="mt-4 text-paper/55">
        No activity yet — visit the public site to start collecting events.
      </Text>
    );
  }

  return (
    <ul className="mt-4 divide-y divide-ink-700/40">
      {rows.map((r) => (
        <li key={r.id} className="flex items-baseline justify-between gap-4 py-2.5">
          <div>
            <span className="font-mono text-caption uppercase tracking-[0.14em] text-accent-300">
              {r.type}
            </span>
            <span className="ml-3 text-body-sm text-paper/70">{r.path ?? "—"}</span>
          </div>
          <span className="font-mono text-caption text-paper/40">
            {new Date(r.createdAt).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
}
