import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const revalidate = 60;

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ projects: [] });
  }
}
