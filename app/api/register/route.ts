import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // adjust if you use Prisma

export async function POST(req: Request) {
  try {
    const { name, email, password, phoneNo, referralId } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // check if email or phone already exists
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phoneNo }] },
    });

    if (existing) {
      return NextResponse.json(
        { message: "User already exists with this email or phone number" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    await prisma.user.create({
      data: { name, email, password: hashedPassword, phoneNo, referralId },
    });

    return NextResponse.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
