import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Protected routes
const PROTECTED = ["/dashboard", "/notes", "/lectures", "/live", "/referral", "/profile"];
const ADMIN_ONLY = ["/admin"];
const SUPER_ONLY = ["/super-admin"];

// Secret must be Uint8Array for jose
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth =
    PROTECTED.some((p) => pathname.startsWith(p)) ||
    ADMIN_ONLY.some((p) => pathname.startsWith(p)) ||
    SUPER_ONLY.some((p) => pathname.startsWith(p));

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("token")?.value;
  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log("🔑 Middleware payload:", payload);

    // SuperAdmin-only
    if (SUPER_ONLY.some((p) => pathname.startsWith(p)) && payload.role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Admin-only
    if (ADMIN_ONLY.some((p) => pathname.startsWith(p)) && !["ADMIN", "SUPERADMIN"].includes(payload.role as string)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("❌ Invalid token in middleware:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
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
