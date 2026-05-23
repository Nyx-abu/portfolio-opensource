"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./_helpers";

const aboutSchema = z.object({
  headline: z.string().min(1).max(500),
  body: z.string().min(1).max(4000),
});

export async function updateAbout(raw: z.infer<typeof aboutSchema>) {
  await requireAdmin();
  const data = aboutSchema.parse(raw);
  const existing = await prisma.aboutContent.findFirst({ orderBy: { updatedAt: "desc" } });
  if (existing) {
    await prisma.aboutContent.update({ where: { id: existing.id }, data });
  } else {
    await prisma.aboutContent.create({ data });
  }
  revalidatePath("/");
}
