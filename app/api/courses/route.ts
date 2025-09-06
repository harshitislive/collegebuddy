import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const courses = await prisma.course.findMany();
    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );    
  }
}