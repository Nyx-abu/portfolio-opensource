import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadToCloudinary, getResourceType } from "@/lib/cloudinary";
import { rateLimit, rateLimitResponse, getClientIp, limits } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_BYTES = 50 * 1024 * 1024; // 50MB for videos

const ALLOWED = new Set([
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",
  // Documents
  "text/markdown",
  "text/x-markdown",
  "text/plain", // .md often sent as text/plain
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_EXTS = new Set([
  "jpg", "jpeg", "png", "webp", "gif", "avif",
  "mp4", "webm", "mov",
  "md", "pdf", "doc", "docx",
]);

// Text formats (markdown, plain text) lack reliable magic bytes — we skip the
// signature check for them and rely on MIME + extension.
const TEXT_TYPES = new Set(["text/markdown", "text/x-markdown", "text/plain"]);

type Signature = { kind: string; offset: number; bytes: number[] };

const SIGNATURES: Signature[] = [
  { kind: "image/jpeg", offset: 0, bytes: [0xff, 0xd8, 0xff] },
  { kind: "image/png", offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { kind: "image/gif", offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] },
  { kind: "image/webp", offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF — also check WEBP at +8
  { kind: "video/webm", offset: 0, bytes: [0x1a, 0x45, 0xdf, 0xa3] },
  { kind: "application/pdf", offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] },
  { kind: "application/msword", offset: 0, bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] },
  { kind: "application/zip", offset: 0, bytes: [0x50, 0x4b, 0x03, 0x04] }, // .docx
];

function matchesSig(buf: Buffer, sig: Signature) {
  if (buf.length < sig.offset + sig.bytes.length) return false;
  for (let i = 0; i < sig.bytes.length; i++) {
    if (buf[sig.offset + i] !== sig.bytes[i]) return false;
  }
  return true;
}

function detectKind(buf: Buffer, _declaredType: string): string | null {
  if (matchesSig(buf, { kind: "image/webp", offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] })) {
    if (buf.length >= 12 && buf.slice(8, 12).toString("ascii") === "WEBP") return "image/webp";
  }
  if (buf.length >= 12) {
    const ftyp = buf.slice(4, 8).toString("ascii");
    if (ftyp === "ftyp") {
      const brand = buf.slice(8, 12).toString("ascii");
      if (brand.startsWith("avif") || brand === "avis") return "image/avif";
      if (brand.startsWith("qt")) return "video/quicktime";
      if (
        brand === "isom" || brand === "iso2" || brand === "mp41" ||
        brand === "mp42" || brand === "avc1" || brand === "M4V "
      ) return "video/mp4";
    }
  }
  for (const sig of SIGNATURES) {
    if (matchesSig(buf, sig)) {
      // .doc and .docx both can match "msword" / zip respectively, normalize via declared
      if (sig.kind === "application/zip") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      return sig.kind;
    }
  }
  return null;
}

function isCompatible(detected: string, declared: string): boolean {
  if (detected === declared) return true;
  // Browsers sometimes send weird MIME types; accept reasonable equivalences.
  if (detected === "image/jpeg" && declared === "image/jpg") return true;
  if (
    detected === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
    declared === "application/zip"
  ) return true;
  return false;
}

function safeBaseName(name: string): string {
  // Strip directory components, null bytes, and any ../ traversal segments.
  const stripped = name.split(/[\\/]/).pop() ?? name;
  const noNull = stripped.replace(/\0/g, "");
  const noTraversal = noNull.replace(/\.\./g, "");
  return noTraversal
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60) || "upload";
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = `upload:${session.user.id ?? session.user.email ?? getClientIp(req)}`;
  const rl = rateLimit(key, limits.upload);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 413 });
  }

  const ext = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase() ?? ""
    : "";

  if (!ALLOWED.has(file.type) && !ALLOWED_EXTS.has(ext)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type} (.${ext})` },
      { status: 415 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    if (!TEXT_TYPES.has(file.type)) {
      const detected = detectKind(buffer, file.type);
      if (!detected) {
        return NextResponse.json(
          { error: "File content does not match a recognized binary format" },
          { status: 415 },
        );
      }
      if (file.type && !isCompatible(detected, file.type)) {
        return NextResponse.json(
          { error: `Declared type ${file.type} does not match detected ${detected}` },
          { status: 415 },
        );
      }
    }

    const resourceType = getResourceType(file.type);
    const safeName = safeBaseName(file.name);
    const publicId = `${safeName}_${Date.now()}`;

    const result = await uploadToCloudinary(buffer, {
      folder: "portfolio",
      resourceType,
      publicId,
    });

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      type: resourceType,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json(
      { error: "Upload failed. Check Cloudinary credentials." },
      { status: 500 },
    );
  }
}
