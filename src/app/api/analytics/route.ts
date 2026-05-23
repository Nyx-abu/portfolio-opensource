import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

function parseUserAgent(ua: string) {
  const lower = ua.toLowerCase();
  const device = /mobile|iphone|android/.test(lower)
    ? "mobile"
    : /tablet|ipad/.test(lower)
      ? "tablet"
      : "desktop";
  const browser = /firefox/.test(lower)
    ? "firefox"
    : /edg\//.test(lower)
      ? "edge"
      : /chrome/.test(lower)
        ? "chrome"
        : /safari/.test(lower)
          ? "safari"
          : "other";
  return { device, browser };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const h = await headers();
    const ua = h.get("user-agent") ?? "";
    const referrer = h.get("referer") ?? null;
    const country = h.get("x-vercel-ip-country") ?? null;
    const city = h.get("x-vercel-ip-city") ?? null;
    const { device, browser } = parseUserAgent(ua);

    await prisma.analyticsEvent.create({
      data: {
        type: String(body.type ?? "unknown"),
        path: typeof body.path === "string" ? body.path : null,
        sessionId: typeof body.sessionId === "string" ? body.sessionId : null,
        country,
        city,
        device,
        browser,
        referrer,
        metadata: body,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
