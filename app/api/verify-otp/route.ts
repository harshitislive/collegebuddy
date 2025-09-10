import { NextResponse } from "next/server";
import { otpStore } from "../send-otp/route";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ message: "Email and code required" }, { status: 400 });
    }

    if (otpStore[email] && otpStore[email] === code) {
      // OTP correct → cleanup
      delete otpStore[email];
      return NextResponse.json({ success: true, message: "OTP verified" });
    }

    return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
