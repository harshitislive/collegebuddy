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
    const firstQuery = url.searchParams.get("first");   // fetch first lectures of all courses

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

    let lectures;

    if (firstQuery) {
      // fetch first lecture of each enrolled course
      lectures = await prisma.lecture.findMany({
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
                select: { id: true, title: true },
              },
            },
          },
        },
        distinct: ["subjectId"], // first lecture of each subject
      });
    } else if (courseQuery) {
      // fetch all lectures of the selected course
      lectures = await prisma.lecture.findMany({
        where: {
          subject: {
            courseId: courseQuery,
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
    } else {
      // fallback: fetch first lecture of each course
      lectures = await prisma.lecture.findMany({
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
        distinct: ["subjectId"],
      });
    }

    const lecturesWithCourse = lectures.map((lec) => ({
      id: lec.id,
      title: lec.title,
      url: lec.url,
      courseId: lec.subject.course.id,
      courseTitle: lec.subject.course.title,
      subject: lec.subject.name,
    }));

    return NextResponse.json({ lectures: lecturesWithCourse }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
