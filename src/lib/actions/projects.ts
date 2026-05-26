"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ProjectStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin, slugify } from "./_helpers";

const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(120).optional(),
  description: z.string().min(1).max(500),
  longDescription: z.string().optional().nullable(),
  techStack: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  liveUrl: z.string().url().optional().nullable().or(z.literal("")),
  githubUrl: z.string().url().optional().nullable().or(z.literal("")),
  videoUrl: z.string().url().optional().nullable().or(z.literal("")),
  videoUrls: z.array(z.string()).default([]),
  documentationUrl: z.string().optional().nullable().or(z.literal("")),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.DRAFT),
  featured: z.boolean().default(false),
  timeline: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;

function clean(v: string | null | undefined) {
  if (!v) return null;
  return v.length === 0 ? null : v;
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function createProject(raw: ProjectInput) {
  await requireAdmin();
  const data = projectSchema.parse(raw);
  const slug = data.slug ? slugify(data.slug) : slugify(data.title);
  const project = await prisma.project.create({
    data: {
      ...data,
      slug,
      liveUrl: clean(data.liveUrl),
      githubUrl: clean(data.githubUrl),
      videoUrl: clean(data.videoUrl),
      documentationUrl: clean(data.documentationUrl),
      longDescription: clean(data.longDescription),
      timeline: clean(data.timeline),
    },
  });
  revalidate();
  return project;
}

export async function updateProject(id: string, raw: Partial<ProjectInput>) {
  await requireAdmin();
  const data = projectSchema.partial().parse(raw);
  const update: Record<string, unknown> = { ...data };
  if (data.slug) update.slug = slugify(data.slug);
  for (const k of ["liveUrl", "githubUrl", "videoUrl", "documentationUrl", "longDescription", "timeline"] as const) {
    if (k in data) update[k] = clean(data[k] as string | null | undefined);
  }
  const project = await prisma.project.update({ where: { id }, data: update });
  revalidate();
  revalidatePath(`/projects/${project.slug}`);
  return project;
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidate();
}

export async function toggleFeatured(id: string) {
  await requireAdmin();
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.project.update({ where: { id }, data: { featured: !existing.featured } });
  revalidate();
}

export async function reorderProjects(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, i) => prisma.project.update({ where: { id }, data: { order: i } })),
  );
  revalidate();
}
