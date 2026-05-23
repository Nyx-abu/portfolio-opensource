import { PrismaClient, ProjectStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "change-me-on-first-login";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Admin", passwordHash, role: "ADMIN" },
  });

  await prisma.aboutContent.upsert({
    where: { id: "about-main" },
    update: {},
    create: {
      id: "about-main",
      headline: "I build software that feels like it was designed by someone who cares.",
      body: "Engineer and designer working at the intersection of product, systems and craft. Currently exploring how interfaces can carry more weight, attention and personality without losing performance.",
    },
  });

  const seedProjects = [
    {
      slug: "atlas",
      title: "Atlas",
      description: "A spatial knowledge tool for engineering teams.",
      longDescription:
        "Atlas is a graph-native workspace for designing, reviewing and shipping complex software systems. Built for teams that think in diagrams.",
      techStack: ["TypeScript", "Next.js", "PostgreSQL", "Redis"],
      tags: ["product", "tooling"],
      featured: true,
      status: ProjectStatus.PUBLISHED,
      order: 1,
      timeline: "2024 — present",
    },
    {
      slug: "harbor",
      title: "Harbor",
      description: "A reading environment for long-form research.",
      longDescription:
        "Harbor turns saved articles, papers and notes into a calm, typographically-led reading space. Annotations sync across devices.",
      techStack: ["Swift", "TypeScript", "Cloudflare Workers"],
      tags: ["consumer", "design"],
      featured: true,
      status: ProjectStatus.PUBLISHED,
      order: 2,
      timeline: "2023",
    },
    {
      slug: "echo",
      title: "Echo",
      description: "Realtime voice notes with semantic search.",
      longDescription:
        "Echo records, transcribes and indexes ambient meetings so the parts that matter come back when you need them.",
      techStack: ["Python", "Next.js", "pgvector"],
      tags: ["AI", "tooling"],
      featured: false,
      status: ProjectStatus.PUBLISHED,
      order: 3,
      timeline: "2024",
    },
  ];

  for (const p of seedProjects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, images: [] },
    });
  }

  const skills = [
    { name: "TypeScript", category: "Languages", order: 1 },
    { name: "Python", category: "Languages", order: 2 },
    { name: "Go", category: "Languages", order: 3 },
    { name: "Next.js", category: "Frameworks", order: 1 },
    { name: "React", category: "Frameworks", order: 2 },
    { name: "Node.js", category: "Frameworks", order: 3 },
    { name: "PostgreSQL", category: "Infrastructure", order: 1 },
    { name: "Redis", category: "Infrastructure", order: 2 },
    { name: "Docker", category: "Infrastructure", order: 3 },
    { name: "Figma", category: "Design", order: 1 },
    { name: "Framer", category: "Design", order: 2 },
  ];
  for (const s of skills) {
    await prisma.skill.upsert({
      where: { id: `seed-${s.name}` },
      update: {},
      create: { id: `seed-${s.name}`, ...s },
    });
  }

  const social = [
    { platform: "GitHub", url: "https://github.com", order: 1 },
    { platform: "LinkedIn", url: "https://linkedin.com", order: 2 },
    { platform: "X", url: "https://x.com", order: 3 },
  ];
  for (const s of social) {
    await prisma.socialLink.upsert({
      where: { id: `seed-${s.platform}` },
      update: {},
      create: { id: `seed-${s.platform}`, ...s },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
