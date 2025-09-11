import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { enrollments: true } },
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Fetch courses error:", error);
    return NextResponse.json({ message: "Failed to fetch courses" }, { status: 500 });
  }
}
