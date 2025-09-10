import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// store OTPs in memory for now (replace with DB for production)
const otpStore: Record<string, string> = {};

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    // generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[email] = otp;

    // transporter config
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or SMTP
      auth: {
        user: process.env.SMTP_USER, // your gmail
        pass: process.env.SMTP_PASSWORD, // your app password
      },
    });

    // send email
    await transporter.sendMail({
      from: `"College Buddy" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
      html: `<h2>Your OTP is <b>${otp}</b></h2><p>Valid for 10 minutes.</p>`,
    });

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
  }
}

// export store for verify route
export { otpStore };
