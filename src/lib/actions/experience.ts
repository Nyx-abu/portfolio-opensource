"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./_helpers";

const expSchema = z.object({
  company: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  description: z.string().max(2000).optional().nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  current: z.boolean().default(false),
  order: z.number().int().default(0),
});

export async function createExperience(raw: z.infer<typeof expSchema>) {
  await requireAdmin();
  const data = expSchema.parse(raw);
  await prisma.experience.create({ data });
  revalidatePath("/");
}

export async function updateExperience(id: string, raw: Partial<z.infer<typeof expSchema>>) {
  await requireAdmin();
  const data = expSchema.partial().parse(raw);
  await prisma.experience.update({ where: { id }, data });
  revalidatePath("/");
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
}
