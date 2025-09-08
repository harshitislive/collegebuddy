import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET → list all courses with subjects + enrollments count
export async function GET() {
  const courses = await prisma.course.findMany({
    include: {
      subjects: true,
      _count: { select: { enrollments: true } }, // 👈 show count of enrollments
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(courses);
}

// POST → create new course
export async function POST(req: Request) {
  try {
    const { title, code, price = 0, discount = 0, referralComission = 0 } =
      await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Course title is required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: { title, code, price, discount, referralComission },
    });

    return NextResponse.json(course);
  } catch (err) {
    console.error("Error creating course:", err);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}

// PUT → update existing course
export async function PUT(req: Request) {
  try {
    const {
      id,
      title,
      code,
      price = 0,
      discount = 0,
      referralComission = 0,
    } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.course.update({
      where: { id },
      data: { title, code, price, discount, referralComission },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating course:", err);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

// DELETE → remove a course (and cascade delete subjects)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Delete subjects linked to this course first
    await prisma.subject.deleteMany({ where: { courseId: id } });

    // Delete the course
    await prisma.course.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting course:", err);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
