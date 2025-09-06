import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const paidEnrollments = await prisma.courseEnrollment.findMany({
      where: {
        studentId: token.sub!,
        payment: {
          status: "SUCCESS",
        },
      },
      select: {
        courseId: true,
      },
    });

    if (paidEnrollments.length === 0) {
      return new Response("Payment required", { status: 403 });
    }

    const courseIds = paidEnrollments.map((e) => e.courseId);

    const liveSessions = await prisma.liveSession.findMany({
      where: {
        subject: {
          courseId: { in: courseIds },
        },
      },
      include: {
        subject: {
          select: {
            name: true,
            course: {
              select: { title: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ liveSessions }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
