"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./_helpers";

const socialSchema = z.object({
  platform: z.string().min(1).max(40),
  url: z.string().url(),
  order: z.number().int().default(0),
});

export async function createSocialLink(raw: z.infer<typeof socialSchema>) {
  await requireAdmin();
  const data = socialSchema.parse(raw);
  await prisma.socialLink.create({ data });
  revalidatePath("/");
}

export async function updateSocialLink(id: string, raw: Partial<z.infer<typeof socialSchema>>) {
  await requireAdmin();
  const data = socialSchema.partial().parse(raw);
  await prisma.socialLink.update({ where: { id }, data });
  revalidatePath("/");
}

export async function deleteSocialLink(id: string) {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/");
}
