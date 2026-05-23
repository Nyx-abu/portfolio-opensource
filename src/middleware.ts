import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_ADMIN = ["/admin/login"];

export default auth((req) => {
  const { nextUrl } = req;
  const isAdmin = nextUrl.pathname.startsWith("/admin");
  const isLogin = PUBLIC_ADMIN.some((p) => nextUrl.pathname.startsWith(p));
  const signedIn = Boolean(req.auth?.user);

  if (isAdmin && !isLogin && !signedIn) {
    const url = new URL("/admin/login", nextUrl.origin);
    url.searchParams.set("from", nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isLogin && signedIn) {
    return NextResponse.redirect(new URL("/admin", nextUrl.origin));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
