import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const courseQuery = url.searchParams.get("course"); // specific course if selected
    const categoryQuery = url.searchParams.get("category"); // optional filter by category (UNIT, PYQ, LIVE)

    // ✅ Get all paid enrollments of the user
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

    let notes;

    if (courseQuery) {
      // fetch all notes of the selected course
      notes = await prisma.note.findMany({
        where: {
          subject: {
            courseId: courseQuery,
          },
          ...(categoryQuery ? { category: categoryQuery as any } : {}), // optional filter
        },
        include: {
          subject: {
            select: {
              name: true,
              course: {
                select: { id: true, title: true },
              },
            },
          },
        }
      });
    } else {
      // fetch all notes of all enrolled courses
      notes = await prisma.note.findMany({
        where: {
          subject: {
            courseId: { in: courseIds },
          },
          ...(categoryQuery ? { category: categoryQuery as any } : {}),
        },
        include: {
          subject: {
            select: {
              name: true,
              course: {
                select: { id: true, title: true },
              },
            },
          },
        }
      });
    }

    return NextResponse.json({ notes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
