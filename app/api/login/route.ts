import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log("📥 Login attempt:", email);

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("🔎 Found user:", user ? { email: user.email, role: user.role } : "No user");

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check password
    const ok = await bcrypt.compare(password, user.password);
    console.log("🔑 Password check:", ok);

    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create JWT with role
    const tokenPayload = { id: user.id, email: user.email, name: user.name, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: "7d" });
    console.log("🎟️ JWT created for:", tokenPayload);

    // Build response with role
    const res = NextResponse.json({
      message: "Login successful",
      role: user.role, // 👈 important
    });

    // Set cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    console.log("🍪 Cookie set");

    return res;
  } catch (err) {
    console.error("❌ Login error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
