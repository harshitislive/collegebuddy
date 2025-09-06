import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export interface VerifyBody {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    enrollmentId: string
};

export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, enrollmentId }: VerifyBody = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: "Missing required parameters", success: false }, { status: 400 })
        }

        const secret = process.env.RAZORPAY_KEY_SECRET as string
        if (!secret) { return NextResponse.json({ error: "Razorpay secret not found" }, { status: 400 }) }

        const HMAC = crypto.createHmac("sha256", secret)
        HMAC.update(`${razorpay_order_id}|${razorpay_payment_id}`)
        const generatedSignature = HMAC.digest("hex")

        if (generatedSignature === razorpay_signature) {
            const payment = await prisma.payment.create({
                data:{
                    enrollmentId: enrollmentId,
                    transactionId: razorpay_order_id,
                    status: 'SUCCESS',
                }
            });

            const courseEnrollment = await prisma.courseEnrollment.update({
                where: {
                    id: enrollmentId,
                },
                data: {
                    paymentId: payment.id,
                },
                include: {
                    student: true, // 👈 this pulls the user record
                    course: true,
                },
            });

            // Now update the user’s role to STUDENT
            await prisma.user.update({
                where: { id: courseEnrollment.studentId },
                data: { role: "STUDENT" },
            });

            return NextResponse.json({ message: "Payment verified successfully", success: true })
        } else {
            return NextResponse.json({ error: "Invalid signature", success: false }, { status: 400 })
        }
        
    } catch (error) {
        console.log("Error verifying payment:", error);
        return NextResponse.json({ error: "An error occurred", success: false }, { status: 500 })
    }
}