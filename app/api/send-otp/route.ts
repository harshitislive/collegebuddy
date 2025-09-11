import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

    // generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // delete old OTPs for this email
    await prisma.otp.deleteMany({ where: { email } });

    // save OTP in DB
    await prisma.otp.create({
      data: {
        email,
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min expiry
      },
    });

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // send email
    await transporter.sendMail({
      from: `"College Buddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your CollegeBuddy OTP Code",
      text: `Your OTP is ${otp}`,
      html: `<h2>Your OTP is <b>${otp}</b></h2><p>Valid for 10 minutes.</p>`,
    });

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
  }
}
