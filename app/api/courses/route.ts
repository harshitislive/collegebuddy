import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const courses = await prisma.course.findMany(
      {
        include: { subjects: true },
        orderBy: { createdAt: "desc" },
      }
    );
    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );    
  }
}