import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_ADMIN = ["/admin/login"];
const isProd = process.env.NODE_ENV === "production";

// CSP is built dynamically: 'unsafe-eval' is needed by Next dev (HMR) but stripped in prod.
function buildCsp() {
  const scriptSrc = isProd
    ? "'self' 'unsafe-inline' https://*.posthog.com"
    : "'self' 'unsafe-inline' 'unsafe-eval' https://*.posthog.com";
  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://res.cloudinary.com https://avatars.githubusercontent.com https://raw.githubusercontent.com",
    "media-src 'self' https://res.cloudinary.com",
    "connect-src 'self' https://*.posthog.com https://api.github.com https://github.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https://github.com",
    "object-src 'none'",
  ].join("; ");
}

function applySecurityHeaders(res: NextResponse) {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  res.headers.set("Content-Security-Policy", buildCsp());
  if (isProd) {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
  return res;
}

export default auth((req) => {
  const { nextUrl } = req;
  const isAdmin = nextUrl.pathname.startsWith("/admin");
  const isLogin = PUBLIC_ADMIN.some((p) => nextUrl.pathname.startsWith(p));
  const signedIn = Boolean(req.auth?.user);

  if (isAdmin && !isLogin && !signedIn) {
    const url = new URL("/admin/login", nextUrl.origin);
    url.searchParams.set("from", nextUrl.pathname);
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  if (isLogin && signedIn) {
    return applySecurityHeaders(NextResponse.redirect(new URL("/admin", nextUrl.origin)));
  }
  return applySecurityHeaders(NextResponse.next());
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts/).*)"],
};
