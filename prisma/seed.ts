import { PrismaClient, ProjectStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const RESET = process.argv.includes("--reset");

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "change-me-on-first-login";

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
      body: "Full-stack engineer based in Chennai, working at the intersection of AI, infrastructure and interface. Over the past 18 months I've shipped production platforms across food-service, education, e-commerce and satellite operations — and I care a lot about what happens to code after it leaves my laptop.",
    },
    create: {
      id: "about-main",
      headline: "I build products the world actually uses.",
      body: "Full-stack engineer based in Chennai, working at the intersection of AI, infrastructure and interface. Over the past 18 months I've shipped production platforms across food-service, education, e-commerce and satellite operations — and I care a lot about what happens to code after it leaves my laptop.",
    },
  });

  const seedProjects = [
    {
      slug: "nori",
      title: "Nori",
      description: "A RAG-powered AI tool discovery platform with hybrid semantic search.",
      longDescription:
        "Nori indexes a curated set of AI tools across categories and lets you search with natural language. The backend pairs PostgreSQL + pgvector with Gemini embeddings and an async worker queue that ingests and embeds new entries from live discovery.\n\nThe frontend is a Next.js 14 + TypeScript + Tailwind app with an infinite React Flow canvas for chaining tools visually — drag-to-connect interactions, custom node rendering, and real-time edit sync. Authentication is handled by Clerk and product analytics via PostHog with a custom 9-event taxonomy covering search, workflow lifecycle, and identification.",
      techStack: ["Next.js 14", "TypeScript", "Tailwind", "pgvector", "Gemini", "React Flow", "Clerk", "PostHog"],
      tags: ["AI", "product", "search"],
      featured: true,
      status: ProjectStatus.PUBLISHED,
      order: 1,
      timeline: "2025",
    },
    {
      slug: "float-dock",
      title: "Float Dock",
      description: "A cross-platform desktop productivity app with a hardened IPC architecture.",
      longDescription:
        "Float Dock is an Electron + React + Vite desktop app built around 37 IPC handlers across renderer ↔ main — sandboxed renderers, context isolation, and Electron safeStorage (Windows DPAPI) for OS-level secret encryption. Open-sourced under MIT; later forked and rebranded as DockShift.\n\nUnder the hood: a GPU-accelerated persistent terminal (xterm.js + node-pty) with shell session restoration across restarts, a Win32 SnapshotManager that captures and restores window layouts in under 2 seconds, and a system-wide clipboard manager with code-vs-binary detection, syntax-aware categorization, and 200-item history.\n\nA hot-swappable multi-provider AI/STT layer (OpenAI, Groq, Google Cloud, Vosk offline) drives live token streaming over custom SSE.",
      techStack: ["Electron", "React", "Vite", "TypeScript", "xterm.js", "node-pty", "Win32"],
      tags: ["desktop", "open-source", "tooling"],
      featured: true,
      status: ProjectStatus.PUBLISHED,
      order: 2,
      timeline: "2024 — 2025",
      githubUrl: "https://github.com/Nyx-abu",
    },
    {
      slug: "parksat-mission-control",
      title: "ParkSat Mission Control",
      description: "Real-time satellite mission-control UI for 5 concurrent operators.",
      longDescription:
        "Built at ShineUp for the ParkSat satellite. A Next.js + TypeScript mission-control interface streaming real-time telemetry over WebSocket/SSE to 5 concurrent operators, backed by 12 REST APIs in Node.js/Express secured with JWT (~200 req/min between dashboard and onboard systems).\n\nTuned PostgreSQL schemas and indexed 8 high-write telemetry tables — p95 query latency dropped ~40% while ingesting ~30 events/sec from satellite data streams. MongoDB sits alongside for unstructured log storage.",
      techStack: ["Next.js", "TypeScript", "Node.js", "Express", "WebSockets", "PostgreSQL", "MongoDB", "JWT"],
      tags: ["real-time", "infrastructure", "data"],
      featured: false,
      status: ProjectStatus.PUBLISHED,
      order: 3,
      timeline: "Nov 2025 — Apr 2026",
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
      id: "exp-shineup",
      company: "ShineUp",
      role: "Full-Stack Developer",
      description:
        "Built mission-control UI for ParkSat satellite operations in Next.js + TypeScript with real-time telemetry over WebSocket/SSE. Shipped 12 JWT-secured REST APIs and tuned 8 high-write telemetry tables (p95 latency −40%).",
      startDate: new Date("2025-11-01"),
      endDate: new Date("2026-04-30"),
      current: false,
      order: 1,
    },
    {
      id: "exp-freelance",
      company: "Freelance",
      role: "Full-Stack Developer",
      description:
        "Shipped 3 production web apps for SMB clients (food-service, education, e-commerce) on Next.js, Node/Express and PostgreSQL/MongoDB — REST + JWT/OAuth, ~500+ MAU. CI/CD on Vercel + AWS with GitHub Actions cut release time from ~30 min to <5 min.",
      startDate: new Date("2024-11-01"),
      endDate: new Date("2025-11-01"),
      current: false,
      order: 2,
    },
    {
      id: "exp-hackwit",
      company: "Hackwit Technologies",
      role: "Software Developer Intern",
      description:
        "Built and maintained 3 internal full-stack platforms in React + Node + PostgreSQL, automating manual reporting and saving ops ~10 hrs/week. Cut page-load 20% via responsive design, route-level code splitting and lazy-loading. Co-pitched React/Node platforms to enterprise partners including KFC.",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-10-31"),
      current: false,
      order: 3,
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
    { name: "C / C++", category: "Languages", order: 5 },

    { name: "Next.js", category: "Frontend", order: 1 },
    { name: "React", category: "Frontend", order: 2 },
    { name: "Tailwind CSS", category: "Frontend", order: 3 },
    { name: "Framer Motion", category: "Frontend", order: 4 },
    { name: "React Flow", category: "Frontend", order: 5 },

    { name: "Node.js", category: "Backend", order: 1 },
    { name: "Express", category: "Backend", order: 2 },
    { name: "REST APIs", category: "Backend", order: 3 },
    { name: "WebSockets / SSE", category: "Backend", order: 4 },
    { name: "JWT / OAuth", category: "Backend", order: 5 },

    { name: "PostgreSQL", category: "Databases", order: 1 },
    { name: "Prisma", category: "Databases", order: 2 },
    { name: "pgvector", category: "Databases", order: 3 },
    { name: "MongoDB", category: "Databases", order: 4 },
    { name: "Redis / Upstash", category: "Databases", order: 5 },

    { name: "RAG", category: "AI / ML", order: 1 },
    { name: "Vector search", category: "AI / ML", order: 2 },
    { name: "Gemini API", category: "AI / ML", order: 3 },
    { name: "OpenAI", category: "AI / ML", order: 4 },
    { name: "Embeddings", category: "AI / ML", order: 5 },

    { name: "Git / GitHub Actions", category: "Tools", order: 1 },
    { name: "Docker", category: "Tools", order: 2 },
    { name: "AWS (EC2 / S3)", category: "Tools", order: 3 },
    { name: "Vercel", category: "Tools", order: 4 },
    { name: "Electron", category: "Tools", order: 5 },
  ];
  for (const s of skills) {
    await prisma.skill.upsert({
      where: { id: `seed-${s.category}-${s.name}` },
      update: s,
      create: { id: `seed-${s.category}-${s.name}`, ...s },
    });
  }

  const social = [
    { id: "seed-github", platform: "GitHub", url: "https://github.com/Nyx-abu", order: 1 },
    {
      id: "seed-linkedin",
      platform: "LinkedIn",
      url: "https://linkedin.com/in/abdur-raheem-k",
      order: 2,
    },
    { id: "seed-email", platform: "Email", url: "mailto:abdurraheem000nyx@gmail.com", order: 3 },
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
