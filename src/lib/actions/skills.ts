"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./_helpers";

const skillSchema = z.object({
  name: z.string().min(1).max(60),
  category: z.string().min(1).max(60),
  order: z.number().int().default(0),
});

export async function createSkill(raw: z.infer<typeof skillSchema>) {
  await requireAdmin();
  const data = skillSchema.parse(raw);
  await prisma.skill.create({ data });
  revalidatePath("/");
}

export async function updateSkill(id: string, raw: Partial<z.infer<typeof skillSchema>>) {
  await requireAdmin();
  const data = skillSchema.partial().parse(raw);
  await prisma.skill.update({ where: { id }, data });
  revalidatePath("/");
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
}

export async function reorderSkills(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, i) => prisma.skill.update({ where: { id }, data: { order: i } })),
  );
  revalidatePath("/");
}
