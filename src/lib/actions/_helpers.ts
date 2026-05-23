import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHENTICATED");
  if (session.user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return session;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
