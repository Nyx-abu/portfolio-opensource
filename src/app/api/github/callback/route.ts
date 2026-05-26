import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { exchangeCodeForToken } from "@/lib/github";
import { encrypt } from "@/lib/crypto";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }
  const jar = await cookies();
  const cookieState = jar.get("gh_oauth_state")?.value;
  if (!cookieState || cookieState !== state) {
    return NextResponse.json({ error: "Invalid OAuth state (possible CSRF)" }, { status: 400 });
  }

  try {
    const { accessToken, scope } = await exchangeCodeForToken(code);
    const enc = encrypt(accessToken);
    await prisma.gitHubToken.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        accessToken: enc.ciphertext,
        iv: enc.iv,
        tag: enc.tag,
        scope,
      },
      update: {
        accessToken: enc.ciphertext,
        iv: enc.iv,
        tag: enc.tag,
        scope,
      },
    });
  } catch (e) {
    console.error("GitHub OAuth callback error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "OAuth exchange failed" },
      { status: 500 },
    );
  }

  const res = NextResponse.redirect(new URL("/admin/projects?gh=connected", req.url));
  res.cookies.delete("gh_oauth_state");
  return res;
}
