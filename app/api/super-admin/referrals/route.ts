import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ✅ GET all referrals
export async function GET() {
  try {
    const referrals = await prisma.referralTransaction.findMany({
      include: {
        referee: {
          select: { id: true, name: true, email: true, phoneNo: true },
        },
        referrer: {
          select: { id: true, name: true, email: true },
        },
        // If you linked course in referralTransaction, fetch it here:
        // course: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(referrals);
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return NextResponse.json(
      { message: "Failed to fetch referrals" },
      { status: 500 }
    );
  }
}

// ✅ PATCH update referral status
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, status, message } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { message: "Referral ID and status required" },
        { status: 400 }
      );
    }

    const updated = await prisma.referralTransaction.update({
      where: { id },
      data: {
        status, // must match enum in schema
        message: message || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating referral:", error);
    return NextResponse.json(
      { message: "Failed to update referral" },
      { status: 500 }
    );
  }
}