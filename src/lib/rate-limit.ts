import { NextResponse } from "next/server";

// In-memory store. On Vercel this is per-instance, so under heavy fan-out the
// effective limit can be larger than configured — acceptable for an admin
// surface used by one operator. Swap for Upstash/Redis if you ever expose
// these endpoints to anonymous traffic.
type Bucket = { hits: number[] };
const store = new Map<string, Bucket>();

export type RateLimitConfig = {
  windowMs: number;
  max: number;
};

export const limits = {
  upload: { windowMs: 60_000, max: 60 },
  github: { windowMs: 60_000, max: 30 },
  auth: { windowMs: 60_000, max: 10 },
} satisfies Record<string, RateLimitConfig>;

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSec: number };

export function rateLimit(key: string, cfg: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const cutoff = now - cfg.windowMs;
  const bucket = store.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => t > cutoff);
  if (bucket.hits.length >= cfg.max) {
    const oldest = bucket.hits[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + cfg.windowMs - now) / 1000));
    store.set(key, bucket);
    return { ok: false, retryAfterSec };
  }
  bucket.hits.push(now);
  store.set(key, bucket);
  return { ok: true, remaining: cfg.max - bucket.hits.length };
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function rateLimitResponse(retryAfterSec: number) {
  return NextResponse.json(
    { error: "Too many requests", retryAfter: retryAfterSec },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}
