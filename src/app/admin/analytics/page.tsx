import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

export const dynamic = "force-dynamic";

type Bucket = { date: string; count: number };

async function getData() {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const events = await prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: since } },
      select: { type: true, path: true, device: true, browser: true, referrer: true, createdAt: true, sessionId: true, metadata: true },
    });

    const byDay = new Map<string, number>();
    const byDevice = new Map<string, number>();
    const byBrowser = new Map<string, number>();
    const byReferrer = new Map<string, number>();
    const projectClicks = new Map<string, number>();
    const sessions = new Set<string>();

    for (const e of events) {
      const day = e.createdAt.toISOString().slice(0, 10);
      if (e.type === "page_view") {
        byDay.set(day, (byDay.get(day) ?? 0) + 1);
        if (e.device) byDevice.set(e.device, (byDevice.get(e.device) ?? 0) + 1);
        if (e.browser) byBrowser.set(e.browser, (byBrowser.get(e.browser) ?? 0) + 1);
        if (e.referrer) byReferrer.set(e.referrer, (byReferrer.get(e.referrer) ?? 0) + 1);
      }
      if (e.type === "project_click") {
        const meta = e.metadata as { projectTitle?: string } | null;
        if (meta?.projectTitle)
          projectClicks.set(meta.projectTitle, (projectClicks.get(meta.projectTitle) ?? 0) + 1);
      }
      if (e.sessionId) sessions.add(e.sessionId);
    }

    const days: Bucket[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key.slice(5), count: byDay.get(key) ?? 0 });
    }
    const topProjects = [...projectClicks.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topReferrers = [...byReferrer.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    return {
      total: events.length,
      sessions: sessions.size,
      pageviews: days.reduce((a, b) => a + b.count, 0),
      days,
      byDevice: [...byDevice.entries()],
      byBrowser: [...byBrowser.entries()],
      topProjects,
      topReferrers,
    };
  } catch {
    return null;
  }
}

export default async function AdminAnalytics() {
  const data = await getData();

  return (
    <div className="space-y-10">
      <header>
        <Text variant="caption" className="text-paper/40">
          Insight
        </Text>
        <h1 className="mt-3 text-display-md font-display tracking-[-0.025em] text-paper">
          Analytics
        </h1>
      </header>

      {!data ? (
        <Card className="p-6">
          <Text variant="body" className="text-paper/60">
            Database not configured yet — connect a Postgres URL via{" "}
            <code className="font-mono text-paper">DATABASE_URL</code> to start seeing data.
          </Text>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label="Total events (30d)" value={data.total} />
            <Stat label="Page views (30d)" value={data.pageviews} />
            <Stat label="Unique sessions" value={data.sessions} />
            <Stat label="Top referrers" value={data.topReferrers.length} />
          </div>

          <Card className="p-6">
            <Text variant="label" className="text-paper/50">
              Page views — last 30 days
            </Text>
            <BarChart data={data.days} />
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <Text variant="label" className="text-paper/50">
                Top projects
              </Text>
              <ul className="mt-4 divide-y divide-ink-700/40">
                {data.topProjects.length === 0 ? (
                  <li className="py-4 text-paper/55">No project clicks yet.</li>
                ) : (
                  data.topProjects.map(([title, count]) => (
                    <li key={title} className="flex items-center justify-between py-2.5">
                      <span className="text-body text-paper">{title}</span>
                      <span className="font-mono text-caption text-paper/60">{count}</span>
                    </li>
                  ))
                )}
              </ul>
            </Card>

            <Card className="p-6">
              <Text variant="label" className="text-paper/50">
                Devices & browsers
              </Text>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <BreakdownList title="Device" rows={data.byDevice} />
                <BreakdownList title="Browser" rows={data.byBrowser} />
              </div>
            </Card>
          </div>
        </>
      )}
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

function BarChart({ data }: { data: Bucket[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="mt-6 flex h-40 items-end gap-1">
      {data.map((d) => (
        <div key={d.date} className="group relative flex-1">
          <div
            className="w-full rounded-t bg-accent-500/70 transition-colors group-hover:bg-accent-400"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: 2 }}
            title={`${d.date}: ${d.count}`}
          />
        </div>
      ))}
    </div>
  );
}

function BreakdownList({ title, rows }: { title: string; rows: [string, number][] }) {
  const total = rows.reduce((a, b) => a + b[1], 0) || 1;
  return (
    <div>
      <Text variant="caption" className="text-paper/40">
        {title}
      </Text>
      <ul className="mt-3 space-y-2">
        {rows.map(([k, v]) => (
          <li key={k}>
            <div className="flex items-baseline justify-between">
              <span className="text-body-sm text-paper/85">{k}</span>
              <span className="font-mono text-caption text-paper/50">
                {Math.round((v / total) * 100)}%
              </span>
            </div>
            <div className="mt-1 h-px w-full bg-ink-800">
              <div
                className="h-px bg-accent-500"
                style={{ width: `${(v / total) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
