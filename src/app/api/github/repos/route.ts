import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAuthenticatedUser, getStoredToken, getUserRepos } from "@/lib/github";
import { limits, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rl = rateLimit(`github:${session.user.id}`, limits.github);
  if (!rl.ok) return rateLimitResponse(rl.retryAfterSec);

  const token = await getStoredToken(session.user.id);
  if (!token) {
    return NextResponse.json({ connected: false, repos: [] });
  }

  try {
    const [user, repos] = await Promise.all([
      getAuthenticatedUser(token),
      getUserRepos(token),
    ]);
    return NextResponse.json({
      connected: true,
      user: { login: user.login, avatarUrl: user.avatar_url },
      repos: repos.map((r) => ({
        name: r.name,
        fullName: r.full_name,
        owner: r.owner.login,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        url: r.html_url,
        updatedAt: r.updated_at,
        private: r.private,
      })),
    });
  } catch (e) {
    console.error("GitHub repos fetch error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch repos" },
      { status: 502 },
    );
  }
}
