// app/api/verify/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) return NextResponse.json({ error: "Token missing" }, { status: 400 })

    const record = await prisma.verificationToken.findUnique({ where: { token } })

    if (!record || record.expiresAt < new Date()) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    await prisma.user.update({
        where: { id: record.userId },
        data: { isVerified: true },
    })

    await prisma.verificationToken.delete({ where: { id: record.id } })

    return NextResponse.json({ message: "Email verified successfully!" })
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
