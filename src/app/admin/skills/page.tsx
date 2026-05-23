import { SkillsManager } from "@/components/admin/SkillsManager";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSkills() {
  let skills: Awaited<ReturnType<typeof prisma.skill.findMany>> = [];
  try {
    skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  } catch {
    skills = [];
  }
  return <SkillsManager initial={skills} />;
}
