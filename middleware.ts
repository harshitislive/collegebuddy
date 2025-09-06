import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Protected routes
const PROTECTED = ["/dashboard", "/notes", "/lectures", "/live", "/referral", "/profile"];
const ADMIN_ONLY = ["/admin"];
const SUPER_ONLY = ["/super-admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Determine if route requires authentication
  const needsAuth =
    PROTECTED.some((p) => pathname.startsWith(p)) ||
    ADMIN_ONLY.some((p) => pathname.startsWith(p)) ||
    SUPER_ONLY.some((p) => pathname.startsWith(p));

  if (!needsAuth) return NextResponse.next();

  // Retrieve NextAuth token/session
  const token = await getToken({ req });
  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Enforce role restrictions based on token contents
  const role = token.role as string | undefined;

  if (SUPER_ONLY.some((p) => pathname.startsWith(p)) && role !== "SUPERADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (
    ADMIN_ONLY.some((p) => pathname.startsWith(p)) &&
    !["ADMIN", "SUPERADMIN"].includes(role ?? "")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/notes/:path*",
    "/lectures/:path*",
    "/live/:path*",
    "/referral/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/super-admin/:path*",
  ],
};
