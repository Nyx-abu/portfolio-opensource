import { SocialManager } from "@/components/admin/SocialManager";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSocial() {
  let rows: Awaited<ReturnType<typeof prisma.socialLink.findMany>> = [];
  try {
    rows = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  } catch {
    rows = [];
  }
  return <SocialManager initial={rows} />;
}
