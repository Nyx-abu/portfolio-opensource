import { ExperienceManager } from "@/components/admin/ExperienceManager";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminExperience() {
  let rows: Awaited<ReturnType<typeof prisma.experience.findMany>> = [];
  try {
    rows = await prisma.experience.findMany({
      orderBy: [{ current: "desc" }, { startDate: "desc" }],
    });
  } catch {
    rows = [];
  }

  return (
    <ExperienceManager
      initial={rows.map((r) => ({
        id: r.id,
        company: r.company,
        role: r.role,
        description: r.description ?? "",
        startDate: r.startDate.toISOString().slice(0, 10),
        endDate: r.endDate ? r.endDate.toISOString().slice(0, 10) : "",
        current: r.current,
        order: r.order,
      }))}
    />
  );
}
