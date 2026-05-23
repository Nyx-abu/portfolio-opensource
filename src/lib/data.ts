import { prisma } from "@/lib/db";

const STATIC_FALLBACK = {
  about: {
    headline: "I build software that feels like it was designed by someone who cares.",
    body: "Engineer and designer working at the intersection of product, systems and craft. Currently exploring how interfaces can carry more weight, attention and personality without losing performance.",
  },
} as const;

export async function getAboutContent() {
  try {
    const row = await prisma.aboutContent.findFirst({ orderBy: { updatedAt: "desc" } });
    return row ?? STATIC_FALLBACK.about;
  } catch {
    return STATIC_FALLBACK.about;
  }
}

export async function getFeaturedProjects(limit = 4) {
  try {
    return await prisma.project.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { order: "asc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getAllProjects() {
  try {
    return await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    return await prisma.project.findFirst({ where: { slug, status: "PUBLISHED" } });
  } catch {
    return null;
  }
}

export async function getExperience() {
  try {
    return await prisma.experience.findMany({
      orderBy: [{ current: "desc" }, { startDate: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getSkills() {
  try {
    const rows = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
    const grouped = new Map<string, typeof rows>();
    rows.forEach((s) => {
      const arr = grouped.get(s.category) ?? [];
      arr.push(s);
      grouped.set(s.category, arr);
    });
    return Array.from(grouped.entries()).map(([category, items]) => ({ category, items }));
  } catch {
    return [];
  }
}

export async function getSocialLinks() {
  try {
    return await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}
