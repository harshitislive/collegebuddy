import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get logged-in user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        referralsMade: {
          include: {
            referee: {
              include: {
                courses: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
        earnings: true,
      },
    });


    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Compute earnings stats
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    const monthAgo = new Date(now);
    monthAgo.setMonth(now.getMonth() - 1);

    const weekly = user.earnings
      .filter((e) => e.createdAt >= weekAgo)
      .reduce((sum, e) => sum + e.amount, 0);

    const monthly = user.earnings
      .filter((e) => e.createdAt >= monthAgo)
      .reduce((sum, e) => sum + e.amount, 0);

    const total = user.earnings.reduce((sum, e) => sum + e.amount, 0);

    const successCount = user.referralsMade.filter(
      (r) => r.type === "SUCCESS"
    ).length;

    const pendingCount = user.referralsMade.filter(
      (r) => r.type === "PENDING" || r.type === "GUEST"
    ).length;

    const rejectedCount = user.referralsMade.filter(
      (r) => r.type === "REJECTED"
    ).length;

    // Transform referral data for UI
    const referrals = user.referralsMade.map((r) => ({
      id: r.id,
      type: r.type,
      name: r.referee?.name || null,
      email: r.referee?.email || null,
      phoneNo: r.referee?.phoneNo || null,
      courseCode: r.referee?.courses?.[0]?.courseId || null,
      amount:
        r.type === "SUCCESS"
          ? user.earnings.find((e) => e.source === "REFERRAL" && e.createdAt >= r.createdAt)?.amount ||
            null
          : null,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({
      stats: {
        referralCode: user.referralCode,
        weekly,
        monthly,
        total,
        successCount,
        pendingCount,
        rejectedCount,
      },
      referrals,
    });
  } catch (error) {
    console.error("Referrals API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch referrals" },
      { status: 500 }
    );
  }
}
