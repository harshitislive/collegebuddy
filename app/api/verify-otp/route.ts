import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) return NextResponse.json({ message: "Email and code required" }, { status: 400 });

    const record = await prisma.otp.findFirst({ where: { email, code } });

    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    // OTP valid → cleanup
    await prisma.otp.deleteMany({ where: { email } });

    return NextResponse.json({ success: true, message: "OTP verified" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
