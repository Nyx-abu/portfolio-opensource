import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { auth } from "@/lib/auth";
import { getGitHubAuthUrl } from "@/lib/github";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const state = randomBytes(32).toString("hex");
  let url: string;
  try {
    url = getGitHubAuthUrl(state);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Misconfigured GitHub OAuth" },
      { status: 500 },
    );
  }
  const res = NextResponse.redirect(url);
  res.cookies.set("gh_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
