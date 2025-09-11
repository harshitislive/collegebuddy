import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendMail } from "@/services/mailing.service";

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return NextResponse.json({ message: "If email exists, link sent." })

        // Generate token
        const token = crypto.randomBytes(32).toString("hex")
        const expiry = new Date(Date.now() + 1000 * 60 * 15) 

        await prisma.user.update({
            where: { email },
            data: { resetToken: token, resetTokenExpiry: expiry },
        })

        

        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

        sendMail({
            recipient: email,
            subject: "Password Reset",
            message: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        })

        return NextResponse.json({ message: "Reset link sent if email exists." }, { status: 200 });
    } catch (error) {
        console.error("Error in while creating reset token:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
