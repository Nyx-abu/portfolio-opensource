import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { siteUrl } from "@/lib/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/projects`, changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    return [
      ...base,
      ...projects.map((p) => ({
        url: `${siteUrl}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return base;
  }
}
