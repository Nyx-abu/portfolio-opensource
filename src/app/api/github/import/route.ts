import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  findDocumentation,
  findScreenshots,
  getRepoLanguages,
  getRepoMeta,
  getRepoTopics,
  getStoredToken,
} from "@/lib/github";
import { limits, rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_IMAGES = 6;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rl = rateLimit(`github:${session.user.id}`, limits.github);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

  const body = (await req.json().catch(() => null)) as { owner?: string; repo?: string } | null;
  if (!body || typeof body.owner !== "string" || typeof body.repo !== "string") {
    return NextResponse.json({ error: "Missing owner/repo" }, { status: 400 });
  }
  const { owner, repo } = body;

  const token = await getStoredToken(session.user.id);
  if (!token) {
    return NextResponse.json({ error: "Not connected to GitHub" }, { status: 400 });
  }

  try {
    const meta = await getRepoMeta(token, owner, repo);
    const [topics, languages, screenshots, doc] = await Promise.all([
      getRepoTopics(token, owner, repo).catch(() => ({ names: [] as string[] })),
      getRepoLanguages(token, owner, repo).catch(() => ({} as Record<string, number>)),
      findScreenshots(token, owner, repo).catch(() => []),
      findDocumentation(token, owner, repo).catch(() => null),
    ]);

    const uploadedImages: string[] = [];
    for (const shot of screenshots.slice(0, MAX_IMAGES)) {
      try {
        const r = await fetch(shot.downloadUrl);
        if (!r.ok) continue;
        const buf = Buffer.from(await r.arrayBuffer());
        const baseName =
          shot.path
            .split("/")
            .pop()
            ?.replace(/\.[^.]+$/, "")
            .replace(/[^a-zA-Z0-9_-]/g, "_") ?? "ghimport";
        const result = await uploadToCloudinary(buf, {
          folder: "portfolio/github-imports",
          resourceType: "image",
          publicId: `${meta.name}_${baseName}_${Date.now()}`,
        });
        uploadedImages.push(result.url);
      } catch (e) {
        console.warn("Screenshot upload skipped:", e);
      }
    }

    let documentationUrl: string | null = null;
    let documentationStatus: "found" | "fallback_readme" | "not_found" = "not_found";
    if (doc) {
      try {
        const r = await fetch(doc.downloadUrl);
        if (r.ok) {
          const buf = Buffer.from(await r.arrayBuffer());
          const result = await uploadToCloudinary(buf, {
            folder: "portfolio/github-imports/docs",
            resourceType: "raw",
            publicId: `${meta.name}_doc_${Date.now()}`,
          });
          documentationUrl = result.url;
          documentationStatus = doc.isFallback ? "fallback_readme" : "found";
        }
      } catch (e) {
        console.warn("Documentation upload skipped:", e);
      }
    }

    return NextResponse.json({
      title: meta.name,
      description: meta.description ?? "",
      techStack: Object.keys(languages),
      tags: topics.names ?? [],
      images: uploadedImages,
      githubUrl: meta.html_url,
      documentationUrl,
      documentationStatus,
    });
  } catch (e) {
    console.error("GitHub import error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Import failed" },
      { status: 500 },
    );
  }
}
