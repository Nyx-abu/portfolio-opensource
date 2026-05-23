import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large" }, { status: 413 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "Unsupported type" }, { status: 415 });

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const safeExt = String(ext).replace(/[^a-z0-9]/gi, "").toLowerCase();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buf);

  return NextResponse.json({ url: `/uploads/${name}` });
}
