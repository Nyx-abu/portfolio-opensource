import { PrismaClient, ProjectStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const RESET = process.argv.includes("--reset");

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "admin123";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Admin", passwordHash, role: "ADMIN" },
  });

  if (RESET) {
    await prisma.$transaction([
      prisma.analyticsEvent.deleteMany(),
      prisma.project.deleteMany(),
      prisma.experience.deleteMany(),
      prisma.skill.deleteMany(),
      prisma.socialLink.deleteMany(),
      prisma.aboutContent.deleteMany(),
    ]);
    console.log("Cleared content tables.");
  }

  await prisma.aboutContent.upsert({
    where: { id: "about-main" },
    update: {
      headline: "I build products the world actually uses.",
      body: "Full-stack engineer based in San Francisco, working at the intersection of AI, infrastructure and interface. Over the past 18 months I've shipped production platforms across food-service, education, e-commerce and satellite operations — and I care a lot about what happens to code after it leaves my laptop.",
    },
    create: {
      id: "about-main",
      headline: "I build products the world actually uses.",
      body: "Full-stack engineer based in San Francisco, working at the intersection of AI, infrastructure and interface. Over the past 18 months I've shipped production platforms across food-service, education, e-commerce and satellite operations — and I care a lot about what happens to code after it leaves my laptop.",
    },
  });

  const seedProjects = [
    {
      slug: "open-source-project-1",
      title: "Open Source Project 1",
      description: "A placeholder project description to showcase the portfolio capabilities.",
      longDescription:
        "This is a placeholder long description for the open source project. It demonstrates how project details are rendered on the frontend. The project utilizes various technologies like Next.js, Tailwind, and PostgreSQL.",
      techStack: ["Next.js", "TypeScript", "Tailwind", "PostgreSQL"],
      tags: ["open-source", "demo"],
      featured: true,
      status: ProjectStatus.PUBLISHED,
      order: 1,
      timeline: "2025",
    },
    {
      slug: "demo-project-2",
      title: "Demo Project 2",
      description: "Another placeholder project for testing layout.",
      longDescription:
        "This project showcases different UI elements and how multiple projects are handled in the grid layout.",
      techStack: ["React", "Vite", "TypeScript"],
      tags: ["frontend", "demo"],
      featured: true,
      status: ProjectStatus.PUBLISHED,
      order: 2,
      timeline: "2024",
      githubUrl: "https://github.com/example/demo",
    },
    {
      slug: "backend-api-demo",
      title: "Backend API Demo",
      description: "A placeholder backend service project.",
      longDescription:
        "Demonstrates a backend-focused project without a prominent frontend. Uses Node.js and Express.",
      techStack: ["Node.js", "Express", "MongoDB"],
      tags: ["backend", "api"],
      featured: false,
      status: ProjectStatus.PUBLISHED,
      order: 3,
      timeline: "2023",
    },
  ];

  for (const p of seedProjects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, images: [] },
    });
  }

  const experience = [
    {
      id: "exp-company-a",
      company: "Company A",
      role: "Full-Stack Developer",
      description:
        "Built internal tools and mission-critical applications using Next.js and TypeScript. Improved database query latency by 40%.",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2026-01-01"),
      current: false,
      order: 1,
    },
    {
      id: "exp-company-b",
      company: "Company B",
      role: "Software Engineer",
      description:
        "Shipped 3 production web apps for SMB clients. Automated CI/CD pipelines, cutting release time significantly.",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      current: false,
      order: 2,
    },
  ];
  for (const e of experience) {
    await prisma.experience.upsert({ where: { id: e.id }, update: e, create: e });
  }

  const skills = [
    { name: "TypeScript", category: "Languages", order: 1 },
    { name: "JavaScript", category: "Languages", order: 2 },
    { name: "Python", category: "Languages", order: 3 },
    { name: "SQL", category: "Languages", order: 4 },

    { name: "Next.js", category: "Frontend", order: 1 },
    { name: "React", category: "Frontend", order: 2 },
    { name: "Tailwind CSS", category: "Frontend", order: 3 },

    { name: "Node.js", category: "Backend", order: 1 },
    { name: "Express", category: "Backend", order: 2 },

    { name: "PostgreSQL", category: "Databases", order: 1 },
    { name: "Prisma", category: "Databases", order: 2 },

    { name: "Git / GitHub Actions", category: "Tools", order: 1 },
    { name: "Docker", category: "Tools", order: 2 },
    { name: "Vercel", category: "Tools", order: 3 },
  ];
  for (const s of skills) {
    await prisma.skill.upsert({
      where: { id: `seed-${s.category}-${s.name}` },
      update: s,
      create: { id: `seed-${s.category}-${s.name}`, ...s },
    });
  }

  const social = [
    { id: "seed-github", platform: "GitHub", url: "https://github.com", order: 1 },
    { id: "seed-linkedin", platform: "LinkedIn", url: "https://linkedin.com", order: 2 },
    { id: "seed-email", platform: "Email", url: "mailto:hello@example.com", order: 3 },
  ];
  for (const s of social) {
    await prisma.socialLink.upsert({ where: { id: s.id }, update: s, create: s });
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
