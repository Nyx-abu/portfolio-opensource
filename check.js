const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.project.findMany({ select: { title: true, githubUrl: true, liveUrl: true } }).then(console.log).finally(() => prisma.$disconnect());
