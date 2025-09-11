// app/api/my-earnings/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust path if needed
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        earnings: true,
        payouts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Aggregate earnings
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const daily = user.earnings
      .filter((e) => e.createdAt >= startOfDay)
      .reduce((sum, e) => sum + e.amount, 0);

    const weekly = user.earnings
      .filter((e) => e.createdAt >= startOfWeek)
      .reduce((sum, e) => sum + e.amount, 0);

    const monthly = user.earnings
      .filter((e) => e.createdAt >= startOfMonth)
      .reduce((sum, e) => sum + e.amount, 0);

    const referral = user.earnings
      .filter((e) => e.source === "REFERRAL")
      .reduce((sum, e) => sum + e.amount, 0);

    const gigs = user.earnings
      .filter((e) => e.source === "GIG")
      .reduce((sum, e) => sum + e.amount, 0);

    return NextResponse.json({
      daily,
      weekly,
      monthly,
      referral,
      gigs,
      payouts: user.payouts,
    });
  } catch (error) {
    console.error("My Earnings API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
