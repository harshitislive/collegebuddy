import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const data = await req.json();
        const { id } = await context.params;
        if(!id) {
            return NextResponse.json({ message: "Referral ID is required" }, { status: 400 });
        }

        const referral_transaction = await prisma.referralTransaction.findUnique({
            where: {
                id
            }
        })

        if(!referral_transaction) {
            return NextResponse.json({ message: "Referral not found" }, { status: 404 });
        }

        if(referral_transaction?.status === 'APPROVED') {
            return NextResponse.json({ message: "Referral already completed" }, { status: 400 });
        }

        const { status, message } = data;

        const updated_referral = await prisma.referralTransaction.update({
            where: {
                id,
            },
            data: {
                status,
                message,
            },
        });

        return NextResponse.json({ updated_referral }, { status: 200 });
    } catch (error) {
        console.log("Error updating referral:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}