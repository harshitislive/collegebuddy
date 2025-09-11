import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust path if needed
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const gigs = await prisma.gig.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(gigs);
  } catch (error) {
    console.error("Error fetching gigs:", error);
    return NextResponse.json(
      { message: "Failed to fetch gigs" },
      { status: 500 }
    );
  }
}
