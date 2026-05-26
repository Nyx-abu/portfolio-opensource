import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";

const GH_API = "https://api.github.com";

function getRedirectUri(): string {
  const base = process.env.AUTH_URL ?? "http://localhost:3000";
  return `${base}/api/github/callback`;
}

export function getGitHubAuthUrl(state: string): string {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) throw new Error("GITHUB_CLIENT_ID is not set");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    scope: "public_repo",
    state,
    allow_signup: "false",
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}

export async function exchangeCodeForToken(
  code: string,
): Promise<{ accessToken: string; scope: string }> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: getRedirectUri(),
    }),
  });
  if (!res.ok) throw new Error(`OAuth token exchange failed: ${res.status}`);
  const data = (await res.json()) as {
    access_token?: string;
    scope?: string;
    error?: string;
    error_description?: string;
  };
  if (!data.access_token) {
    throw new Error(data.error_description ?? data.error ?? "No access token returned");
  }
  return { accessToken: data.access_token, scope: data.scope ?? "" };
}

async function ghFetch<T = unknown>(token: string, path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${GH_API}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "portfolio-importer",
    },
  });
  const remaining = res.headers.get("X-RateLimit-Remaining");
  if (remaining !== null && parseInt(remaining, 10) === 0) {
    throw new Error("GitHub API rate limit exhausted");
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${res.status} ${path}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export type GhRepo = {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  updated_at: string;
  private: boolean;
  owner: { login: string };
};

export type GhUser = { login: string; avatar_url: string };
export type GhContentEntry = {
  name: string;
  path: string;
  type: "file" | "dir" | "symlink" | "submodule";
  download_url: string | null;
};

export async function getAuthenticatedUser(token: string): Promise<GhUser> {
  return ghFetch<GhUser>(token, "/user");
}

export async function getUserRepos(token: string): Promise<GhRepo[]> {
  return ghFetch<GhRepo[]>(
    token,
    "/user/repos?per_page=100&sort=updated&direction=desc&affiliation=owner",
  );
}

export async function getRepoMeta(
  token: string,
  owner: string,
  repo: string,
): Promise<GhRepo & { topics?: string[] }> {
  return ghFetch(token, `/repos/${owner}/${repo}`);
}

export async function getRepoTopics(
  token: string,
  owner: string,
  repo: string,
): Promise<{ names: string[] }> {
  return ghFetch(token, `/repos/${owner}/${repo}/topics`);
}

export async function getRepoLanguages(
  token: string,
  owner: string,
  repo: string,
): Promise<Record<string, number>> {
  return ghFetch(token, `/repos/${owner}/${repo}/languages`);
}

export async function getRepoContents(
  token: string,
  owner: string,
  repo: string,
  path = "",
): Promise<GhContentEntry[] | GhContentEntry> {
  return ghFetch(token, `/repos/${owner}/${repo}/contents/${path}`);
}

const SCREENSHOT_DIRS = [
  "screenshots",
  "docs/images",
  "docs/screenshots",
  "assets/screenshots",
  "assets/images",
  "images",
  "assets",
];
const IMG_EXT = /\.(png|jpg|jpeg|gif|webp|avif)$/i;
const DOC_PATHS = [
  "documentation.md",
  "DOCUMENTATION.md",
  "docs/documentation.md",
  "docs/DOCUMENTATION.md",
];

export type FoundImage = { path: string; downloadUrl: string };

export async function findScreenshots(
  token: string,
  owner: string,
  repo: string,
): Promise<FoundImage[]> {
  const found: FoundImage[] = [];
  const tryDir = async (path: string) => {
    try {
      const listing = await getRepoContents(token, owner, repo, path);
      if (Array.isArray(listing)) {
        for (const entry of listing) {
          if (entry.type === "file" && IMG_EXT.test(entry.name) && entry.download_url) {
            found.push({ path: entry.path, downloadUrl: entry.download_url });
          }
        }
      }
    } catch {
      // dir doesn't exist — fine
    }
  };
  await tryDir("");
  for (const dir of SCREENSHOT_DIRS) await tryDir(dir);
  return found;
}

export type FoundDoc = { path: string; downloadUrl: string; isFallback: boolean };

export async function findDocumentation(
  token: string,
  owner: string,
  repo: string,
): Promise<FoundDoc | null> {
  for (const p of DOC_PATHS) {
    try {
      const entry = await getRepoContents(token, owner, repo, p);
      if (!Array.isArray(entry) && entry.type === "file" && entry.download_url) {
        return { path: entry.path, downloadUrl: entry.download_url, isFallback: false };
      }
    } catch {
      // not found — try next
    }
  }
  try {
    const readme = await ghFetch<{ path: string; download_url: string | null }>(
      token,
      `/repos/${owner}/${repo}/readme`,
    );
    if (readme.download_url) {
      return { path: readme.path, downloadUrl: readme.download_url, isFallback: true };
    }
  } catch {
    // no README either
  }
  return null;
}

export async function getStoredToken(userId: string): Promise<string | null> {
  const record = await prisma.gitHubToken.findUnique({ where: { userId } });
  if (!record) return null;
  return decrypt(record.accessToken, record.iv, record.tag);
}
